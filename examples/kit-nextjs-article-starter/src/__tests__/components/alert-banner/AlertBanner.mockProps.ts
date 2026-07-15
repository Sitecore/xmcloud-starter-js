import { Field, ImageField, LinkField, Page, ComponentRendering, PageMode } from '@sitecore-content-sdk/nextjs';

// Mock fields data
export const mockTitleField: Field<string> = {
  value: 'Important Announcement',
};

export const mockDescriptionField: Field<string> = {
  value: 'Please read this important message carefully',
};

export const mockImageField: ImageField = {
  value: {
    src: '/test-alert-image.jpg',
    alt: 'Alert Image',
    width: 100,
    height: 100,
  },
};

export const mockLinkField: LinkField = {
  value: {
    href: '/learn-more',
    text: 'Learn More',
    title: 'Learn More',
    target: '',
    linktype: 'internal',
  },
};

export const mockLinkFieldEmpty: LinkField = {
  value: {
    href: '',
    text: '',
    title: '',
    target: '',
    linktype: '',
  },
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

export const mockFields = {
  title: mockTitleField,
  description: mockDescriptionField,
  image: mockImageField,
  link: mockLinkField,
};

export const mockFieldsWithoutLink = {
  title: mockTitleField,
  description: mockDescriptionField,
  image: mockImageField,
};

export const mockFieldsWithoutImage = {
  title: mockTitleField,
  description: mockDescriptionField,
  link: mockLinkField,
};

export const mockFieldsWithEmptyLink = {
  title: mockTitleField,
  description: mockDescriptionField,
  link: mockLinkFieldEmpty,
};

export const mockFieldsMinimal = {
  title: mockTitleField,
  description: mockDescriptionField,
};

export const mockFieldsWithEmptyTitle = {
  title: {
    value: '',
  } as Field<string>,
  description: mockDescriptionField,
  link: mockLinkField,
};

export const mockFieldsWithEmptyDescription = {
  title: mockTitleField,
  description: {
    value: '',
  } as Field<string>,
  link: mockLinkField,
};

// Mock params data
export const mockParams = {
  mock_param: 'test-param-value',
};

export const mockParamsEmpty = {};

// Mock external fields data
export const mockExternalFields = {
  mock_external_data: {
    value: 'External data value',
  } as Field<string>,
};

// Mock rendering data
export const mockRendering: ComponentRendering = {
  componentName: 'AlertBanner',
} as ComponentRendering;

// Complete props combinations
export const defaultProps = {
  params: mockParams,
  fields: mockFields,
  externalFields: mockExternalFields,
  rendering: mockRendering,
  page: mockPage,
};

export const propsWithoutLink = {
  params: mockParams,
  fields: mockFieldsWithoutLink,
  externalFields: mockExternalFields,
  rendering: mockRendering,
  page: mockPage,
};

export const propsWithoutImage = {
  params: mockParams,
  fields: mockFieldsWithoutImage,
  externalFields: mockExternalFields,
  rendering: mockRendering,
  page: mockPage,
};

export const propsWithEmptyLink = {
  params: mockParams,
  fields: mockFieldsWithEmptyLink,
  externalFields: mockExternalFields,
  rendering: mockRendering,
  page: mockPage,
};

export const propsMinimal = {
  params: mockParams,
  fields: mockFieldsMinimal,
  externalFields: mockExternalFields,
  rendering: mockRendering,
  page: mockPage,
};

export const propsWithEmptyTitle = {
  params: mockParams,
  fields: mockFieldsWithEmptyTitle,
  externalFields: mockExternalFields,
  rendering: mockRendering,
  page: mockPage,
};

export const propsWithEmptyDescription = {
  params: mockParams,
  fields: mockFieldsWithEmptyDescription,
  externalFields: mockExternalFields,
  rendering: mockRendering,
  page: mockPage,
};

type AlertBannerFields = {
  fields: {
    title: Field<string>;
    description: Field<string>;
    image?: ImageField;
    link?: LinkField;
  };
};

// Export the fields type for use in tests
export type AlertBannerFieldsType = AlertBannerFields['fields'];

export const propsWithoutFields = {
  params: mockParams,
  fields: null as AlertBannerFields['fields'] | null,
  externalFields: mockExternalFields,
  rendering: mockRendering,
  page: mockPage,
};

export const propsWithEmptyParams = {
  params: mockParamsEmpty,
  fields: mockFields,
  externalFields: mockExternalFields,
  rendering: mockRendering,
  page: mockPage,
};


