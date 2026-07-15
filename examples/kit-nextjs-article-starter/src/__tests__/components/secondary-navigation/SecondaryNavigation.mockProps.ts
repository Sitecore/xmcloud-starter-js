import { Page, PageMode, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import {
  SecondaryNavigationProps,
  SecondaryNavigationPage,
} from '@/components/secondary-navigation/secondary-navigation.props';

// Mock navigation pages
export const mockChildPage1: SecondaryNavigationPage = {
  id: 'child-1',
  name: 'getting-started',
  displayName: 'Getting Started',
  title: {
    jsonValue: {
      value: 'Getting Started Guide',
    },
  },
  navigationTitle: {
    jsonValue: {
      value: 'Get Started',
    },
  },
  url: {
    href: '/docs/getting-started',
    text: 'Get Started',
    title: 'Getting Started',
    target: '',
    linktype: 'internal',
  },
};

export const mockChildPage2: SecondaryNavigationPage = {
  id: 'child-2',
  name: 'tutorials',
  displayName: 'Tutorials',
  title: {
    jsonValue: {
      value: 'Video Tutorials',
    },
  },
  navigationTitle: {
    jsonValue: {
      value: 'Tutorials',
    },
  },
  url: {
    href: '/docs/tutorials',
    text: 'Tutorials',
    title: 'Tutorials',
    target: '',
    linktype: 'internal',
  },
};

export const mockChildPage3: SecondaryNavigationPage = {
  id: 'child-3',
  name: 'api-reference',
  displayName: 'API Reference',
  url: {
    href: '/docs/api-reference',
    text: 'API Reference',
    title: 'API Reference',
    target: '',
    linktype: 'internal',
  },
};

export const mockSiblingPage1: SecondaryNavigationPage = {
  id: 'sibling-1',
  name: 'introduction',
  displayName: 'Introduction',
  navigationTitle: {
    jsonValue: {
      value: 'Intro',
    },
  },
  url: {
    href: '/docs/introduction',
    text: 'Introduction',
    title: 'Introduction',
    target: '',
    linktype: 'internal',
  },
};

export const mockCurrentPage: SecondaryNavigationPage = {
  id: 'current-page',
  name: 'documentation',
  displayName: 'Documentation',
  title: {
    jsonValue: {
      value: 'Documentation',
    },
  },
  navigationTitle: {
    jsonValue: {
      value: 'Docs',
    },
  },
  url: {
    href: '/docs',
    text: 'Documentation',
    title: 'Documentation',
    target: '',
    linktype: 'internal',
  },
};

export const mockSiblingPage2: SecondaryNavigationPage = {
  id: 'sibling-2',
  name: 'community',
  displayName: 'Community',
  url: {
    href: '/docs/community',
    text: 'Community',
    title: 'Community',
    target: '',
    linktype: 'internal',
  },
};

// Page without navigationTitle (should fallback to title)
export const mockPageWithoutNavTitle: SecondaryNavigationPage = {
  id: 'no-nav-title',
  name: 'faq',
  displayName: 'FAQ',
  title: {
    jsonValue: {
      value: 'Frequently Asked Questions',
    },
  },
  url: {
    href: '/docs/faq',
    text: 'FAQ',
    title: 'FAQ',
    target: '',
    linktype: 'internal',
  },
};

// Page without title or navigationTitle (should fallback to displayName)
export const mockPageWithDisplayNameOnly: SecondaryNavigationPage = {
  id: 'display-name-only',
  name: 'support',
  displayName: 'Support',
  url: {
    href: '/docs/support',
    text: 'Support',
    title: 'Support',
    target: '',
    linktype: 'internal',
  },
};

// Page without displayName (should fallback to name)
export const mockPageWithNameOnly: SecondaryNavigationPage = {
  id: 'name-only',
  name: 'changelog',
  url: {
    href: '/docs/changelog',
    text: 'Changelog',
    title: 'Changelog',
    target: '',
    linktype: 'internal',
  },
};

// Complete fields data
export const mockFields = {
  data: {
    datasource: {
      id: 'current-page',
      children: {
        results: [mockChildPage1, mockChildPage2, mockChildPage3],
      },
      parent: {
        children: {
          results: [mockSiblingPage1, mockCurrentPage, mockSiblingPage2],
        },
      },
    },
  },
};

export const mockFieldsWithoutChildren = {
  data: {
    datasource: {
      id: 'current-page',
      children: {
        results: [],
      },
      parent: {
        children: {
          results: [mockSiblingPage1, mockCurrentPage, mockSiblingPage2],
        },
      },
    },
  },
};

export const mockFieldsWithoutParent = {
  data: {
    datasource: {
      id: 'current-page',
      children: {
        results: [mockChildPage1, mockChildPage2],
      },
      parent: {
        children: {
          results: [],
        },
      },
    },
  },
};

export const mockFieldsWithFallbackTitles = {
  data: {
    datasource: {
      id: 'current-page',
      children: {
        results: [mockPageWithoutNavTitle, mockPageWithDisplayNameOnly, mockPageWithNameOnly],
      },
      parent: {
        children: {
          results: [mockCurrentPage],
        },
      },
    },
  },
};

export const mockFieldsWithoutDatasource = {
  data: {},
};

// Mock page object
const mockPage: Page = {
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
      context: {},
      route: null,
    },
  },
  locale: 'en',
};

// Mock rendering
const mockRendering: ComponentRendering = {
  componentName: 'SecondaryNavigation',
};

// Mock params
export const mockParams = {
  RenderingIdentifier: 'secondary-navigation-rendering-id',
};

// Complete props combinations
export const defaultProps: SecondaryNavigationProps = {
  params: mockParams,
  fields: mockFields as SecondaryNavigationProps['fields'],
  rendering: mockRendering,
  page: mockPage,
};

export const propsWithoutChildren: SecondaryNavigationProps = {
  params: mockParams,
  fields: mockFieldsWithoutChildren as SecondaryNavigationProps['fields'],
  rendering: mockRendering,
  page: mockPage,
};

export const propsWithoutParent: SecondaryNavigationProps = {
  params: mockParams,
  fields: mockFieldsWithoutParent as SecondaryNavigationProps['fields'],
  rendering: mockRendering,
  page: mockPage,
};

export const propsWithFallbackTitles: SecondaryNavigationProps = {
  params: mockParams,
  fields: mockFieldsWithFallbackTitles as SecondaryNavigationProps['fields'],
  rendering: mockRendering,
  page: mockPage,
};

export const propsWithoutDatasource: SecondaryNavigationProps = {
  params: mockParams,
  fields: mockFieldsWithoutDatasource as SecondaryNavigationProps['fields'],
  rendering: mockRendering,
  page: mockPage,
};

export const propsWithoutFields: SecondaryNavigationProps = {
  params: mockParams,
  fields: null as unknown as SecondaryNavigationProps['fields'],
  rendering: mockRendering,
  page: mockPage,
};


