import { describe, expect, it, vi } from 'vitest';
import type { PageTranslationTask } from '../src/messages';
import { SitecoreApiError, type JobStatus } from '../src/sitecore-api';
import { translatePageSequentially } from '../src/translator';

const TASK: PageTranslationTask = {
  pageId: 'p1',
  siteId: 's1',
  siteName: 'main-website',
  sourceLanguage: 'en',
  targetLanguages: ['ja-JP', 'de-DE', 'es-ES'],
  completedLanguages: [],
  strategy: 'AddVersion',
  attempt: 1,
  receivedAt: '2026-01-01T10:00:00.000Z',
};

/** A fake clock: sleep() advances time instead of waiting. */
function clock() {
  let time = 0;
  return { now: () => time, sleep: async (ms: number) => void (time += ms) };
}

type StatusScript = Array<JobStatus | undefined>;

const APPROVED = { id: '{FCA998C5-0CC3-4F91-94D8-0A4E6CAECE88}', displayName: 'Approved', finalState: true };
const DRAFT_ID = '{190B1C84-F1BE-47ED-AA41-F42193D9C8FC}';

interface FakeOptions {
  startErrors?: Record<string, Error>;
  /** Workflow state new versions get (translations copy the source's state). undefined = no workflow. */
  newVersionState?: { id: string; displayName: string; finalState: boolean } | undefined;
  setWorkflowStateError?: Error;
}

/**
 * Fake client. Each started job gets the next status script; getJobStatus walks through it.
 * Starting a job adds a version in that language. Records the order of calls so tests can
 * check that jobs never overlap.
 */
function fakeClient(scripts: Record<string, StatusScript>, options: FakeOptions = {}) {
  const { startErrors = {} } = options;
  const newVersionState = 'newVersionState' in options ? options.newVersionState : APPROVED;
  const events: string[] = [];
  const running = new Map<string, StatusScript>();
  const versions: Record<string, number> = {};
  const states = new Map<string, { id: string; displayName: string; finalState: boolean } | undefined>();
  return {
    events,
    states,
    translatePage: vi.fn(async ({ targetLanguage }: { targetLanguage: string }) => {
      events.push(`start ${targetLanguage}`);
      const error = startErrors[targetLanguage];
      if (error) throw error;
      versions[targetLanguage] = (versions[targetLanguage] ?? 1) + 1;
      states.set(`${targetLanguage}:${versions[targetLanguage]}`, newVersionState);
      running.set(`job-${targetLanguage}`, [...(scripts[targetLanguage] ?? [undefined])]);
      return { handle: `job-${targetLanguage}`, raw: '' };
    }),
    getJobStatus: vi.fn(async (handle: string) => {
      const script = running.get(handle)!;
      const status = script.length > 1 ? script.shift() : script[0];
      events.push(`status ${handle} ${status ? (status.done ? 'done' : 'running') : 'gone'}`);
      return status;
    }),
    getLatestVersion: vi.fn(async (_pageId: string, _site: string, language: string) => versions[language] ?? 1),
    getPageState: vi.fn(async (pageId: string, _site: string, language: string, opts: { version?: number } = {}) => ({
      id: pageId,
      workflow: states.get(`${language}:${opts.version}`),
    })),
    setWorkflowState: vi.fn(async (_pageId: string, language: string, version: number, stateId: string) => {
      if (options.setWorkflowStateError) throw options.setWorkflowStateError;
      states.set(`${language}:${version}`, { id: stateId, displayName: 'Draft', finalState: false });
    }),
  };
}

const running = (): JobStatus => ({ done: false, errors: [] });
const done = (errors: string[] = []): JobStatus => ({ done: true, errors });

