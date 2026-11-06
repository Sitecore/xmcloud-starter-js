import type { TranslationStrategy } from './config';

/** Queue names. Storage queue names must be lowercase letters, digits and hyphens. */
export const QUEUES = {
  /** One message per approved source-language item, written by the webhook. */
  requests: 'translate-requests',
  /** One message per page, written by the planner (and re-queued with the languages left). */
  pages: 'translate-pages',
} as const;

/** What the webhook queues after a source-language item is approved. */
export interface TranslationRequest {
  itemId: string;
  itemName?: string;
  sourceLanguage: string;
  sourceVersion?: number;
  workflowName?: string;
  approvedBy?: string;
  receivedAt: string;
}

/**
 * Translate one page into several languages, one language at a time.
 *
 * The languages run one after another because each translation job also writes the page's
 * datasource items: parallel jobs for the same page wrote the same datasource at once and
 * one language lost its datasource translation (seen on 2026-11-06).
 */
export interface PageTranslationTask {
  pageId: string;
  pageName?: string;
  siteId: string;
  siteName: string;
  sourceLanguage: string;
  /** Languages still to translate, in order. */
  targetLanguages: string[];
  /** Languages already translated by earlier attempts of this task. */
  completedLanguages: string[];
  strategy: TranslationStrategy;
  /** See WorkerConfig.translationWorkflowState. */
  translationWorkflowState?: string;
  /** 1 for the first run; increased each time the task is re-queued after a failure. */
  attempt: number;
  approvedBy?: string;
  receivedAt: string;
}
