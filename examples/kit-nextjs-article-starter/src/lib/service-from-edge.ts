import scConfig from 'sitecore.config';
import client from '@/lib/sitecore-client';

const SERVICE_GRAPHQL_TYPE = 'AIService';
const SERVICE_DATA_PATH_SUFFIX = '/Data/AI Config/Services';
const MAX_CHILDREN = 30;

export interface ServiceItem {
  name: string;
  description: string;
  category: string;
}

interface EdgeFieldValue {
  jsonValue?: { value?: string } | string;
}

interface ServiceChildResult {
  serviceName?: EdgeFieldValue;
  description?: EdgeFieldValue;
  category?: EdgeFieldValue;
}

interface ServiceQueryResult {
  item?: {
    updated?: { jsonValue?: string };
    children?: {
      results?: ServiceChildResult[];
    };
  };
}

export interface ServiceEdgeResult {
  services: ServiceItem[];
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

function buildServiceQuery(fragmentType: string): string {
  return `
    query ServiceQuery($path: String!, $language: String!) {
      item(path: $path, language: $language) {
        updated: field(name: "__Updated") { jsonValue }
        children(first: ${MAX_CHILDREN}) {
          results {
            ... on ${fragmentType} {
              serviceName: field(name: "name") { jsonValue }
              description { jsonValue }
              category { jsonValue }
            }
          }
        }
      }
    }
  `;
}

function buildServicePath(): string {
  const siteName = scConfig.defaultSite || process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME || '';
  if (!siteName) return '';
  return `/sitecore/content/solterra/${siteName}${SERVICE_DATA_PATH_SUFFIX}`;
}

export async function fetchServicesFromEdge(): Promise<ServiceEdgeResult> {
  const path = buildServicePath();
  if (!path) return { services: [], lastModified: new Date().toISOString() };

  const language = scConfig.defaultLanguage || 'en';

  try {
    const result = await client.getData<ServiceQueryResult>(
      buildServiceQuery(SERVICE_GRAPHQL_TYPE),
      { path, language }
    );

    const services = (result?.item?.children?.results ?? [])
      .map((child) => ({
        name: extractFieldValue(child?.serviceName),
        description: extractFieldValue(child?.description),
        category: extractFieldValue(child?.category),
      }))
      .filter((item) => item.name && item.description);

    const lastModified =
      extractFieldValue(
        result?.item?.updated ? { jsonValue: result.item.updated.jsonValue } : undefined
      ) || new Date().toISOString();

    return { services, lastModified };
  } catch (error) {
    console.error('[fetchServicesFromEdge] GraphQL request failed:', error);
    return { services: [], lastModified: new Date().toISOString() };
  }
}