describe('translatePageSequentially', () => {
  it('waits for each job to finish before starting the next language', async () => {
    const client = fakeClient({
      'ja-JP': [running(), running(), done()],
      'de-DE': [running(), done()],
      'es-ES': [done()],
    });

    const result = await translatePageSequentially(TASK, client, clock());

    expect(result.retry).toBeUndefined();
    expect(result.outcomes.map((o) => [o.language, o.outcome])).toEqual([
      ['ja-JP', 'translated'],
      ['de-DE', 'translated'],
      ['es-ES', 'translated'],
    ]);
    expect(client.events).toEqual([
      'start ja-JP',
      'status job-ja-JP running',
      'status job-ja-JP running',
      'status job-ja-JP done',
      'start de-DE',
      'status job-de-DE running',
      'status job-de-DE done',
      'start es-ES',
      'status job-es-ES done',
    ]);
  });

  it('stops at a job that reports errors and returns that language and the rest for a retry', async () => {
    const client = fakeClient({ 'ja-JP': [done()], 'de-DE': [done(['Item is locked'])] });

    const result = await translatePageSequentially(TASK, client, clock());

    expect(result.outcomes.map((o) => o.language)).toEqual(['ja-JP']);
    expect(result.retry).toEqual({
      languages: ['de-DE', 'es-ES'],
      reason: 'de-DE: job reported errors: Item is locked',
    });
    expect(client.events).not.toContain('start es-ES');
  });

  it('returns the languages left for a retry when a job cannot be started (throttling)', async () => {
    const client = fakeClient({}, { startErrors: { 'de-DE': new SitecoreApiError(429, 'Translate', 'slow down') } });

    const result = await translatePageSequentially(TASK, client, clock());

    expect(result.retry?.languages).toEqual(['de-DE', 'es-ES']);
  });

  it('records a permanent error for one language and carries on with the others', async () => {
    const client = fakeClient({}, { startErrors: { 'de-DE': new SitecoreApiError(400, 'Translate', 'Unknown language') } });

    const result = await translatePageSequentially(TASK, client, clock());

    expect(result.retry).toBeUndefined();
    expect(result.outcomes.map((o) => [o.language, o.outcome])).toEqual([
      ['ja-JP', 'finished-unconfirmed'],
      ['de-DE', 'failed-permanently'],
      ['es-ES', 'finished-unconfirmed'],
    ]);
  });

  it('gives up waiting on a job that runs too long, without retrying it, and moves on', async () => {
    const client = fakeClient({ 'ja-JP': [running()], 'de-DE': [done()], 'es-ES': [done()] });

    const result = await translatePageSequentially(TASK, client, { ...clock(), pollIntervalMs: 1000, jobTimeoutMs: 5000 });

    expect(result.retry).toBeUndefined();
    expect(result.outcomes[0]).toMatchObject({ language: 'ja-JP', outcome: 'timed-out' });
    expect(result.outcomes.slice(1).map((o) => o.outcome)).toEqual(['translated', 'translated']);
  });

  describe('with translationWorkflowState (Draft)', () => {
    const WITH_DRAFT = { ...TASK, targetLanguages: ['de-DE'], translationWorkflowState: DRAFT_ID };

    it('moves a new version that copied the Approved state back to Draft', async () => {
      const client = fakeClient({ 'de-DE': [done()] });

      const result = await translatePageSequentially(WITH_DRAFT, client, clock());

      expect(result.outcomes[0]).toMatchObject({ language: 'de-DE', outcome: 'translated', workflow: 'v2: Approved -> Draft' });
      expect(result.outcomes[0]!.workflowResetFailed).toBeUndefined();
      expect(client.setWorkflowState).toHaveBeenCalledWith('p1', 'de-DE', 2, DRAFT_ID);
      expect(client.states.get('de-DE:2')).toMatchObject({ finalState: false });
    });

    it('leaves pages without a workflow alone', async () => {
      const client = fakeClient({ 'de-DE': [done()] }, { newVersionState: undefined });

      const result = await translatePageSequentially(WITH_DRAFT, client, clock());

      expect(result.outcomes[0]).toMatchObject({ workflow: 'v2: not in a workflow' });
      expect(client.setWorkflowState).not.toHaveBeenCalled();
    });

    it('reports a failed reset without retrying the translation', async () => {
      const client = fakeClient({ 'de-DE': [done()] }, { setWorkflowStateError: new SitecoreApiError(403, 'Patch', 'denied') });

      const result = await translatePageSequentially(WITH_DRAFT, client, clock());

      expect(result.retry).toBeUndefined();
      expect(result.outcomes[0]).toMatchObject({ outcome: 'translated', workflowResetFailed: true });
      expect(client.translatePage).toHaveBeenCalledTimes(1);
    });

    it('does nothing without the setting', async () => {
      const client = fakeClient({ 'de-DE': [done()] });

      await translatePageSequentially({ ...WITH_DRAFT, translationWorkflowState: undefined }, client, clock());

      expect(client.getLatestVersion).not.toHaveBeenCalled();
      expect(client.setWorkflowState).not.toHaveBeenCalled();
    });
  });
});
