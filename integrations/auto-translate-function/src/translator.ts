import type { PageTranslationTask } from './messages';
import { SitecoreApiError, type JobStatus, type SitecoreApiClient } from './sitecore-api';

type TranslatorClient = Pick<
  SitecoreApiClient,
  'translatePage' | 'getJobStatus' | 'getLatestVersion' | 'getPageState' | 'setWorkflowState'
>;

export interface TranslatorOptions {
  /** How often to poll a running job. */
  pollIntervalMs?: number;
  /** Give up waiting for one job after this long (the job may still finish). */
  jobTimeoutMs?: number;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
  log?: (message: string) => void;
}

export interface LanguageOutcome {
  language: string;
  outcome: 'translated' | 'finished-unconfirmed' | 'timed-out' | 'failed-permanently';
  seconds: number;
  detail?: string;
  /** What happened to the new version's workflow state (only with translationWorkflowState). */
  workflow?: string;
  /** True when the new version could not be moved out of a final state: review before publishing. */
  workflowResetFailed?: boolean;
}

export interface TaskResult {
  outcomes: LanguageOutcome[];
  /** Set when a retryable failure stopped the run; these languages still need translating. */
  retry?: { languages: string[]; reason: string };
}

const DEFAULTS = { pollIntervalMs: 3_000, jobTimeoutMs: 4 * 60_000 };

/**
 * Translates a page into its target languages one at a time, waiting for each Sitecore job to
 * finish before starting the next, so no two jobs write the page's datasources at once.
 *
 * - A job that reports errors, or a throttling/server/network error, stops the run and returns
 *   the languages left (including the failed one) so the caller can re-queue just those.
 * - A permanent API error (400/403/404) for one language is recorded and the run moves on.
 * - A job still running after jobTimeoutMs is recorded as timed out and not retried, because
 *   retrying would start a second job for the same language.
 * - With task.translationWorkflowState set, a new language version that landed in a final
 *   (approved) workflow state is moved to that state, so it can't be published unreviewed.
 */
export async function translatePageSequentially(
  task: PageTranslationTask,
  client: TranslatorClient,
  options: TranslatorOptions = {}
): Promise<TaskResult> {
  const pollIntervalMs = options.pollIntervalMs ?? DEFAULTS.pollIntervalMs;
  const jobTimeoutMs = options.jobTimeoutMs ?? DEFAULTS.jobTimeoutMs;
  const sleep = options.sleep ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
  const now = options.now ?? Date.now;
  const log = options.log ?? (() => undefined);

  const outcomes: LanguageOutcome[] = [];
  const languages = task.targetLanguages;

  for (let index = 0; index < languages.length; index++) {
    const language = languages[index]!;
    const startedAt = now();
    const seconds = () => Math.round((now() - startedAt) / 100) / 10;
    const remaining = languages.slice(index);

    let versionBefore: number | undefined;
    if (task.translationWorkflowState) {
      try {
        versionBefore = await client.getLatestVersion(task.pageId, task.siteName, language);
      } catch (error) {
        log(`${language}: could not read versions before translating: ${String(error)}`);
      }
    }

    let handle: string | undefined;
    try {
      const started = await client.translatePage({
        pageId: task.pageId,
        siteId: task.siteId,
        sourceLanguage: task.sourceLanguage,
        targetLanguage: language,
        strategy: task.strategy,
      });
      handle = started.handle;
      log(`${language}: job started (${handle ?? `no handle; response ${started.raw || '(empty)'}`})`);
    } catch (error) {
      if (error instanceof SitecoreApiError && !error.retryable) {
        outcomes.push({ language, outcome: 'failed-permanently', seconds: seconds(), detail: error.message });
        continue;
      }
      return { outcomes, retry: { languages: remaining, reason: `${language}: could not start job: ${String(error)}` } };
    }

    if (!handle) {
      // Can't follow the job, so it can't be confirmed; a short pause keeps jobs apart.
      await sleep(pollIntervalMs * 5);
      outcomes.push({
        language,
        outcome: 'finished-unconfirmed',
        seconds: seconds(),
        detail: 'no job handle',
        ...(await resetWorkflow(task, language, versionBefore, client)),
      });
      continue;
    }

    let status: JobStatus | undefined;
    let seen = false;
    try {
      for (;;) {
        status = await client.getJobStatus(handle);
        if (!status) break; // 404: finished and already cleaned up
        seen = true;
        if (status.done) break;
        if (now() - startedAt > jobTimeoutMs) break;
        await sleep(pollIntervalMs);
      }
    } catch (error) {
      // The job was started; retrying this language could translate it twice. Record and move on.
      outcomes.push({
        language,
        outcome: 'finished-unconfirmed',
        seconds: seconds(),
        detail: `status check failed: ${String(error)}`,
        ...(await resetWorkflow(task, language, versionBefore, client)),
      });
      continue;
    }

    if (status && !status.done) {
      outcomes.push({
        language,
        outcome: 'timed-out',
        seconds: seconds(),
        detail: `job ${handle} still running`,
        ...(task.translationWorkflowState
          ? { workflow: 'not checked: job still running', workflowResetFailed: true }
          : {}),
      });
      continue;
    }
    if (status && status.errors.length > 0) {
      return {
        outcomes,
        retry: { languages: remaining, reason: `${language}: job reported errors: ${status.errors.join(' | ')}` },
      };
    }
    outcomes.push({
      language,
      outcome: status ? 'translated' : 'finished-unconfirmed',
      seconds: seconds(),
      detail: status || seen ? undefined : 'job finished before its status could be read',
      ...(await resetWorkflow(task, language, versionBefore, client)),
    });
  }

  return { outcomes };
}

function sameId(a: string | undefined, b: string): boolean {
  const clean = (value: string) => value.replace(/[{}]/g, '').toLowerCase();
  return a !== undefined && clean(a) === clean(b);
}

/**
 * Moves the version a translation job just created out of a final workflow state.
 * Never throws: the translation itself succeeded, so a failure here is reported, not retried.
 */
async function resetWorkflow(
  task: PageTranslationTask,
  language: string,
  versionBefore: number | undefined,
  client: TranslatorClient
): Promise<Pick<LanguageOutcome, 'workflow' | 'workflowResetFailed'>> {
  const targetState = task.translationWorkflowState;
  if (!targetState) return {};

  try {
    const version = await client.getLatestVersion(task.pageId, task.siteName, language);
    if (versionBefore !== undefined && version <= versionBefore) return { workflow: 'no new version' };

    const state = await client.getPageState(task.pageId, task.siteName, language, { version, withWorkflow: true });
    const workflow = state?.workflow;
    if (!workflow?.id) return { workflow: `v${version}: not in a workflow` };
    if (sameId(workflow.id, targetState)) return { workflow: `v${version}: already ${workflow.displayName ?? targetState}` };
    if (!workflow.finalState) return { workflow: `v${version}: left in ${workflow.displayName ?? workflow.id}` };

    await client.setWorkflowState(task.pageId, language, version, targetState);
    const check = await client.getPageState(task.pageId, task.siteName, language, { version, withWorkflow: true });
    if (sameId(check?.workflow?.id, targetState)) {
      return { workflow: `v${version}: ${workflow.displayName ?? 'final'} -> ${check?.workflow?.displayName ?? targetState}` };
    }
    return {
      workflow: `v${version}: still ${check?.workflow?.displayName ?? 'unknown'} after the update`,
      workflowResetFailed: true,
    };
  } catch (error) {
    return { workflow: `could not reset: ${String(error)}`, workflowResetFailed: true };
  }
}
