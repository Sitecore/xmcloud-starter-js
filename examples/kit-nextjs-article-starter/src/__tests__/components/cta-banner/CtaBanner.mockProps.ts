import { Field, LinkField, ComponentRendering, Page, PageMode } from '@sitecore-content-sdk/nextjs';
import { ColorSchemeLimited as ColorScheme } from '@/enumerations/ColorSchemeLimited.enum';
import { EnumValues } from '@/enumerations/generic.enum';

// Mock page object with all required Page properties
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

export const mockPageEditing: Page = {
  mode: {
    isEditing: true,
    isPreview: false,
    isNormal: false,
    name: 'edit' as PageMode['name'],
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

// Mock text fields
export const mockTitleField: Field<string> = {
  value: 'Ready to Get Started?',
};

export const mockDescriptionField: Field<string> = {
  value: 'Join thousands of satisfied customers and transform your business today.',
};

export const mockEmptyTitleField: Field<string> = {
  value: '',
};

export const mockEmptyDescriptionField: Field<string> = {
  value: '',
};

// Mock link field
export const mockLinkField: LinkField = {
  value: {
    href: '/contact',
    text: 'Contact Us',
    linktype: 'internal',
    url: '/contact',
  },
};

export const mockExternalLinkField: LinkField = {
  value: {
    href: 'https://example.com/signup',
    text: 'Sign Up Now',
    linktype: 'external',
    url: 'https://example.com/signup',
  },
};

export const mockEmptyLinkField: LinkField = {
  value: {
    href: '',
    text: '',
    linktype: 'internal',
    url: '',
  },
};

// Mock fields
export const mockFieldsDefault = {
  titleRequired: mockTitleField,
  descriptionOptional: mockDescriptionField,
  linkOptional: mockLinkField,
};

export const mockFieldsWithoutDescription = {
  titleRequired: mockTitleField,
  linkOptional: mockLinkField,
};

export const mockFieldsWithoutLink = {
  titleRequired: mockTitleField,
  descriptionOptional: mockDescriptionField,
};

export const mockFieldsWithEmptyLink = {
  titleRequired: mockTitleField,
  descriptionOptional: mockDescriptionField,
  linkOptional: mockEmptyLinkField,
};

export const mockFieldsWithExternalLink = {
  titleRequired: mockTitleField,
  descriptionOptional: mockDescriptionField,
  linkOptional: mockExternalLinkField,
};

export const mockFieldsMinimal = {
  titleRequired: mockTitleField,
};

export const mockFieldsWithEmptyValues = {
  titleRequired: mockEmptyTitleField,
  descriptionOptional: mockEmptyDescriptionField,
  linkOptional: mockLinkField,
};

// Mock params
export const mockParamsDefault = {
  colorScheme: 'default' as EnumValues<typeof ColorScheme>,
};

export const mockParamsPrimary = {
  colorScheme: ColorScheme.PRIMARY,
};

export const mockParamsSecondary = {
  colorScheme: ColorScheme.SECONDARY,
};

export const mockParamsWithoutColorScheme = {};

// Mock rendering
const mockRendering: ComponentRendering = {
  componentName: 'CtaBanner',
};

// Complete props combinations
export const defaultProps = {
  fields: mockFieldsDefault,
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutDescription = {
  fields: mockFieldsWithoutDescription,
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutLink = {
  fields: mockFieldsWithoutLink,
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithEmptyLink = {
  fields: mockFieldsWithEmptyLink,
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithExternalLink = {
  fields: mockFieldsWithExternalLink,
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsMinimal = {
  fields: mockFieldsMinimal,
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithEmptyValues = {
  fields: mockFieldsWithEmptyValues,
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithPrimaryColorScheme = {
  fields: mockFieldsDefault,
  params: mockParamsPrimary,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithSecondaryColorScheme = {
  fields: mockFieldsDefault,
  params: mockParamsSecondary,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutColorScheme = {
  fields: mockFieldsDefault,
  params: mockParamsWithoutColorScheme,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutFields = {
  fields: undefined,
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
};

