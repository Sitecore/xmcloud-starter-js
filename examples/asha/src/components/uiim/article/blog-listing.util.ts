import type { Page } from '@sitecore-content-sdk/nextjs';
import { getFieldValue } from '@/lib/component-props';
import type { BlogListingArticle, BlogListingProps } from './blog-listing.props';

export const DEFAULT_BLOGS_ROOT = '{77866688-BF56-4708-B308-14D3996B9585}';

export const DEFAULT_FILTER_FACETS = `Membership | membership, member, rewards, join, connect
Travel | travel, trip, road, vacation, staycation, tofino
Insurance | insurance, claim, coverage, policy
Home | home, wildfire, firesmart, property, earthquake
Automotive | ev, electric, car, auto, vehicle, winter
Safety | scam, phishing, earthquake, wildfire, safety`;

const ARTICLE_PAGE_TEMPLATE_ID = '098af19750f148dbb9c11698efee7e58';
const GUID = /^\{?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\}?$/;

const fieldText = (field?: { jsonValue?: { value?: string }; value?: string }): string => {
  const value = getFieldValue(field)?.value ?? field?.value;
  return typeof value === 'string' ? value : '';
};

export const normalizeId = (value?: string): string => (value || '').replace(/[{}-]/g, '').toLowerCase();

const BLOG_FOLDER = '/BCAA-Blog';
const CONTENT_HOME = '/sitecore/content/bcaa/bcaa/home';
const URL_PREFIXES = ['/bcaa', '/en-ca', '/en'];

export const toPublicHref = (path?: string, name?: string): string => {
  let href = (path || '').trim();

  if (/^https?:\/\//i.test(href)) {
    try {
      href = new URL(href).pathname;
    } catch {
      /* keep the original path */
    }
  }

  href = href.split('?')[0].split('#')[0];
  try {
    href = decodeURIComponent(href);
  } catch {
    /* keep the original path */
  }

  if (href.toLowerCase().startsWith(CONTENT_HOME)) {
    href = href.slice(CONTENT_HOME.length);
  }

  href = href.replace(/^\/?(?:https?:\/\/)?(?:www\.)?bcaa\.com(?=\/|$)/i, '');

  let changed = true;
  while (changed) {
    changed = false;
    const lower = href.toLowerCase();
    for (const prefix of URL_PREFIXES) {
      if (lower === prefix) {
        href = '/';
        changed = true;
        break;
      }
      if (lower.startsWith(`${prefix}/`)) {
        href = href.slice(prefix.length);
        changed = true;
        break;
      }
    }
  }

  href = href.replace(/\/+/g, '/').replace(/ /g, '-');
  if (href && href !== '/') {
    return href.startsWith('/') ? href : `/${href}`;
  }

  const slug = (name || '').trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  return slug ? `${BLOG_FOLDER}/${slug}` : '#';
};

export const isAllowedBlogsRoot = (value?: string): boolean => {
  const trimmed = value?.trim() || '';
  if (GUID.test(trimmed)) return true;
  return trimmed.startsWith('/sitecore/content/bcaa/');
};

export const isArticlePage = (article: BlogListingArticle): boolean => {
  if (article.name === 'Data' || /\/Data$/i.test(article.url?.path || '')) return false;
  const templateId = normalizeId(article.template?.id);
  if (templateId && templateId === ARTICLE_PAGE_TEMPLATE_ID) return true;
  if (article.template?.name === 'Article Page') return true;
  if (article.template?.name === 'Page Data' || article.template?.name === 'BlogListing') return false;
  return Boolean(
    article.name ||
      article.url?.path ||
      fieldText(article.pageTitle) ||
      fieldText(article.pageHeaderTitle) ||
      fieldText(article.pageSummary)
  );
};

const droptreeValue = (value?: unknown): string => {
  if (!value) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object') {
    const record = value as { id?: string; value?: string };
    return (record.id || record.value || '').trim();
  }
  return '';
};

