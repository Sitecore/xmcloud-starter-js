import {
  DEFAULT_BLOGS_ROOT,
  getPlaceholderImage,
  isAllowedBlogsRoot,
  isArticlePage,
  mergeArticles,
  resolveBlogsRoot,
  toPublicHref,
} from '@/components/uiim/article/blog-listing.util';

describe('blog-listing.util', () => {
  it('allows bcaa content paths and GUIDs', () => {
    expect(isAllowedBlogsRoot(DEFAULT_BLOGS_ROOT)).toBe(true);
    expect(isAllowedBlogsRoot('77866688-bf56-4708-b308-14d3996b9585')).toBe(true);
    expect(isAllowedBlogsRoot('/sitecore/content/bcaa/bcaa/Home/BCAA Blog')).toBe(true);
    expect(isAllowedBlogsRoot('/sitecore/content/other/site')).toBe(false);
    expect(isAllowedBlogsRoot('https://example.com')).toBe(false);
  });

  it('resolves the authored blogs root or the default BCAA Blog item', () => {
    expect(
      resolveBlogsRoot({
        fields: {
          data: {
            datasource: {
              blogsRoot: { jsonValue: { value: '{77866688-BF56-4708-B308-14D3996B9585}' } },
            },
          },
        },
      } as never)
    ).toBe('{77866688-BF56-4708-B308-14D3996B9585}');
    expect(resolveBlogsRoot()).toBe(DEFAULT_BLOGS_ROOT);
  });

  it('keeps Article Pages and drops Data folders', () => {
    expect(
      isArticlePage({
        name: 'Road trip',
        template: { id: '{098AF197-50F1-48DB-B9C1-1698EFEE7E58}', name: 'Article Page' },
      })
    ).toBe(true);
    expect(
      isArticlePage({
        name: 'Data',
        template: { id: '{1C82E550-EBCD-4E5D-8ABD-D50D0809541E}', name: 'Page Data' },
      })
    ).toBe(false);
    expect(isArticlePage({ name: 'Data', url: { path: '/BCAA-Blog/Data' } })).toBe(false);
    expect(isArticlePage({ name: 'Beat the heat summer checklist', url: { path: '/BCAA-Blog/heat' } })).toBe(
      true
    );
  });

  it('normalizes article links to the public BCAA Blog route', () => {
    expect(toPublicHref('/BCAA-Blog/Beat-the-heat-summer-checklist')).toBe(
      '/BCAA-Blog/Beat-the-heat-summer-checklist'
    );
    expect(toPublicHref('/bcaa/en/BCAA-Blog/Beat-the-heat-summer-checklist')).toBe(
      '/BCAA-Blog/Beat-the-heat-summer-checklist'
    );
    expect(toPublicHref('/www.bcaa.com/BCAA-Blog/Beat-the-heat-summer-checklist')).toBe(
      '/BCAA-Blog/Beat-the-heat-summer-checklist'
    );
    expect(toPublicHref('/en/BCAA Blog/Beat the heat summer checklist')).toBe(
      '/BCAA-Blog/Beat-the-heat-summer-checklist'
    );
    expect(
      toPublicHref(
        '/sitecore/content/bcaa/bcaa/Home/BCAA Blog/Beat the heat summer checklist',
        'Beat the heat summer checklist'
      )
    ).toBe('/BCAA-Blog/Beat-the-heat-summer-checklist');
    expect(toPublicHref(undefined, 'Beat the heat summer checklist')).toBe(
      '/BCAA-Blog/Beat-the-heat-summer-checklist'
    );
  });

  it('uses non-Sitecore placeholder images for listing cards', () => {
    expect(getPlaceholderImage({ name: 'Beat the heat summer checklist' }).src).toContain(
      'images.unsplash.com'
    );
    expect(getPlaceholderImage({ name: 'How to maximize your BC summer road trip' }).src).toContain(
      'images.unsplash.com'
    );
  });

  it('merges fetched summary onto layout-only articles', () => {
    const merged = mergeArticles(
      [{ id: '{AAA}', name: 'Road trip', url: { path: '/road' } }],
      [
        {
          id: '{AAA}',
          pageSummary: { jsonValue: { value: 'A short description' } },
        },
      ]
    );

    expect(merged[0].url?.path).toBe('/road');
    expect(merged[0].pageSummary?.jsonValue?.value).toBe('A short description');
  });
});
