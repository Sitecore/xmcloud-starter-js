// Mock props for ProductListing component tests
import { Field, ImageField, LinkField, Page } from '@sitecore-content-sdk/nextjs';
import {
  ProductListingProps,
  ProductItemProps,
} from '../../components/product-listing/product-listing.props';

/**
 * Mock page object for normal mode
 */
const mockPageNormal = {
  mode: {
    isEditing: false,
    isNormal: true,
    isPreview: false,
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

/**
 * Mock page object for editing mode
 */
const mockPageEditing = {
  mode: {
    isEditing: true,
    isNormal: false,
    isPreview: false,
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

// Inline utility functions
const createMockField = <T>(value: T): Field<T> => ({ value }) as unknown as Field<T>;
const createMockLinkField = (href: string, text: string): LinkField =>
  ({
    value: { href, text },
  }) as unknown as LinkField;
const createMockImageField = (src: string, alt: string): ImageField =>
  ({
    value: { src, alt, width: 400, height: 300 },
  }) as unknown as ImageField;

// Mock useSitecore contexts
export const mockUseSitecoreNormal = {
  page: { mode: { isEditing: false } },
} as unknown;

export const mockUseSitecoreEditing = {
  page: { mode: { isEditing: true } },
} as unknown;

// Mock product items
export const mockProductItem1: ProductItemProps = {
  productName: {
    jsonValue: createMockField('Pro Audio Headphones'),
  },
  productThumbnail: {
    jsonValue: createMockImageField('/images/headphones.jpg', 'Pro Audio Headphones'),
  },
  productBasePrice: {
    jsonValue: createMockField('$299.99'),
  },
  productFeatureTitle: {
    jsonValue: createMockField('Premium Sound'),
  },
  productFeatureText: {
    jsonValue: createMockField('High-fidelity audio drivers deliver crystal clear sound'),
  },
  productDrivingRange: {
    jsonValue: createMockField('40 hours'),
  },
  url: {
    path: '/products/pro-headphones',
  },
};

export const mockProductItem2: ProductItemProps = {
  productName: {
    jsonValue: createMockField('Wireless Earbuds'),
  },
  productThumbnail: {
    jsonValue: createMockImageField('/images/earbuds.jpg', 'Wireless Earbuds'),
  },
  productBasePrice: {
    jsonValue: createMockField('$199.99'),
  },
  productFeatureTitle: {
    jsonValue: createMockField('Active Noise Cancellation'),
  },
  productFeatureText: {
    jsonValue: createMockField('Advanced ANC technology blocks out distractions'),
  },
  productDrivingRange: {
    jsonValue: createMockField('24 hours'),
  },
  url: {
    path: '/products/wireless-earbuds',
  },
};

export const mockProductItem3: ProductItemProps = {
  productName: {
    jsonValue: createMockField('Studio Monitors'),
  },
  productThumbnail: {
    jsonValue: createMockImageField('/images/monitors.jpg', 'Studio Monitors'),
  },
  productBasePrice: {
    jsonValue: createMockField('$599.99'),
  },
  productFeatureTitle: {
    jsonValue: createMockField('Reference Quality'),
  },
  productFeatureText: {
    jsonValue: createMockField('Flat frequency response for accurate mixing'),
  },
  productDrivingRange: {
    jsonValue: createMockField('Unlimited'),
  },
  url: {
    path: '/products/studio-monitors',
  },
};

export const mockProductItemMinimal: ProductItemProps = {
  productName: {
    jsonValue: createMockField('Basic Speaker'),
  },
  productThumbnail: {
    jsonValue: createMockImageField('/images/speaker.jpg', 'Basic Speaker'),
  },
  productBasePrice: {
    jsonValue: createMockField(''),
  },
  productFeatureTitle: {
    jsonValue: createMockField(''),
  },
  productFeatureText: {
    jsonValue: createMockField(''),
  },
  productDrivingRange: {
    jsonValue: createMockField(''),
  },
  url: {
    path: '',
  },
};

// Default props with multiple products
export const defaultProductListingProps: ProductListingProps = {
  params: {
    styles: 'test-product-listing',
  },
  page: mockPageNormal,
  fields: {
    data: {
      datasource: {
        title: { jsonValue: createMockField('Featured Audio Products') },
        viewAllLink: { jsonValue: createMockLinkField('/products', 'View All Products') },
        products: {
          targetItems: [mockProductItem1, mockProductItem2, mockProductItem3],
        },
      },
    },
  },
  rendering: {
    uid: 'test-product-listing-uid',
    componentName: 'ProductListing',
    dataSource: '',
  },
  isPageEditing: false,
};

// Props with two products (for column layout testing)
export const productListingPropsTwoProducts: ProductListingProps = {
  ...defaultProductListingProps,
  fields: {
    data: {
      datasource: {
        title: { jsonValue: createMockField('Audio Collection') },
        viewAllLink: { jsonValue: createMockLinkField('/products', 'View All Products') },
        products: {
          targetItems: [mockProductItem1, mockProductItem2],
        },
      },
    },
  },
};

// Props with single product
export const productListingPropsSingleProduct: ProductListingProps = {
  ...defaultProductListingProps,
  fields: {
    data: {
      datasource: {
        title: { jsonValue: createMockField('Featured Product') },
        viewAllLink: { jsonValue: createMockLinkField('/products', 'View All Products') },
        products: {
          targetItems: [mockProductItem1],
        },
      },
    },
  },
};

// Props with no products
export const productListingPropsNoProducts: ProductListingProps = {
  ...defaultProductListingProps,
  fields: {
    data: {
      datasource: {
        title: { jsonValue: createMockField('Audio Products') },
        viewAllLink: { jsonValue: createMockLinkField('/products', 'View All Products') },
        products: {
          targetItems: [],
        },
      },
    },
  },
};

// Props with minimal product data
export const productListingPropsMinimal: ProductListingProps = {
  ...defaultProductListingProps,
  fields: {
    data: {
      datasource: {
        title: { jsonValue: createMockField('Basic Products') },
        viewAllLink: { jsonValue: createMockLinkField('/products', 'View All Products') },
        products: {
          targetItems: [mockProductItemMinimal],
        },
      },
    },
  },
};

// Props with editing mode enabled
export const productListingPropsEditing: ProductListingProps = {
  ...defaultProductListingProps,
  page: mockPageEditing,
  isPageEditing: true,
};

// Props without datasource
export const productListingPropsNoDataSource: ProductListingProps = {
  params: {},
  page: mockPageNormal,
  fields: {
    data: {
      datasource: {
        title: { jsonValue: createMockField('') },
        viewAllLink: { jsonValue: createMockLinkField('', '') },
      },
    },
  },
  rendering: {
    uid: 'test-no-datasource-uid',
    componentName: 'ProductListing',
    dataSource: '',
  },
  isPageEditing: false,
};

// Props without fields
export const productListingPropsNoFields: ProductListingProps = {
  params: {},
  page: mockPageNormal,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: undefined as any,
  rendering: {
    uid: 'test-no-fields-uid',
    componentName: 'ProductListing',
    dataSource: '',
  },
  isPageEditing: false,
};
