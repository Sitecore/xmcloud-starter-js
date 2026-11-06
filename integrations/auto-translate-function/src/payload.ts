import { sameLanguage } from './languages';
import type { TranslationRequest } from './messages';

/**
 * The parts of a SitecoreAI "Webhook Submit Action" payload this app reads.
 * https://doc.sitecore.com/sai/en/developers/sitecoreai/content-modeling-and-presentation/workflow/webhooks/walkthrough--adding-and-configuring-a-webhook-submit-action/webhook-submit-action-http-request.html
 */
export interface WorkflowWebhookPayload {
  ActionName?: string;
  DataItem?: {
    Id?: string;
    Name?: string;
    Language?: string;
    Version?: number;
    TemplateName?: string;
  };
  NextState?: { DisplayName?: string } | null;
  PreviousState?: { DisplayName?: string } | null;
  UserName?: string;
  WorkflowName?: string;
}

export type ParseResult =
  | { kind: 'translate'; request: TranslationRequest }
  | { kind: 'skip'; reason: string }
  | { kind: 'invalid'; reason: string };

const GUID = /^\{?([0-9a-f]{8})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{12})\}?$/i;

/** Normalises "{ABC...}" / "abc..." / "abc-..." to lowercase "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx". */
export function normalizeGuid(value: string): string | undefined {
  const match = GUID.exec(value.trim());
  return match ? match.slice(1).join('-').toLowerCase() : undefined;
}

/**
 * Decides whether a workflow webhook call should start a translation.
 *
 * Only source-language versions are translated. That's also what stops a loop: approving a
 * translated (for example de-DE) version fires the same webhook, and it is skipped here.
 */
export function parseWorkflowPayload(
  body: unknown,
  sourceLanguage: string,
  now: Date = new Date()
): ParseResult {
  if (!body || typeof body !== 'object') {
    return { kind: 'invalid', reason: 'The body is not a JSON object.' };
  }

  const payload = body as WorkflowWebhookPayload;
  const item = payload.DataItem;
  if (!item || typeof item !== 'object') {
    return { kind: 'invalid', reason: 'DataItem is missing. Is this a Webhook Submit Action payload?' };
  }

  const itemId = typeof item.Id === 'string' ? normalizeGuid(item.Id) : undefined;
  if (!itemId) return { kind: 'invalid', reason: 'DataItem.Id is missing or not a GUID.' };

  if (typeof item.Language !== 'string' || !item.Language.trim()) {
    return { kind: 'invalid', reason: 'DataItem.Language is missing.' };
  }

  if (!sameLanguage(item.Language, sourceLanguage)) {
    return {
      kind: 'skip',
      reason: `Item language "${item.Language}" is not the source language "${sourceLanguage}".`,
    };
  }

  return {
    kind: 'translate',
    request: {
      itemId,
      itemName: item.Name,
      sourceLanguage: item.Language,
      sourceVersion: typeof item.Version === 'number' ? item.Version : undefined,
      workflowName: payload.WorkflowName,
      approvedBy: payload.UserName,
      receivedAt: now.toISOString(),
    },
  };
}
