// Mock props for SecondaryNavigation component tests
import {
  SecondaryNavigationProps,
  SecondaryNavigationPage,
} from '../../components/secondary-navigation/secondary-navigation.props';
import { GqlFieldString } from '../../utils/graphQlClient';
import { LinkFieldValue } from '@sitecore-content-sdk/nextjs';
import { mockPage } from '../test-utils/mockPage';

// Helper function to create mock GraphQL field
const createMockGqlField = (value: string): GqlFieldString => ({
  jsonValue: { value },
});

// Helper function to create mock link field value
const createMockLinkValue = (href: string): LinkFieldValue => ({ href });

// Mock navigation pages
export const mockParentPage1: SecondaryNavigationPage = {
  id: 'parent-1',
  name: 'Products',
  title: createMockGqlField('Our Products'),
  navigationTitle: createMockGqlField('Products'),
  url: createMockLinkValue('/products'),
};

export const mockParentPage2: SecondaryNavigationPage = {
  id: 'parent-2',
  name: 'Services',
  title: createMockGqlField('Our Services'),
  navigationTitle: createMockGqlField('Services'),
  url: createMockLinkValue('/services'),
};

export const mockParentPage3: SecondaryNavigationPage = {
  id: 'parent-3',
  name: 'Support',
  title: createMockGqlField('Customer Support'),
  navigationTitle: createMockGqlField('Support'),
  url: createMockLinkValue('/support'),
};

// Mock child pages for Products
export const mockChildPage1: SecondaryNavigationPage = {
  id: 'child-1',
  name: 'Headphones',
  title: createMockGqlField('Premium Headphones'),
  navigationTitle: createMockGqlField('Headphones'),
  url: createMockLinkValue('/products/headphones'),
};

export const mockChildPage2: SecondaryNavigationPage = {
  id: 'child-2',
  name: 'Speakers',
  title: createMockGqlField('Professional Speakers'),
  navigationTitle: createMockGqlField('Speakers'),
  url: createMockLinkValue('/products/speakers'),
};

export const mockChildPage3: SecondaryNavigationPage = {
  id: 'child-3',
  name: 'Accessories',
  title: createMockGqlField('Audio Accessories'),
  navigationTitle: createMockGqlField('Accessories'),
  url: createMockLinkValue('/products/accessories'),
};

// Mock child page without navigation title (should use title)
export const mockChildPageNoNavTitle: SecondaryNavigationPage = {
  id: 'child-no-nav',
  name: 'Cables',
  title: createMockGqlField('Audio Cables'),
  url: createMockLinkValue('/products/cables'),
};

// Mock page without URL
export const mockPageNoUrl: SecondaryNavigationPage = {
  id: 'no-url',
  name: 'NoURL',
  title: createMockGqlField('Page Without URL'),
  navigationTitle: createMockGqlField('No URL'),
};

// Default props with full navigation hierarchy
export const defaultSecondaryNavigationProps: SecondaryNavigationProps = {
  params: {},
  page: mockPage,
  fields: {
    data: {
      datasource: {
        id: 'parent-1', // Current page is Products
        children: {
          results: [mockChildPage1, mockChildPage2, mockChildPage3],
        },
        parent: {
          children: {
            results: [mockParentPage1, mockParentPage2, mockParentPage3],
          },
        },
      },
    },
  },
  rendering: {
    uid: 'test-secondary-nav-uid',
    componentName: 'SecondaryNavigation',
    dataSource: '',
  },
};

// Props for different current page (Services)
export const secondaryNavigationPropsServices: SecondaryNavigationProps = {
  params: {},
  page: mockPage,
  fields: {
    data: {
      datasource: {
        id: 'parent-2', // Current page is Services
        children: {
          results: [], // Services has no children
        },
        parent: {
          children: {
            results: [mockParentPage1, mockParentPage2, mockParentPage3],
          },
        },
      },
    },
  },
  rendering: {
    uid: 'test-services-uid',
    componentName: 'SecondaryNavigation',
    dataSource: '',
  },
};

// Props with no children
export const secondaryNavigationPropsNoChildren: SecondaryNavigationProps = {
  params: {},
  page: mockPage,
  fields: {
    data: {
      datasource: {
        id: 'parent-3', // Current page is Support
        children: {
          results: [],
        },
        parent: {
          children: {
            results: [mockParentPage1, mockParentPage2, mockParentPage3],
          },
        },
      },
    },
  },
  rendering: {
    uid: 'test-no-children-uid',
    componentName: 'SecondaryNavigation',
    dataSource: '',
  },
};

// Props with single child
export const secondaryNavigationPropsSingleChild: SecondaryNavigationProps = {
  params: {},
  page: mockPage,
  fields: {
    data: {
      datasource: {
        id: 'parent-1',
        children: {
          results: [mockChildPage1],
        },
        parent: {
          children: {
            results: [mockParentPage1, mockParentPage2, mockParentPage3],
          },
        },
      },
    },
  },
  rendering: {
    uid: 'test-single-child-uid',
    componentName: 'SecondaryNavigation',
    dataSource: '',
  },
};

