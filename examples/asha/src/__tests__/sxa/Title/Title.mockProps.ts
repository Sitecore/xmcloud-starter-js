/**
 * Test fixtures and mock data for Title component
 */

import type { LinkField, TextField, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { mockPage as sharedMockPage, mockPageEditing as sharedMockPageEditing } from '../../test-utils/mockPage';

interface TitleFields {
  data: {
    datasource: {
      url: {
        path: string;
        siteName: string;
      };
      field: {
        jsonValue: {
          value: string;
          metadata?: { [key: string]: unknown };
        };
      };
    };
    contextItem: {
      url: {
        path: string;
        siteName: string;
      };
      field: {
        jsonValue: {
          value: string;
          metadata?: { [key: string]: unknown };
        };
      };
    };
  };
}

type TitleProps = ComponentProps & {
  fields: TitleFields;
};

/**
 * Base mock data for Title component
 */
export const mockTitleData = {
  basicTitle: 'Sample Page Title',
  emptyTitle: '',
  longTitle: 'This is a very long page title that might be used for SEO purposes',
  specialCharsTitle: 'Title with & special <characters>',
};

/**
 * Mock datasource with title
 */
export const mockDatasourceWithTitle = {
  url: {
    path: '/sample-page',
    siteName: 'website',
  },
  field: {
    jsonValue: {
      value: mockTitleData.basicTitle,
    },
  },
};

/**
 * Mock datasource without title
 */
export const mockDatasourceWithoutTitle = {
  url: {
    path: '/another-page',
    siteName: 'website',
  },
  field: {
    jsonValue: {
      value: '',
    },
  },
};

/**
 * Mock page title field
 */
export const mockPageTitleField: TextField = {
  value: mockTitleData.basicTitle,
};

/**
 * Mock empty page title field
 */
export const mockEmptyPageTitleField: TextField = {
  value: '',
};

/**
 * Mock link field
 */
export const mockLinkField: LinkField = {
  value: {
    href: '/sample-page',
    title: mockTitleData.basicTitle,
  },
};

/**
 * Mock rendering object
 */
const mockRendering: ComponentRendering = {
  componentName: 'Title',
  dataSource: '',
  uid: 'title-uid',
  placeholders: {},
};

/**
 * Mock Sitecore context for normal mode
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const mockSitecoreContextNormal = {
  page: {
    ...sharedMockPage,
    layout: {
      sitecore: {
        ...sharedMockPage.layout.sitecore,
        route: {
          fields: {
            pageTitle: mockPageTitleField,
          },
        } as any,
      },
    },
  },
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Mock Sitecore context for editing mode
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const mockSitecoreContextEditing = {
  page: {
    ...sharedMockPageEditing,
    layout: {
      sitecore: {
        ...sharedMockPageEditing.layout.sitecore,
        route: {
          fields: {
            pageTitle: mockPageTitleField,
          },
        } as any,
      },
    },
  },
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Mock Sitecore context for editing mode with empty title
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const mockSitecoreContextEditingEmpty = {
  page: {
    ...sharedMockPageEditing,
    layout: {
      sitecore: {
        ...sharedMockPageEditing.layout.sitecore,
        route: {
          fields: {
            pageTitle: mockEmptyPageTitleField,
          },
        } as any,
      },
    },
  },
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Default props for Title component testing
 */
export const defaultTitleProps: TitleProps = {
  rendering: mockRendering,
  params: {
    RenderingIdentifier: 'title-1',
    styles: 'title-styles',
  },
  fields: {
    data: {
      datasource: mockDatasourceWithTitle,
      contextItem: mockDatasourceWithTitle,
    },
  },
  page: mockSitecoreContextNormal.page,
};

/**
 * Props with empty title
 */
export const titlePropsEmptyTitle: TitleProps = {
  rendering: mockRendering,
  params: {
    RenderingIdentifier: 'title-2',
    styles: 'title-styles',
  },
  fields: {
    data: {
      datasource: mockDatasourceWithoutTitle,
      contextItem: mockDatasourceWithoutTitle,
    },
  },
  page: mockSitecoreContextNormal.page,
};

/**
 * Props with minimal parameters
 */
export const titlePropsMinimal: TitleProps = {
  rendering: mockRendering,
  params: {},
  fields: {
    data: {
      datasource: mockDatasourceWithTitle,
      contextItem: mockDatasourceWithTitle,
    },
  },
  page: mockSitecoreContextNormal.page,
};

/**
 * Props with null fields (edge case)
 */
export const titlePropsNullFields: TitleProps = {
  rendering: mockRendering,
  params: {
    RenderingIdentifier: 'title-3',
    styles: 'title-styles',
  },
  fields: null as unknown as TitleFields,
  page: mockSitecoreContextNormal.page,
};

/**
 * Props with special characters in title
 */
export const titlePropsSpecialChars: TitleProps = {
  rendering: mockRendering,
  params: {
    RenderingIdentifier: 'title-4',
    styles: 'title-styles',
  },
  fields: {
    data: {
      datasource: {
        ...mockDatasourceWithTitle,
        field: {
          jsonValue: {
            value: mockTitleData.specialCharsTitle,
          },
        },
      },
      contextItem: {
        ...mockDatasourceWithTitle,
        field: {
          jsonValue: {
            value: mockTitleData.specialCharsTitle,
          },
        },
      },
    },
  },
  page: mockSitecoreContextNormal.page,
};
