/**
 * Serves /ai/summary.json (via rewrite) – authoritative summary for AI crawlers.
 *
 * Fetches the summary from Experience Edge via GraphQL. Provides a short (<800 characters)
 * summary so AI systems can understand what the site is about. Application/json,
 * Cache-Control 24h. Publicly accessible.
 */

import { aiJsonResponse } from '@/lib/ai-json-response';
import { fetchSummaryFromEdge } from '@/lib/summary-from-edge';

const MAX_DESCRIPTION_LENGTH = 800;

export interface SummaryJsonPayload {
  title: string;
  description: string;
  lastModified: string;
}

/**
 * Ensures description does not exceed max length (requirement: MUST NOT exceed 800 characters).
 */
function ensureDescriptionLength(description: string, maxLength: number): string {
  const trimmed = description.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength - 3) + '...';
}

export async function GET() {
  const summary = await fetchSummaryFromEdge();

  const payload: SummaryJsonPayload = {
    title: summary?.title || '',
    description: ensureDescriptionLength(summary?.description || '', MAX_DESCRIPTION_LENGTH),
    lastModified: new Date().toISOString(),
  };

  return aiJsonResponse(payload);
}
