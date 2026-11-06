import type { WorkerConfig } from './config';
import { pickTargetLanguages, sameLanguage } from './languages';
import type { PageTranslationTask, TranslationRequest } from './messages';
import type { PageState, SitecoreApiClient } from './sitecore-api';

export type PlanResult =
  | { kind: 'task'; task: PageTranslationTask; notOnSite: string[] }
  | { kind: 'skip'; reason: string };

type PlannerClient = Pick<SitecoreApiClient, 'findSiteByName' | 'getPageState'>;

/**
 * Turns one approved source-language item into one page task listing its target languages.
 *
 * Items that aren't pages (datasources, dictionary entries, settings) are skipped: the Pages API
 * only translates pages, and the UI's page translation also translates the page's datasources.
 */
export async function planTranslation(
  request: TranslationRequest,
  config: Pick<WorkerConfig, 'siteName' | 'targetLanguages' | 'strategy' | 'translationWorkflowState'>,
  client: PlannerClient
): Promise<PlanResult> {
  const site = await client.findSiteByName(config.siteName);
  if (!site) {
    return { kind: 'skip', reason: `Site "${config.siteName}" was not found. Check SITECORE_SITE_NAME.` };
  }

  const page = await client.getPageState(request.itemId, site.name, request.sourceLanguage);
  if (!isPage(page, request.sourceLanguage)) {
    return {
      kind: 'skip',
      reason: `Item ${request.itemId} (${request.itemName ?? 'unnamed'}) is not a page of site "${site.name}".`,
    };
  }

  const { targets, notOnSite } = pickTargetLanguages(site.languages, request.sourceLanguage, config.targetLanguages);
  if (targets.length === 0) {
    return { kind: 'skip', reason: `Site "${site.name}" has no target languages besides ${request.sourceLanguage}.` };
  }

  const task: PageTranslationTask = {
    pageId: request.itemId,
    pageName: page?.displayName ?? request.itemName,
    siteId: site.id,
    siteName: site.name,
    sourceLanguage: request.sourceLanguage,
    targetLanguages: targets,
    completedLanguages: [],
    strategy: config.strategy,
    translationWorkflowState: config.translationWorkflowState,
    attempt: 1,
    approvedBy: request.approvedBy,
    receivedAt: request.receivedAt,
  };

  return { kind: 'task', task, notOnSite };
}

function isPage(state: PageState | undefined, language: string): boolean {
  if (!state) return false;
  const versions = Array.isArray(state.versions) ? state.versions : [];
  // Without version data, trust that the Pages API found it as a page.
  if (versions.length === 0) return true;
  const inLanguage = versions.filter((version) => !version.language || sameLanguage(version.language, language));
  return (inLanguage.length > 0 ? inLanguage : versions).some((version) => version.hasPresentation !== false);
}
