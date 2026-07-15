import type {
  MultiPromoProps,
  MultiPromoItemProps,
} from '../../components/multi-promo/multi-promo.props';
import type { Field, ImageField, LinkField, Page, PageMode } from '@sitecore-content-sdk/nextjs';

// Inline utility functions
const createMockField = <T>(value: T): Field<T> => ({ value }) as unknown as Field<T>;
const createMockImageField = (src: string, alt: string): ImageField =>
  ({
    value: { src, alt, width: '400', height: '300' },
  }) as unknown as ImageField;
const createMockLinkField = (href: string, text: string): LinkField =>
  ({
    value: { href, text },
  }) as unknown as LinkField;

// Mock page objects
const mockPageBase: Page = {
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

const mockTitleField = createMockField('Featured Promotions');
const mockDescriptionField = createMockField('Discover our latest offers and exclusive deals');

const mockPromoItem1: MultiPromoItemProps = {
  heading: { jsonValue: createMockField('Summer Sale') },
  image: { jsonValue: createMockImageField('/promo/summer-sale.jpg', 'Summer Sale Image') },
  link: { jsonValue: createMockLinkField('/sale/summer', 'Shop Summer Sale') },
};

const mockPromoItem2: MultiPromoItemProps = {
  heading: { jsonValue: createMockField('New Arrivals') },
  image: { jsonValue: createMockImageField('/promo/new-arrivals.jpg', 'New Arrivals Image') },
  link: { jsonValue: createMockLinkField('/products/new', 'View New Products') },
};

const mockPromoItem3: MultiPromoItemProps = {
  heading: { jsonValue: createMockField('Tech Accessories') },
  image: { jsonValue: createMockImageField('/promo/accessories.jpg', 'Tech Accessories Image') },
  link: { jsonValue: createMockLinkField('/category/accessories', 'Browse Accessories') },
};

const mockPromoItem4: MultiPromoItemProps = {
  heading: { jsonValue: createMockField('Audio Equipment') },
  image: { jsonValue: createMockImageField('/promo/audio.jpg', 'Audio Equipment Image') },
  link: { jsonValue: createMockLinkField('/category/audio', 'Explore Audio') },
};

export const defaultMultiPromoProps: MultiPromoProps = {
  rendering: { componentName: 'MultiPromo', params: {} },
  params: { numColumns: '3' },
  fields: {
    data: {
      datasource: {
        title: { jsonValue: mockTitleField },
        description: { jsonValue: mockDescriptionField },
        children: {
          results: [mockPromoItem1, mockPromoItem2, mockPromoItem3, mockPromoItem4],
        },
      },
    },
  },
  name: 'MultiPromo',
  promos: [],
  page: mockPageBase,
};

export const multiPromoPropsNoChildren: MultiPromoProps = {
  rendering: { componentName: 'MultiPromo', params: {} },
  params: { numColumns: '3' },
  fields: {
    data: {
      datasource: {
        title: { jsonValue: mockTitleField },
        description: { jsonValue: mockDescriptionField },
        children: {
          results: [],
        },
      },
    },
  },
  name: 'MultiPromo',
  promos: [],
  page: mockPageBase,
};

export const multiPromoPropsMinimal: MultiPromoProps = {
  rendering: { componentName: 'MultiPromo', params: {} },
  params: { numColumns: '4' },
  fields: {
    data: {
      datasource: {
        title: { jsonValue: mockTitleField },
        children: {
          results: [mockPromoItem1, mockPromoItem2],
        },
      },
    },
  },
  name: 'MultiPromo',
  promos: [],
  page: mockPageBase,
};

export const multiPromoPropsThreeColumns: MultiPromoProps = {
  ...defaultMultiPromoProps,
  params: { numColumns: '3' },
};

export const multiPromoPropsEmpty: MultiPromoProps = {
  rendering: { componentName: 'MultiPromo', params: {} },
  params: {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: undefined as any,
  name: 'MultiPromo',
  promos: [],
  page: mockPageBase,
};