// Props with children missing navigation titles
export const secondaryNavigationPropsNoNavTitles: SecondaryNavigationProps = {
  params: {},
  page: mockPage,
  fields: {
    data: {
      datasource: {
        id: 'parent-1',
        children: {
          results: [mockChildPageNoNavTitle],
        },
        parent: {
          children: {
            results: [mockParentPage1, mockParentPage2, mockParentPage3],
          },
        },
      },
    },
  },
  rendering: {
    uid: 'test-no-nav-titles-uid',
    componentName: 'SecondaryNavigation',
    dataSource: '',
  },
};

// Props with pages missing URLs
export const secondaryNavigationPropsNoUrls: SecondaryNavigationProps = {
  params: {},
  page: mockPage,
  fields: {
    data: {
      datasource: {
        id: 'no-url',
        children: {
          results: [mockPageNoUrl],
        },
        parent: {
          children: {
            results: [mockPageNoUrl],
          },
        },
      },
    },
  },
  rendering: {
    uid: 'test-no-urls-uid',
    componentName: 'SecondaryNavigation',
    dataSource: '',
  },
};

// Props without parent structure
export const secondaryNavigationPropsNoParent: SecondaryNavigationProps = {
  params: {},
  page: mockPage,
  fields: {
    data: {
      datasource: {
        id: 'orphan-page',
        children: {
          results: [mockChildPage1],
        },
        parent: {
          children: undefined,
        },
      },
    },
  },
  rendering: {
    uid: 'test-no-parent-uid',
    componentName: 'SecondaryNavigation',
    dataSource: '',
  },
};

// Props with empty parent children
export const secondaryNavigationPropsEmptyParent: SecondaryNavigationProps = {
  params: {},
  page: mockPage,
  fields: {
    data: {
      datasource: {
        id: 'empty-parent',
        children: {
          results: [],
        },
        parent: {
          children: {
            results: [],
          },
        },
      },
    },
  },
  rendering: {
    uid: 'test-empty-parent-uid',
    componentName: 'SecondaryNavigation',
    dataSource: '',
  },
};

// Props without datasource
export const secondaryNavigationPropsNoDatasource: SecondaryNavigationProps = {
  params: {},
  page: mockPage,
  fields: {
    data: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      datasource: undefined as any,
    },
  },
  rendering: {
    uid: 'test-no-datasource-uid',
    componentName: 'SecondaryNavigation',
    dataSource: '',
  },
};

// Props without data
export const secondaryNavigationPropsNoData: SecondaryNavigationProps = {
  params: {},
  page: mockPage,
  fields: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: undefined as any,
  },
  rendering: {
    uid: 'test-no-data-uid',
    componentName: 'SecondaryNavigation',
    dataSource: '',
  },
};

// Props without fields
export const secondaryNavigationPropsNoFields: SecondaryNavigationProps = {
  params: {},
  page: mockPage,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: undefined as any,
  rendering: {
    uid: 'test-no-fields-uid',
    componentName: 'SecondaryNavigation',
    dataSource: '',
  },
};

// Props with mixed content (some pages have nav titles, some don't)
export const secondaryNavigationPropsMixed: SecondaryNavigationProps = {
  params: {},
  page: mockPage,
  fields: {
    data: {
      datasource: {
        id: 'parent-1',
        children: {
          results: [mockChildPage1, mockChildPageNoNavTitle, mockChildPage3],
        },
        parent: {
          children: {
            results: [mockParentPage1, mockParentPage2, mockParentPage3],
          },
        },
      },
    },
  },
  rendering: {
    uid: 'test-mixed-uid',
    componentName: 'SecondaryNavigation',
    dataSource: '',
  },
};

// Props for testing deep hierarchy
export const secondaryNavigationPropsDeepHierarchy: SecondaryNavigationProps = {
  params: {},
  page: mockPage,
  fields: {
    data: {
      datasource: {
        id: 'parent-1',
        children: {
          results: [
            mockChildPage1,
            mockChildPage2,
            mockChildPage3,
            {
              id: 'child-4',
              name: 'Microphones',
              title: createMockGqlField('Professional Microphones'),
              navigationTitle: createMockGqlField('Microphones'),
              url: createMockLinkValue('/products/microphones'),
            },
            {
              id: 'child-5',
              name: 'Interfaces',
              title: createMockGqlField('Audio Interfaces'),
              navigationTitle: createMockGqlField('Interfaces'),
              url: createMockLinkValue('/products/interfaces'),
            },
          ],
        },
        parent: {
          children: {
            results: [
              mockParentPage1,
              mockParentPage2,
              mockParentPage3,
              {
                id: 'parent-4',
                name: 'About',
                title: createMockGqlField('About Us'),
                navigationTitle: createMockGqlField('About'),
                url: createMockLinkValue('/about'),
              },
            ],
          },
        },
      },
    },
  },
  rendering: {
    uid: 'test-deep-hierarchy-uid',
    componentName: 'SecondaryNavigation',
    dataSource: '',
  },
};
