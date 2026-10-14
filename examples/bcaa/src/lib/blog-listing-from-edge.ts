import client from '@/lib/sitecore-client';
import type { BlogListingArticle } from '@/components/uiim/article/blog-listing.props';
import { isAllowedBlogsRoot, isArticlePage, withPublicUrl } from '@/components/uiim/article/blog-listing.util';

const DEFAULT_BLOGS_ROOT = '{77866688-BF56-4708-B308-14D3996B9585}';
const MAX_CHILDREN = 50;

type EdgeField = { jsonValue?: { value?: unknown } };

type EdgeChild = {
  id?: string;
  name?: string;
  template?: { id?: string; name?: string };
  url?: { path?: string };
  pageTitle?: EdgeField;
  pageHeaderTitle?: EdgeField;
  pageShortTitle?: EdgeField;
  pageSummary?: EdgeField;
  pageDisplayDate?: EdgeField;
  pageReadTime?: EdgeField;
  pageThumbnail?: EdgeField;
};

type BlogListingQueryResult = {
  item?: {
    children?: {
      results?: EdgeChild[];
    };
  };
  search?: {
    results?: EdgeChild[];
  };
};

const ARTICLES_QUERY = `
  query BlogListingArticles($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      children(first: ${MAX_CHILDREN}) {
        results {
          id
          name
          url { path }
          pageTitle: field(name: "pageTitle") { jsonValue }
          pageHeaderTitle: field(name: "pageHeaderTitle") { jsonValue }
          pageShortTitle: field(name: "pageShortTitle") { jsonValue }
          pageSummary: field(name: "pageSummary") { jsonValue }
          pageDisplayDate: field(name: "pageDisplayDate") { jsonValue }
          pageReadTime: field(name: "pageReadTime") { jsonValue }
          pageThumbnail: field(name: "pageThumbnail") { jsonValue }
        }
      }
    }
  }
`;

const SEARCH_QUERY = `
  query BlogListingSearch($root: String!, $template: String!, $language: String!) {
    search(
      where: {
        AND: [
          { name: "_path", value: $root, operator: CONTAINS }
          { name: "_templates", value: $template, operator: EQ }
          { name: "_language", value: $language, operator: EQ }
        ]
      }
      first: ${MAX_CHILDREN}
    ) {
      results {
        id
        name
        url { path }
        pageTitle: field(name: "pageTitle") { jsonValue }
        pageHeaderTitle: field(name: "pageHeaderTitle") { jsonValue }
        pageShortTitle: field(name: "pageShortTitle") { jsonValue }
        pageSummary: field(name: "pageSummary") { jsonValue }
        pageDisplayDate: field(name: "pageDisplayDate") { jsonValue }
        pageReadTime: field(name: "pageReadTime") { jsonValue }
        pageThumbnail: field(name: "pageThumbnail") { jsonValue }
      }
    }
  }
`;

const ARTICLE_TEMPLATE = '098AF19750F148DBB9C11698EFEE7E58';
const DEFAULT_BLOGS_PATH = '/sitecore/content/bcaa/bcaa/Home/BCAA Blog';

const toArticle = (child: EdgeChild): BlogListingArticle =>
  withPublicUrl({
    id: child.id,
    name: child.name,
    template: child.template,
    url: child.url,
    pageTitle: child.pageTitle as BlogListingArticle['pageTitle'],
    pageHeaderTitle: child.pageHeaderTitle as BlogListingArticle['pageHeaderTitle'],
    pageShortTitle: child.pageShortTitle as BlogListingArticle['pageShortTitle'],
    pageSummary: child.pageSummary as BlogListingArticle['pageSummary'],
    pageDisplayDate: child.pageDisplayDate as BlogListingArticle['pageDisplayDate'],
    pageReadTime: child.pageReadTime as BlogListingArticle['pageReadTime'],
    pageThumbnail: child.pageThumbnail as BlogListingArticle['pageThumbnail'],
  });

const uniqueArticles = (articles: BlogListingArticle[]): BlogListingArticle[] => {
  const seen = new Set<string>();
  return articles.filter((article) => {
    const key = article.id || article.url?.path || article.name || '';
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const ITEM_QUERY = `
  query BlogArticle($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      id
      name
      url { path }
      pageTitle: field(name: "pageTitle") { jsonValue }
      pageHeaderTitle: field(name: "pageHeaderTitle") { jsonValue }
      pageShortTitle: field(name: "pageShortTitle") { jsonValue }
      pageSummary: field(name: "pageSummary") { jsonValue }
      pageDisplayDate: field(name: "pageDisplayDate") { jsonValue }
      pageReadTime: field(name: "pageReadTime") { jsonValue }
      pageThumbnail: field(name: "pageThumbnail") { jsonValue }
    }
  }
`;

const toGuidPath = (id: string): string => {
  const normalized = id.replace(/[{}]/g, '');
  return `{${normalized}}`;
};

export const fetchBlogArticlesByIds = async (
  ids: string[],
  language = 'en'
): Promise<BlogListingArticle[]> => {
  const uniqueIds = [...new Set(ids.map((id) => id.trim()).filter(isAllowedBlogsRoot))].slice(0, 20);
  const articles: BlogListingArticle[] = [];

  for (const id of uniqueIds) {
    try {
      const result = await client.getData<{ item?: EdgeChild }>(ITEM_QUERY, {
        path: toGuidPath(id),
        language,
      });
      if (result?.item) {
        const article = toArticle(result.item);
        if (isArticlePage(article)) articles.push(article);
      }
    } catch (error) {
      console.error('[fetchBlogArticlesByIds] item query failed:', id, error);
    }
  }

  return uniqueArticles(articles);
};

export const fetchBlogListingFromEdge = async (
  root = DEFAULT_BLOGS_ROOT,
  language = 'en'
): Promise<BlogListingArticle[]> => {
  const path = isAllowedBlogsRoot(root) ? root.trim() : DEFAULT_BLOGS_ROOT;
  const candidates = [path, DEFAULT_BLOGS_ROOT, DEFAULT_BLOGS_PATH].filter(
    (value, index, all) => all.indexOf(value) === index
  );

  for (const candidate of candidates) {
    try {
      const result = await client.getData<BlogListingQueryResult>(ARTICLES_QUERY, {
        path: candidate,
        language,
      });
      const children = (result?.item?.children?.results ?? []).map(toArticle).filter(isArticlePage);
      if (children.length > 0) return uniqueArticles(children);
    } catch (error) {
      console.error('[fetchBlogListingFromEdge] children query failed:', candidate, error);
    }
  }

  try {
    const search = await client.getData<BlogListingQueryResult>(SEARCH_QUERY, {
      root: DEFAULT_BLOGS_ROOT.replace(/[{}]/g, ''),
      template: ARTICLE_TEMPLATE,
      language,
    });
    return uniqueArticles((search?.search?.results ?? []).map(toArticle).filter(isArticlePage));
  } catch (error) {
    console.error('[fetchBlogListingFromEdge] search query failed:', error);
    return [];
  }
};
