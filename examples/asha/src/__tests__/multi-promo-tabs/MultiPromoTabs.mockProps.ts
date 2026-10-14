import type {
  MultiPromoTabsProps,
  MultiPromoTabsFields,
} from '../../components/multi-promo-tabs/multi-promo-tabs.props';
import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { mockPage } from '../test-utils/mockPage';

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

const mockTitleField = createMockField('Product Categories');
const mockDroplistLabelField = createMockField('Select Category');

const mockTabItem1: MultiPromoTabsFields = {
  title: { jsonValue: createMockField('Audio') },
  image1: { jsonValue: createMockImageField('/category/audio-1.jpg', 'Audio Product 1') },
  image2: { jsonValue: createMockImageField('/category/audio-2.jpg', 'Audio Product 2') },
  link1: { jsonValue: createMockLinkField('/products/headphones', 'Shop Headphones') },
  link2: { jsonValue: createMockLinkField('/products/speakers', 'Shop Speakers') },
};

const mockTabItem2: MultiPromoTabsFields = {
  title: { jsonValue: createMockField('Smart Home') },
  image1: { jsonValue: createMockImageField('/category/smart-1.jpg', 'Smart Home Product 1') },
  image2: { jsonValue: createMockImageField('/category/smart-2.jpg', 'Smart Home Product 2') },
  link1: { jsonValue: createMockLinkField('/products/lights', 'Smart Lighting') },
  link2: { jsonValue: createMockLinkField('/products/security', 'Home Security') },
};

const mockTabItem3: MultiPromoTabsFields = {
  title: { jsonValue: createMockField('Gaming') },
  image1: { jsonValue: createMockImageField('/category/gaming-1.jpg', 'Gaming Product 1') },
  image2: { jsonValue: createMockImageField('/category/gaming-2.jpg', 'Gaming Product 2') },
  link1: { jsonValue: createMockLinkField('/products/consoles', 'Gaming Consoles') },
  link2: { jsonValue: createMockLinkField('/products/accessories', 'Gaming Accessories') },
};

export const defaultMultiPromoTabsProps: MultiPromoTabsProps = {
  rendering: { componentName: 'MultiPromoTabs', params: {} },
  params: {},
  page: mockPage,
  fields: {
    data: {
      datasource: {
        title: { jsonValue: mockTitleField },
        droplistLabel: { jsonValue: mockDroplistLabelField },
        children: {
          results: [mockTabItem1, mockTabItem2, mockTabItem3],
        },
      },
    },
  },
};

export const multiPromoTabsPropsMinimal: MultiPromoTabsProps = {
  rendering: { componentName: 'MultiPromoTabs', params: {} },
  params: {},
  page: mockPage,
  fields: {
    data: {
      datasource: {
        children: {
          results: [mockTabItem1, mockTabItem2],
        },
      },
    },
  },
};

export const multiPromoTabsPropsNoTabs: MultiPromoTabsProps = {
  rendering: { componentName: 'MultiPromoTabs', params: {} },
  params: {},
  page: mockPage,
  fields: {
    data: {
      datasource: {
        title: { jsonValue: mockTitleField },
        droplistLabel: { jsonValue: mockDroplistLabelField },
        children: {
          results: [],
        },
      },
    },
  },
};

export const multiPromoTabsPropsEmpty: MultiPromoTabsProps = {
  rendering: { componentName: 'MultiPromoTabs', params: {} },
  params: {},
  page: mockPage,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: undefined as any,
};

// Mock useSitecore contexts
export const mockUseSitecoreNormal = {
  page: { mode: { isEditing: false } },
} as unknown;

export const mockUseSitecoreEditing = {
  page: { mode: { isEditing: true } },
} as unknown;
