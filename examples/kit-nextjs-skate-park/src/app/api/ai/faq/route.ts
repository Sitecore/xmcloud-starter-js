import faqData from '@/data/faq.json';
import { aiJsonResponse } from '@/lib/ai-json-response';

const MIN_ITEMS = 3;
const MAX_ITEMS = 10;

interface FaqItem {
  question: string;
  answer: string;
}

export async function GET() {
  const rawItems = Array.isArray(faqData.items) ? faqData.items : [];
  const items: FaqItem[] = rawItems
    .slice(0, MAX_ITEMS)
    .map((item: { question?: string; answer?: string }) => ({
      question: typeof item.question === 'string' ? item.question : '',
      answer: typeof item.answer === 'string' ? item.answer : '',
    }))
    .filter((item) => item.question && item.answer);

  const payload = items.length >= MIN_ITEMS ? items : [];
  return aiJsonResponse({items: payload, lastModified: faqData.lastModified});
}
