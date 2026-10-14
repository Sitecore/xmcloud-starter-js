import { aiJsonResponse } from '@/lib/ai-json-response';
import { fetchFaqFromEdge } from '@/lib/faq-from-edge';

const MIN_ITEMS = 3;
const MAX_ITEMS = 10;

export async function GET() {
  const { items, lastModified } = await fetchFaqFromEdge();
  const faq = items.slice(0, MAX_ITEMS);
  const payload = faq.length >= MIN_ITEMS ? faq : [];
  return aiJsonResponse({ items: payload, lastModified });
}
