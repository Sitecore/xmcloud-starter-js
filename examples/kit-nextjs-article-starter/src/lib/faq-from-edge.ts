import scConfig from 'sitecore.config';
import client from '@/lib/sitecore-client';

const FAQ_GRAPHQL_TYPE = 'AIFAQItem';
const FAQ_DATA_PATH_SUFFIX = '/Data/AI Config/FAQ';
const MAX_CHILDREN = 20;

export interface FaqItem {
  question: string;
  answer: string;
}

interface EdgeFieldValue {
  jsonValue?: { value?: string } | string;
}

interface FaqChildResult {
  question?: EdgeFieldValue;
  answer?: EdgeFieldValue;
}

interface FaqQueryResult {
  item?: {
    updated?: { jsonValue?: string };
    children?: {
      results?: FaqChildResult[];
    };
  };
}

export interface FaqEdgeResult {
  items: FaqItem[];
  lastModified: string;
}

function extractFieldValue(field?: EdgeFieldValue): string {
  if (!field || field.jsonValue == null) return '';
  const jv = field.jsonValue;
  if (typeof jv === 'string') return jv.trim();
  if (typeof jv === 'object' && 'value' in jv && typeof jv.value === 'string') {
    return jv.value.trim();
  }
  return '';
}

function buildFaqQuery(fragmentType: string): string {
  return `
    query FaqQuery($path: String!, $language: String!) {
      item(path: $path, language: $language) {
        updated: field(name: "__Updated") { jsonValue }
        children(first: ${MAX_CHILDREN}) {
          results {
            ... on ${fragmentType} {
              question { jsonValue }
              answer { jsonValue }
            }
          }
        }
      }
    }
  `;
}

function buildFaqPath(): string {
  const siteName = scConfig.defaultSite || process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME || '';
  if (!siteName) return '';
  return `/sitecore/content/solterra/${siteName}${FAQ_DATA_PATH_SUFFIX}`;
}

export async function fetchFaqFromEdge(): Promise<FaqEdgeResult> {
  const path = buildFaqPath();
  if (!path) return { items: [], lastModified: new Date().toISOString() };

  const language = scConfig.defaultLanguage || 'en';

  try {
    const result = await client.getData<FaqQueryResult>(
      buildFaqQuery(FAQ_GRAPHQL_TYPE),
      { path, language }
    );

    const items = (result?.item?.children?.results ?? [])
      .map((child) => ({
        question: extractFieldValue(child?.question),
        answer: extractFieldValue(child?.answer),
      }))
      .filter((item) => item.question && item.answer);

    const lastModified =
      extractFieldValue(
        result?.item?.updated ? { jsonValue: result.item.updated.jsonValue } : undefined
      ) || new Date().toISOString();

    return { items, lastModified };
  } catch (error) {
    console.error('[fetchFaqFromEdge] GraphQL request failed:', error);
    return { items: [], lastModified: new Date().toISOString() };
  }
}
