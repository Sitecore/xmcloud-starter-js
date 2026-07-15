// Shared mock page object for all component tests
// This eliminates code duplication across test files

import type { Page } from '@sitecore-content-sdk/nextjs';

export const mockPage = {
  layout: {
    sitecore: {
      context: {
        pageEditing: false,
        language: 'en',
      },
      route: {
        fields: {},
      },
    },
  },
  mode: {
    isEditing: false,
    isPreview: false,
  },
  locale: 'en',
} as unknown as Page;
