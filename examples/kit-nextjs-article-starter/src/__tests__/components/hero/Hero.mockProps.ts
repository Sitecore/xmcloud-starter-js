import { Field, LinkField, ImageField, Page, PageMode, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { HeroProps } from '@/components/hero/hero.props';
import { EnumValues } from '@/enumerations/generic.enum';
import { ColorScheme } from '@/enumerations/CtaBannerColorScheme.enum';

// Mock page data for useSitecore hook
export const mockPageData = {
  page: {
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
  } as Page,
};

export const mockPageDataEditing = {
  page: {
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
  } as Page,
};

// Mock text fields
export const mockTitleField: Field<string> = {
  value: 'Welcome to Our Platform',
};

export const mockDescriptionField: Field<string> = {
  value: 'Discover amazing features and transform your experience with our innovative solutions.',
};

// Mock link field
export const mockLinkField: LinkField = {
  value: {
    href: '/get-started',
    text: 'Get Started',
    title: 'Get Started Today',
    target: '',
    linktype: 'internal',
  },
};

// Mock video links
export const mockVideoLink1: LinkField = {
  value: {
    href: '/videos/hero-video-1.mp4',
    text: 'Hero Video 1',
    title: '',
    target: '',
    linktype: 'media',
  },
};

export const mockVideoLink2: LinkField = {
  value: {
    href: '/videos/hero-video-2.mp4',
    text: 'Hero Video 2',
    title: '',
    target: '',
    linktype: 'media',
  },
};

export const mockVideoLink3: LinkField = {
  value: {
    href: '/videos/hero-video-3.mp4',
    text: 'Hero Video 3',
    title: '',
    target: '',
    linktype: 'media',
  },
};

export const mockVideoLink4: LinkField = {
  value: {
    href: '/videos/hero-video-4.mp4',
    text: 'Hero Video 4',
    title: '',
    target: '',
    linktype: 'media',
  },
};

// Mock image fields
export const mockImageField1: ImageField = {
  value: {
    src: '/images/hero-image-1.jpg',
    alt: 'Hero Image 1',
    width: 280,
    height: 356,
  },
};

export const mockImageField2: ImageField = {
  value: {
    src: '/images/hero-image-2.jpg',
    alt: 'Hero Image 2',
    width: 280,
    height: 196,
  },
};

export const mockImageField3: ImageField = {
  value: {
    src: '/images/hero-image-3.jpg',
    alt: 'Hero Image 3',
    width: 280,
    height: 356,
  },
};

export const mockImageField4: ImageField = {
  value: {
    src: '/images/hero-image-4.jpg',
    alt: 'Hero Image 4',
    width: 280,
    height: 356,
  },
};

// Complete fields data
export const mockFields = {
  titleRequired: mockTitleField,
  descriptionOptional: mockDescriptionField,
  linkOptional: mockLinkField,
  heroVideoOptional1: mockVideoLink1,
  heroImageOptional1: mockImageField1,
  heroVideoOptional2: mockVideoLink2,
  heroImageOptional2: mockImageField2,
  heroVideoOptional3: mockVideoLink3,
  heroImageOptional3: mockImageField3,
  heroVideoOptional4: mockVideoLink4,
  heroImageOptional4: mockImageField4,
};

export const mockFieldsWithoutDescription = {
  titleRequired: mockTitleField,
  linkOptional: mockLinkField,
  heroVideoOptional1: mockVideoLink1,
  heroImageOptional1: mockImageField1,
  heroVideoOptional2: mockVideoLink2,
  heroImageOptional2: mockImageField2,
  heroVideoOptional3: mockVideoLink3,
  heroImageOptional3: mockImageField3,
  heroVideoOptional4: mockVideoLink4,
  heroImageOptional4: mockImageField4,
};

export const mockFieldsWithoutLink = {
  titleRequired: mockTitleField,
  descriptionOptional: mockDescriptionField,
  heroVideoOptional1: mockVideoLink1,
  heroImageOptional1: mockImageField1,
  heroVideoOptional2: mockVideoLink2,
  heroImageOptional2: mockImageField2,
  heroVideoOptional3: mockVideoLink3,
  heroImageOptional3: mockImageField3,
  heroVideoOptional4: mockVideoLink4,
  heroImageOptional4: mockImageField4,
};

export const mockFieldsWithOnlyTitle = {
  titleRequired: mockTitleField,
};

export const mockFieldsWithImagesOnly = {
  titleRequired: mockTitleField,
  descriptionOptional: mockDescriptionField,
  linkOptional: mockLinkField,
  heroImageOptional1: mockImageField1,
  heroImageOptional2: mockImageField2,
  heroImageOptional3: mockImageField3,
  heroImageOptional4: mockImageField4,
};

// Mock params for different color schemes
export const mockParamsLight = {
  colorScheme: 'light' as EnumValues<typeof ColorScheme>,
  styles: 'custom-hero-style',
  RenderingIdentifier: 'hero-rendering-id',
};

export const mockParamsPrimary = {
  colorScheme: 'primary' as EnumValues<typeof ColorScheme>,
  RenderingIdentifier: 'hero-rendering-id',
};

export const mockParamsSecondary = {
  colorScheme: 'secondary' as EnumValues<typeof ColorScheme>,
  RenderingIdentifier: 'hero-rendering-id',
};

export const mockParamsTertiary = {
  colorScheme: 'tertiary' as EnumValues<typeof ColorScheme>,
  RenderingIdentifier: 'hero-rendering-id',
};

export const mockParamsDark = {
  colorScheme: 'dark' as EnumValues<typeof ColorScheme>,
  RenderingIdentifier: 'hero-rendering-id',
};

export const mockParamsWithoutColorScheme = {
  RenderingIdentifier: 'hero-rendering-id',
};

// Mock rendering
const mockRendering: ComponentRendering = {
  componentName: 'Hero',
};

// Complete props combinations
export const defaultProps: HeroProps = {
  params: mockParamsLight,
  fields: mockFields,
  rendering: mockRendering,
  page: mockPageData.page,
};

export const propsWithPrimaryScheme: HeroProps = {
  params: mockParamsPrimary,
  fields: mockFields,
  rendering: mockRendering,
  page: mockPageData.page,
};

export const propsWithSecondaryScheme: HeroProps = {
  params: mockParamsSecondary,
  fields: mockFields,
  rendering: mockRendering,
  page: mockPageData.page,
};

export const propsWithTertiaryScheme: HeroProps = {
  params: mockParamsTertiary,
  fields: mockFields,
  rendering: mockRendering,
  page: mockPageData.page,
};

export const propsWithDarkScheme: HeroProps = {
  params: mockParamsDark,
  fields: mockFields,
  rendering: mockRendering,
  page: mockPageData.page,
};

export const propsWithoutDescription: HeroProps = {
  params: mockParamsLight,
  fields: mockFieldsWithoutDescription,
  rendering: mockRendering,
  page: mockPageData.page,
};

export const propsWithoutLink: HeroProps = {
  params: mockParamsLight,
  fields: mockFieldsWithoutLink,
  rendering: mockRendering,
  page: mockPageData.page,
};

export const propsWithOnlyTitle: HeroProps = {
  params: mockParamsLight,
  fields: mockFieldsWithOnlyTitle,
  rendering: mockRendering,
  page: mockPageData.page,
};

export const propsWithImagesOnly: HeroProps = {
  params: mockParamsLight,
  fields: mockFieldsWithImagesOnly,
  rendering: mockRendering,
  page: mockPageData.page,
};

export const propsWithoutColorScheme: HeroProps = {
  params: mockParamsWithoutColorScheme,
  fields: mockFields,
  rendering: mockRendering,
  page: mockPageData.page,
};

export const propsWithoutFields: HeroProps = {
  params: mockParamsLight,
  fields: null as unknown as HeroProps['fields'],
  rendering: mockRendering,
  page: mockPageData.page,
};

export const propsEditing: HeroProps = {
  params: mockParamsLight,
  fields: mockFields,
  rendering: mockRendering,
  page: mockPageDataEditing.page,
};