export const resolveBlogsRoot = (props?: BlogListingProps, page?: Page): string => {
  const fromField = droptreeValue(
    getFieldValue(props?.fields?.data?.datasource?.blogsRoot)?.value ??
      props?.fields?.data?.datasource?.blogsRoot?.jsonValue?.value
  );
  if (isAllowedBlogsRoot(fromField)) return fromField;

  const routeId = (page?.layout?.sitecore?.route as { itemId?: string } | null | undefined)?.itemId;
  if (isAllowedBlogsRoot(routeId)) return `{${normalizeId(routeId).replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')}}`;

  return DEFAULT_BLOGS_ROOT;
};

export const withPublicUrl = (article: BlogListingArticle): BlogListingArticle => ({
  ...article,
  url: { path: toPublicHref(article.url?.path, article.name) },
});

export const getLayoutArticles = (fields?: BlogListingProps['fields']): BlogListingArticle[] => {
  const fromRoot = fields?.data?.datasource?.blogsRoot?.targetItem?.children?.results;
  const fromContext = fields?.data?.contextItem?.children?.results;
  return ((fromRoot?.length ? fromRoot : fromContext) ?? []).filter(isArticlePage).map(withPublicUrl);
};

const PLACEHOLDER_IMAGES: { match: RegExp; src: string }[] = [
  { match: /heat|summer|cool/i, src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=750&q=80' },
  { match: /earthquake/i, src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&h=750&q=80' },
  { match: /ev|electric|winter/i, src: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&h=750&q=80' },
  { match: /road|trip/i, src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&h=750&q=80' },
  { match: /scam|phish|online/i, src: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&h=750&q=80' },
  { match: /wildfire|fire/i, src: 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?auto=format&fit=crop&w=1200&h=750&q=80' },
  { match: /connect|new to/i, src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&h=750&q=80' },
  { match: /home|buy|sell/i, src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&h=750&q=80' },
  { match: /travel|insurance/i, src: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&h=750&q=80' },
  { match: /staycation|vacation/i, src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&h=750&q=80' },
];

const DEFAULT_PLACEHOLDER =
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&h=750&q=80';

export const getPlaceholderImage = (
  article?: BlogListingArticle
): { src: string; alt: string } => {
  const label = [article?.name, fieldText(article?.pageHeaderTitle), fieldText(article?.pageTitle)]
    .filter(Boolean)
    .join(' ');
  const match = PLACEHOLDER_IMAGES.find((item) => item.match.test(label));
  return {
    src: match?.src || DEFAULT_PLACEHOLDER,
    alt: fieldText(article?.pageHeaderTitle) || article?.name || 'Blog article',
  };
};

export const articleNeedsDetails = (article: BlogListingArticle): boolean => {
  const hasSummary = Boolean(fieldText(article.pageSummary));
  const hasTitle = Boolean(fieldText(article.pageHeaderTitle) || fieldText(article.pageTitle));
  return !hasSummary || !hasTitle;
};

export const mergeArticles = (
  layoutArticles: BlogListingArticle[],
  fetchedArticles: BlogListingArticle[]
): BlogListingArticle[] => {
  if (layoutArticles.length === 0) return fetchedArticles;
  if (fetchedArticles.length === 0) return layoutArticles;

  const byId = new Map(fetchedArticles.map((article) => [normalizeId(article.id), article]));
  const byPath = new Map(
    fetchedArticles.map((article) => [(article.url?.path || '').toLowerCase(), article])
  );

  const merged = layoutArticles.map((article) => {
    const match = byId.get(normalizeId(article.id)) || byPath.get((article.url?.path || '').toLowerCase());
    if (!match) return article;
    return {
      ...article,
      ...match,
      name: article.name || match.name,
      url: { path: toPublicHref(article.url?.path || match.url?.path, article.name || match.name) },
    };
  });

  const seen = new Set(merged.map((article) => normalizeId(article.id) || article.url?.path || article.name));
  for (const article of fetchedArticles) {
    const key = normalizeId(article.id) || article.url?.path || article.name;
    if (key && !seen.has(key)) {
      merged.push(article);
      seen.add(key);
    }
  }

  return merged;
};
