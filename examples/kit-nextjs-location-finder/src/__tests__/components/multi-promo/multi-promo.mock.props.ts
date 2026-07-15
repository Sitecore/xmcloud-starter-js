import type {
  MultiPromoProps,
  MultiPromoItemProps,
} from '@/components/multi-promo/multi-promo.props';
import { Page } from '@sitecore-content-sdk/nextjs';

export const mockMultiPromoItems: MultiPromoItemProps[] = [
  {
    heading: {
      jsonValue: {
        value: 'Premium Product',
      },
    },
    image: {
      jsonValue: {
        value: {
          src: '/images/promo-1.jpg',
          alt: 'Premium Product',
          width: '416',
          height: '384',
        },
      },
    },
    link: {
      jsonValue: {
        value: {
          href: '/products/premium',
          text: 'Learn More',
          linktype: 'internal',
        },
      },
    },
  },
  {
    heading: {
      jsonValue: {
        value: 'Featured Service',
      },
    },
    image: {
      jsonValue: {
        value: {
          src: '/images/promo-2.jpg',
          alt: 'Featured Service',
          width: '416',
          height: '384',
        },
      },
    },
    link: {
      jsonValue: {
        value: {
          href: '/services/featured',
          text: 'Discover',
          linktype: 'internal',
        },
      },
    },
  },
  {
    heading: {
      jsonValue: {
        value: 'Best Offer',
      },
    },
    image: {
      jsonValue: {
        value: {
          src: '/images/promo-3.jpg',
          alt: 'Best Offer',
          width: '416',
          height: '384',
        },
      },
    },
    link: {
      jsonValue: {
        value: {
          href: '/offers/best',
          text: 'View Details',
          linktype: 'internal',
        },
      },
    },
  },
  {
    heading: {
      jsonValue: {
        value: 'Special Deal',
      },
    },
    image: {
      jsonValue: {
        value: {
          src: '/images/promo-4.jpg',
          alt: 'Special Deal',
          width: '416',
          height: '384',
        },
      },
    },
    link: {
      jsonValue: {
        value: {
          href: '/deals/special',
          text: 'Shop Now',
          linktype: 'internal',
        },
      },
    },
  },
];

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

export const mockMultiPromoProps: MultiPromoProps = {
  rendering: {
    componentName: 'MultiPromo',
    dataSource: 'mock-datasource',
  },
  params: {
    numColumns: '3',
    styles: 'custom-style',
  },
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: {
            value: 'Explore Our Collection',
          },
        },
        description: {
          jsonValue: {
            value: '<p>Discover our curated selection of premium products and services.</p>',
          },
        },
        children: {
          results: mockMultiPromoItems,
        },
      },
    },
  },
  name: 'MultiPromo',
  promos: [],
  page: mockPageBase,
};
