import { GlobalHeaderProps } from '@/components/global-header/global-header.props';
import { Page } from '@sitecore-content-sdk/nextjs';

// Mock page object with all required Page properties
const mockPageBase = {
  mode: {
    isEditing: false,
    isPreview: false,
    isNormal: true,
    name: 'normal' as const,
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
} as Page;

export const mockGlobalHeaderProps: GlobalHeaderProps = {
  isPageEditing: false,
  fields: {
    data: {
      item: {
        logo: {
          jsonValue: {
            value: {
              src: '/logo.svg',
              alt: 'Company Logo',
              width: '112',
              height: '40',
            },
          },
        },
        primaryNavigationLinks: {
          targetItems: [
            {
              link: {
                jsonValue: {
                  value: {
                    href: '/products',
                    text: 'Products',
                    linktype: 'internal',
                  },
                },
              },
              children: {
                results: [],
              },
            },
            {
              link: {
                jsonValue: {
                  value: {
                    href: '/services',
                    text: 'Services',
                    linktype: 'internal',
                  },
                },
              },
              children: {
                results: [],
              },
            },
            {
              link: {
                jsonValue: {
                  value: {
                    href: '/about',
                    text: 'About',
                    linktype: 'internal',
                  },
                },
              },
              children: {
                results: [],
              },
            },
          ],
        },
        headerContact: {
          jsonValue: {
            value: {
              href: '/contact',
              text: 'Contact Us',
              linktype: 'internal',
            },
          },
        },
        utilityNavigationLinks: {
          targetItems: [],
        },
      },
    },
  },
  params: {},
  rendering: {
    dataSource: '',
    componentName: 'GlobalHeader',
  },
  page: mockPageBase,
};
