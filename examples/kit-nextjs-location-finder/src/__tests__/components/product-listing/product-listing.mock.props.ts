import type {
  ProductListingProps,
  ProductItemProps,
} from '@/components/product-listing/product-listing.props';
import { Page } from '@sitecore-content-sdk/nextjs';

export const mockProductItems: ProductItemProps[] = [
  {
    productName: {
      jsonValue: {
        value: 'Alaris Type I Ambulance',
      },
    },
    productThumbnail: {
      jsonValue: {
        value: {
          src: '/images/alaris-type-1-ambulance.jpg',
          alt: 'Alaris Type I Ambulance',
          width: '600',
          height: '400',
        },
      },
    },
    productBasePrice: {
      jsonValue: {
        value: '$185,000',
      },
    },
    productFeatureTitle: {
      jsonValue: {
        value: 'Advanced Life Support',
      },
    },
    productFeatureText: {
      jsonValue: {
        value: 'Equipped with state-of-the-art medical equipment for critical care transport',
      },
    },
    productDrivingRange: {
      jsonValue: {
        value: '450 miles',
      },
    },
    url: {
      path: '/vehicles/ambulances/type-1',
      url: '/vehicles/ambulances/type-1',
    },
  },
  {
    productName: {
      jsonValue: {
        value: 'Alaris Type III Ambulance',
      },
    },
    productThumbnail: {
      jsonValue: {
        value: {
          src: '/images/alaris-type-3-ambulance.jpg',
          alt: 'Alaris Type III Ambulance',
          width: '600',
          height: '400',
        },
      },
    },
    productBasePrice: {
      jsonValue: {
        value: '$225,000',
      },
    },
    productFeatureTitle: {
      jsonValue: {
        value: 'Extended Storage Capacity',
      },
    },
    productFeatureText: {
      jsonValue: {
        value: 'Maximum interior space with modular storage for extended emergency operations',
      },
    },
    productDrivingRange: {
      jsonValue: {
        value: '520 miles',
      },
    },
    url: {
      path: '/vehicles/ambulances/type-3',
      url: '/vehicles/ambulances/type-3',
    },
  },
  {
    productName: {
      jsonValue: {
        value: 'Alaris Fire Truck Pro',
      },
    },
    productThumbnail: {
      jsonValue: {
        value: {
          src: '/images/alaris-fire-truck.jpg',
          alt: 'Alaris Fire Truck Pro',
          width: '600',
          height: '400',
        },
      },
    },
    productBasePrice: {
      jsonValue: {
        value: '$650,000',
      },
    },
    productFeatureTitle: {
      jsonValue: {
        value: 'High-Pressure Water System',
      },
    },
    productFeatureText: {
      jsonValue: {
        value: '1500 GPM pump with 750-gallon water tank and foam suppression system',
      },
    },
    productDrivingRange: {
      jsonValue: {
        value: '300 miles',
      },
    },
    url: {
      path: '/vehicles/fire-trucks/pro',
      url: '/vehicles/fire-trucks/pro',
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

const mockPageEditing = {
  mode: {
    isEditing: true,
    isPreview: false,
    isNormal: false,
    name: 'edit' as const,
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

export const mockProductListingProps: ProductListingProps = {
  rendering: {
    componentName: 'ProductListing',
    dataSource: 'mock-datasource',
  },
  params: {},
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: {
            value: 'Explore Our Emergency Vehicle Fleet',
          },
        },
        viewAllLink: {
          jsonValue: {
            value: {
              href: '/vehicles/all',
              text: 'View All Vehicles',
              linktype: 'internal',
              target: '',
            },
          },
        },
        products: {
          targetItems: mockProductItems,
        },
      },
    },
  },
  page: mockPageBase,
  isPageEditing: false,
};

export const mockProductListingPropsEditMode: ProductListingProps = {
  ...mockProductListingProps,
  page: mockPageEditing,
  isPageEditing: true,
};
