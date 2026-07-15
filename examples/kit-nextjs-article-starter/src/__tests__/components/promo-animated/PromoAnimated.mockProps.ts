import { Field, ImageField, LinkField, Page, PageMode, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { EnumValues } from '@/enumerations/generic.enum';
import { ColorSchemeLimited } from '@/enumerations/ColorSchemeLimited.enum';
import { PromoAnimatedProps } from '@/components/promo-animated/promo-animated.props';

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

const mockPageEditing: Page = {
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

// Mock image field
export const mockImageField: ImageField = {
  value: {
    src: '/images/promo-animated.jpg',
    alt: 'Promo Animated Image',
    width: 452,
    height: 452,
  },
};

// Mock title field
export const mockTitleField: Field<string> = {
  value: 'Discover Excellence',
};

// Mock description field
export const mockDescriptionField: Field<string> = {
  value: '<p>Experience the finest quality with our exclusive collection of premium products designed for excellence.</p>',
};

// Mock primary link field
export const mockPrimaryLinkField: LinkField = {
  value: {
    href: '/shop/premium',
    text: 'Shop Now',
    title: 'Shop Premium Products',
    target: '',
    linktype: 'internal',
  },
};

// Mock secondary link field
export const mockSecondaryLinkField: LinkField = {
  value: {
    href: '/learn-more',
    text: 'Learn More',
    title: 'Learn more about our products',
    target: '',
    linktype: 'internal',
  },
};

// Complete fields data
export const mockFields = {
  image: mockImageField,
  title: mockTitleField,
  description: mockDescriptionField,
  primaryLink: mockPrimaryLinkField,
  secondaryLink: mockSecondaryLinkField,
};

export const mockFieldsWithoutDescription = {
  image: mockImageField,
  title: mockTitleField,
  primaryLink: mockPrimaryLinkField,
  secondaryLink: mockSecondaryLinkField,
};

export const mockFieldsWithoutLinks = {
  image: mockImageField,
  title: mockTitleField,
  description: mockDescriptionField,
};

export const mockFieldsWithoutPrimaryLink = {
  image: mockImageField,
  title: mockTitleField,
  description: mockDescriptionField,
  secondaryLink: mockSecondaryLinkField,
};

export const mockFieldsWithoutSecondaryLink = {
  image: mockImageField,
  title: mockTitleField,
  description: mockDescriptionField,
  primaryLink: mockPrimaryLinkField,
};

// Mock params
export const mockParamsDefault: PromoAnimatedProps['params'] = {
  colorScheme: 'default' as EnumValues<typeof ColorSchemeLimited>,
  styles: '',
  RenderingIdentifier: 'promo-animated-rendering-id',
};

export const mockParamsPrimary: PromoAnimatedProps['params'] = {
  colorScheme: 'primary' as EnumValues<typeof ColorSchemeLimited>,
  styles: 'custom-promo-style',
  RenderingIdentifier: 'promo-animated-rendering-id',
};

export const mockParamsSecondary: PromoAnimatedProps['params'] = {
  colorScheme: 'secondary' as EnumValues<typeof ColorSchemeLimited>,
  styles: '',
  RenderingIdentifier: 'promo-animated-rendering-id',
};

export const mockParamsWithCustomStyles: PromoAnimatedProps['params'] = {
  colorScheme: 'default' as EnumValues<typeof ColorSchemeLimited>,
  styles: 'position-center',
  RenderingIdentifier: 'promo-animated-rendering-id',
};

export const mockParamsWithPositionRight: PromoAnimatedProps['params'] = {
  colorScheme: 'default' as EnumValues<typeof ColorSchemeLimited>,
  styles: 'position-right',
  RenderingIdentifier: 'promo-animated-rendering-id',
};

// Mock rendering
const mockRendering: ComponentRendering = {
  componentName: 'PromoAnimated',
};

// Complete props combinations
export const defaultProps: PromoAnimatedProps = {
  params: mockParamsDefault,
  fields: mockFields,
  rendering: mockRendering,
  isPageEditing: false,
  page: mockPageBase,
};

export const propsEditing: PromoAnimatedProps = {
  params: mockParamsDefault,
  fields: mockFields,
  rendering: mockRendering,
  isPageEditing: true,
  page: mockPageEditing,
};

export const propsPrimaryColorScheme: PromoAnimatedProps = {
  params: mockParamsPrimary,
  fields: mockFields,
  rendering: mockRendering,
  isPageEditing: false,
  page: mockPageBase,
};

export const propsSecondaryColorScheme: PromoAnimatedProps = {
  params: mockParamsSecondary,
  fields: mockFields,
  rendering: mockRendering,
  isPageEditing: false,
  page: mockPageBase,
};

export const propsWithoutDescription: PromoAnimatedProps = {
  params: mockParamsDefault,
  fields: mockFieldsWithoutDescription,
  rendering: mockRendering,
  isPageEditing: false,
  page: mockPageBase,
};

export const propsWithoutLinks: PromoAnimatedProps = {
  params: mockParamsDefault,
  fields: mockFieldsWithoutLinks,
  rendering: mockRendering,
  isPageEditing: false,
  page: mockPageBase,
};

export const propsWithoutPrimaryLink: PromoAnimatedProps = {
  params: mockParamsDefault,
  fields: mockFieldsWithoutPrimaryLink,
  rendering: mockRendering,
  isPageEditing: false,
  page: mockPageBase,
};

export const propsWithoutSecondaryLink: PromoAnimatedProps = {
  params: mockParamsDefault,
  fields: mockFieldsWithoutSecondaryLink,
  rendering: mockRendering,
  isPageEditing: false,
  page: mockPageBase,
};

export const propsWithCustomStyles: PromoAnimatedProps = {
  params: mockParamsWithCustomStyles,
  fields: mockFields,
  rendering: mockRendering,
  isPageEditing: false,
  page: mockPageBase,
};

export const propsWithPositionRight: PromoAnimatedProps = {
  params: mockParamsWithPositionRight,
  fields: mockFields,
  rendering: mockRendering,
  isPageEditing: false,
  page: mockPageBase,
};

export const propsWithoutFields: PromoAnimatedProps = {
  params: mockParamsDefault,
  fields: null as unknown as PromoAnimatedProps['fields'],
  rendering: mockRendering,
  isPageEditing: false,
  page: mockPageBase,
};


