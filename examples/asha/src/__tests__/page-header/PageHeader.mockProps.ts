import type { PageHeaderProps } from '../../components/page-header/page-header.props';
import type { Field, ImageField, LinkField, Page } from '@sitecore-content-sdk/nextjs';

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
const createMockImageField = (src: string, alt: string): ImageField =>
  ({
    value: { src, alt, width: '800', height: '600' },
  }) as unknown as ImageField;
const createMockLinkField = (href: string, text: string): LinkField =>
  ({
    value: { href, text },
  }) as unknown as LinkField;

const mockPageTitleField = createMockField('Welcome to Our Store');
const mockPageHeaderTitleField = createMockField('Discover Amazing Products');
const mockPageSubtitleField = createMockField('Find the perfect tech solutions for your needs');
const mockImageField = createMockImageField('/page-header/hero.jpg', 'Page Header Hero Image');
const mockLink1Field = createMockLinkField('/shop/products', 'Shop Now');
const mockLink2Field = createMockLinkField('/about', 'Learn More');

export const defaultPageHeaderProps: PageHeaderProps = {
  rendering: { componentName: 'PageHeader', params: {} },
  params: {},
  page: mockPageNormal,
  fields: {
    data: {
      datasource: {
        imageRequired: { jsonValue: mockImageField },
        link1: { jsonValue: mockLink1Field },
        link2: { jsonValue: mockLink2Field },
      },
      externalFields: {
        pageHeaderTitle: { jsonValue: mockPageHeaderTitleField },
        pageTitle: { jsonValue: mockPageTitleField },
        pageSubtitle: { jsonValue: mockPageSubtitleField },
      },
    },
  },
};

export const pageHeaderPropsMinimal: PageHeaderProps = {
  rendering: { componentName: 'PageHeader', params: {} },
  params: {},
  page: mockPageNormal,
  fields: {
    data: {
      datasource: {
        imageRequired: { jsonValue: mockImageField },
      },
      externalFields: {
        pageTitle: { jsonValue: mockPageTitleField },
        pageHeaderTitle: { jsonValue: { value: '' } },
        pageSubtitle: { jsonValue: { value: '' } },
      },
    },
  },
};

export const pageHeaderPropsNoImage: PageHeaderProps = {
  rendering: { componentName: 'PageHeader', params: {} },
  params: {},
  page: mockPageNormal,
  fields: {
    data: {
      datasource: {
        imageRequired: { jsonValue: { value: null } as unknown as ImageField },
        link1: { jsonValue: mockLink1Field },
        link2: { jsonValue: mockLink2Field },
      },
      externalFields: {
        pageHeaderTitle: { jsonValue: mockPageHeaderTitleField },
        pageTitle: { jsonValue: mockPageTitleField },
        pageSubtitle: { jsonValue: mockPageSubtitleField },
      },
    },
  },
};

export const pageHeaderPropsNoLinks: PageHeaderProps = {
  rendering: { componentName: 'PageHeader', params: {} },
  params: {},
  page: mockPageNormal,
  fields: {
    data: {
      datasource: {
        imageRequired: { jsonValue: mockImageField },
      },
      externalFields: {
        pageHeaderTitle: { jsonValue: mockPageHeaderTitleField },
        pageTitle: { jsonValue: mockPageTitleField },
        pageSubtitle: { jsonValue: mockPageSubtitleField },
      },
    },
  },
};

export const pageHeaderPropsWithPositionStyles: PageHeaderProps = {
  ...defaultPageHeaderProps,
  params: {
    styles: 'position-center position-bottom',
  },
  page: mockPageNormal,
};

export const pageHeaderPropsEmpty: PageHeaderProps = {
  rendering: { componentName: 'PageHeader', params: {} },
  params: {},
  page: mockPageNormal,
  fields: {
    data: {
      datasource: {
        imageRequired: { jsonValue: mockImageField },
      },
      externalFields: {
        pageTitle: { jsonValue: { value: '' } },
        pageHeaderTitle: { jsonValue: { value: '' } },
        pageSubtitle: { jsonValue: { value: '' } },
      },
    },
  },
};

// Mock useSitecore contexts (kept for backward compatibility but not used)
export const mockUseSitecoreNormal = {
  page: { mode: { isEditing: false } },
} as unknown;

export const mockUseSitecoreEditing = {
  page: { mode: { isEditing: true } },
} as unknown;

// Editing mode props
export const pageHeaderPropsEditing: PageHeaderProps = {
  ...defaultPageHeaderProps,
  page: mockPageEditing,
};
