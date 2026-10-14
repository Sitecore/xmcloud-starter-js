import type { Page, PageMode } from '@sitecore-content-sdk/nextjs';

export const FALLBACK_404_TITLE = 'Page not found';
export const FALLBACK_404_MESSAGE = 'This page does not exist.';
export const FALLBACK_500_TITLE = '500 Internal Server Error';
export const FALLBACK_500_MESSAGE =
  'There is a problem with the resource you are looking for, and it cannot be displayed.';
export const FALLBACK_HOME_LINK = 'Go to the Home page';

export const MOCK_SITE = 'test-site';
export const MOCK_LOCALE = 'en';

export function createMockErrorPage(routeName: string, displayTitle?: string): Page {
  return {
    mode: {
      isEditing: false,
      isPreview: false,
      isNormal: true,
      name: 'normal' as PageMode['name'],
      designLibrary: { isVariantGeneration: false },
      isDesignLibrary: false,
    },
    layout: {
      sitecore: {
        context: {
          language: MOCK_LOCALE,
          site: { name: MOCK_SITE },
        },
        route: {
          name: routeName,
          displayName: displayTitle ?? routeName,
          fields: {
            Title: { value: displayTitle ?? routeName },
          },
          placeholders: {},
        },
      },
    },
    locale: MOCK_LOCALE,
  } as Page;
}

export const MOCK_NOT_FOUND_PAGE = createMockErrorPage(
  '404-error-page',
  'Sitecore 404 Error Page'
);

export const MOCK_SERVER_ERROR_PAGE = createMockErrorPage(
  '500-error-page',
  'Sitecore 500 Error Page'
);

/** Matches `@sitecore-content-sdk/nextjs` ErrorPage enum values */
export const ErrorPageType = {
  NotFound: '404',
  InternalServerError: '500',
} as const;
