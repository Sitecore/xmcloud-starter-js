import { describe, expect, it, vi } from 'vitest';
import type { TranslationRequest } from '../src/messages';
import { planTranslation } from '../src/planner';
import type { PageState, SiteInfo } from '../src/sitecore-api';

const REQUEST: TranslationRequest = {
  itemId: 'p1',
  itemName: 'About Us',
  sourceLanguage: 'en',
  approvedBy: 'sitecore\\author',
  receivedAt: '2026-01-01T10:00:00.000Z',
};

const SITE: SiteInfo = { id: 's1', name: 'main-website', languages: ['en', 'de-DE', 'ja-JP'] };
const CONFIG = { siteName: 'main-website', targetLanguages: [] as string[], strategy: 'AddVersion' as const };

function client(site: SiteInfo | undefined, page: PageState | undefined) {
  return {
    findSiteByName: vi.fn(async () => site),
    getPageState: vi.fn(async () => page),
  };
}

describe('planTranslation', () => {
  it('creates one page task listing every target language', async () => {
    const plan = await planTranslation(REQUEST, CONFIG, client(SITE, { id: 'p1', displayName: 'About' }));

    expect(plan).toEqual({
      kind: 'task',
      notOnSite: [],
      task: {
        pageId: 'p1',
        pageName: 'About',
        siteId: 's1',
        siteName: 'main-website',
        sourceLanguage: 'en',
        targetLanguages: ['de-DE', 'ja-JP'],
        completedLanguages: [],
        strategy: 'AddVersion',
        attempt: 1,
        approvedBy: 'sitecore\\author',
        receivedAt: REQUEST.receivedAt,
      },
    });
  });

  it('skips items that are not pages (for example datasources)', async () => {
    const plan = await planTranslation(REQUEST, CONFIG, client(SITE, undefined));
    expect(plan).toMatchObject({ kind: 'skip' });
  });

  it('skips items without presentation in the source language', async () => {
    const page = { id: 'p1', versions: [{ language: 'en', version: 1, hasPresentation: false }] };
    const plan = await planTranslation(REQUEST, CONFIG, client(SITE, page));
    expect(plan).toMatchObject({ kind: 'skip' });
  });

  it('skips when the site is not found', async () => {
    const plan = await planTranslation(REQUEST, CONFIG, client(undefined, { id: 'p1' }));
    expect(plan).toMatchObject({ kind: 'skip', reason: expect.stringContaining('SITECORE_SITE_NAME') });
  });

  it('skips when the site only has the source language', async () => {
    const plan = await planTranslation(REQUEST, CONFIG, client({ ...SITE, languages: ['en'] }, { id: 'p1' }));
    expect(plan).toMatchObject({ kind: 'skip' });
  });
});
