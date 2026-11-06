import { timingSafeEqual } from 'node:crypto';

/**
 * Publish-triggered revalidation (ADR 0015). An Experience Edge webhook calls
 * POST /api/revalidate after every publish; the route clears every cached page.
 */

export const REVALIDATE_SECRET_HEADER = 'x-revalidate-secret';
export const REVALIDATE_SECRET_ENV = 'SITECORE_REVALIDATE_SECRET';

export type RevalidateAuth = 'ok' | 'unauthorized' | 'not-configured';

/**
 * Compares the request's secret header with the configured secret in constant time.
 * Without a configured secret the endpoint stays closed ("not-configured"), never open.
 */
export const checkRevalidateSecret = (
  provided: string | null | undefined,
  configured: string | undefined
): RevalidateAuth => {
  const expected = configured?.trim();
  if (!expected) return 'not-configured';
  const actual = provided?.trim() ?? '';
  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b) ? 'ok' : 'unauthorized';
};

export type WebhookSummary = {
  invocationId: string | null;
  updates: number;
  continues: boolean;
};

/**
 * What a webhook body says, for logs and the response. Accepts both execution modes:
 * `OnEnd` posts the webhook's own static body; `OnUpdate` posts { invocation_id, updates, continues }.
 */
export const summarizeWebhookBody = (body: unknown): WebhookSummary => {
  const b = body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
  return {
    invocationId: typeof b.invocation_id === 'string' ? b.invocation_id : null,
    updates: Array.isArray(b.updates) ? b.updates.length : 0,
    continues: b.continues === true,
  };
};

/** Parses a request body that may be empty or not JSON (a webhook must never fail on its body). */
export const parseWebhookBody = (text: string): unknown => {
  if (!text.trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};
