import { Field, ImageField, LinkField, Page, PageMode, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { EnumValues } from '@/enumerations/generic.enum';
import { ColorSchemeLimited } from '@/enumerations/ColorSchemeLimited.enum';
import { PageHeaderProps } from '@/components/page-header/page-header.props';

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
    src: '/images/page-header.jpg',
    alt: 'Page Header Image',
    width: 547,
    height: 400,
  },
};

// Mock video field
export const mockVideoField: LinkField = {
  value: {
    href: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    text: 'Watch Video',
    title: 'Watch our video',
    target: '_blank',
    linktype: 'external',
  },
};

// Mock title fields
export const mockPageTitleField: Field<string> = {
  value: 'Welcome to Our Platform',
};

export const mockPageHeaderTitleField: Field<string> = {
  value: 'Custom Header Title',
};

// Mock subtitle field
export const mockPageSubtitleField: Field<string> = {
  value: '<p>Discover innovative solutions that transform your business with cutting-edge technology and expert guidance.</p>',
};

// Mock logo text field
export const mockLogoTextField: Field<string> = {
  value: 'Trusted by industry leaders',
};

// Mock logo images
export const mockLogo1: ImageField = {
  value: {
    src: '/images/logo-1.png',
    alt: 'Partner Logo 1',
    width: 150,
    height: 50,
  },
};

export const mockLogo2: ImageField = {
  value: {
    src: '/images/logo-2.png',
    alt: 'Partner Logo 2',
    width: 150,
    height: 50,
  },
};

export const mockLogo3: ImageField = {
  value: {
    src: '/images/logo-3.png',
    alt: 'Partner Logo 3',
    width: 150,
    height: 50,
  },
};

// Complete fields data with all options
export const mockFields = {
  data: {
    datasource: {
      imageRequired: {
        jsonValue: mockImageField,
      },
      videoOptional: {
        jsonValue: mockVideoField,
      },
      logoText: {
        jsonValue: mockLogoTextField,
      },
      children: {
        results: [
          { image: { jsonValue: mockLogo1 } },
          { image: { jsonValue: mockLogo2 } },
          { image: { jsonValue: mockLogo3 } },
        ],
      },
    },
    externalFields: {
      pageTitle: {
        jsonValue: mockPageTitleField,
      },
      pageHeaderTitle: {
        jsonValue: mockPageHeaderTitleField,
      },
      pageSubtitle: {
        jsonValue: mockPageSubtitleField,
      },
    },
  },
};

// Fields without video (image only)
export const mockFieldsWithoutVideo = {
  data: {
    datasource: {
      imageRequired: {
        jsonValue: mockImageField,
      },
      logoText: {
        jsonValue: mockLogoTextField,
      },
      children: {
        results: [
          { image: { jsonValue: mockLogo1 } },
          { image: { jsonValue: mockLogo2 } },
        ],
      },
    },
    externalFields: {
      pageTitle: {
        jsonValue: mockPageTitleField,
      },
      pageHeaderTitle: {
        jsonValue: mockPageHeaderTitleField,
      },
      pageSubtitle: {
        jsonValue: mockPageSubtitleField,
      },
    },
  },
};

// Fields without logos
export const mockFieldsWithoutLogos = {
  data: {
    datasource: {
      imageRequired: {
        jsonValue: mockImageField,
      },
      videoOptional: {
        jsonValue: mockVideoField,
      },
      logoText: {
        jsonValue: mockLogoTextField,
      },
    },
    externalFields: {
      pageTitle: {
        jsonValue: mockPageTitleField,
      },
      pageHeaderTitle: {
        jsonValue: mockPageHeaderTitleField,
      },
      pageSubtitle: {
        jsonValue: mockPageSubtitleField,
      },
    },
  },
};

// Fields with pageTitle instead of pageHeaderTitle (pageHeaderTitle should be undefined to test fallback)
export const mockFieldsWithPageTitle: PageHeaderProps['fields'] = {
  data: {
    datasource: {
      imageRequired: {
        jsonValue: mockImageField,
      },
      videoOptional: {
        jsonValue: mockVideoField,
      },
    },
    externalFields: {
      pageTitle: {
        jsonValue: mockPageTitleField,
      },
      pageHeaderTitle: {
        jsonValue: undefined as unknown as Field<string>,
      },
      pageSubtitle: {
        jsonValue: mockPageSubtitleField,
      },
    },
  },
};

// Fields without subtitle (subtitle should be undefined to test optional field)
export const mockFieldsWithoutSubtitle: PageHeaderProps['fields'] = {
  data: {
    datasource: {
      imageRequired: {
        jsonValue: mockImageField,
      },
    },
    externalFields: {
      pageTitle: {
        jsonValue: mockPageTitleField,
      },
      pageHeaderTitle: {
        jsonValue: mockPageHeaderTitleField,
      },
      pageSubtitle: {
        jsonValue: undefined as unknown as Field<string>,
      },
    },
  },
};

// Mock params
export const mockParamsDefault: PageHeaderProps['params'] = {
  colorScheme: 'default' as EnumValues<typeof ColorSchemeLimited> | 'default',
  darkPlayIcon: '0' as '0' | '1',
  RenderingIdentifier: 'page-header-rendering-id',
};

export const mockParamsPrimary: PageHeaderProps['params'] = {
  colorScheme: 'primary' as EnumValues<typeof ColorSchemeLimited>,
  darkPlayIcon: '0' as '0' | '1',
  RenderingIdentifier: 'page-header-rendering-id',
};

export const mockParamsSecondary: PageHeaderProps['params'] = {
  colorScheme: 'secondary' as EnumValues<typeof ColorSchemeLimited>,
  darkPlayIcon: '1' as '0' | '1',
  RenderingIdentifier: 'page-header-rendering-id',
};

export const mockParamsWithDarkIcon: PageHeaderProps['params'] = {
  colorScheme: 'default' as EnumValues<typeof ColorSchemeLimited> | 'default',
  darkPlayIcon: '1' as '0' | '1',
  RenderingIdentifier: 'page-header-rendering-id',
};

// Mock rendering
const mockRendering: ComponentRendering = {
  componentName: 'PageHeader',
};

// Complete props combinations
export const defaultProps: PageHeaderProps = {
  params: mockParamsDefault,
  fields: mockFields,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsPrimaryColorScheme: PageHeaderProps = {
  params: mockParamsPrimary,
  fields: mockFields,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsSecondaryColorScheme: PageHeaderProps = {
  params: mockParamsSecondary,
  fields: mockFields,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithDarkIcon: PageHeaderProps = {
  params: mockParamsWithDarkIcon,
  fields: mockFields,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutVideo: PageHeaderProps = {
  params: mockParamsDefault,
  fields: mockFieldsWithoutVideo,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutLogos: PageHeaderProps = {
  params: mockParamsDefault,
  fields: mockFieldsWithoutLogos,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithPageTitle: PageHeaderProps = {
  params: mockParamsDefault,
  fields: mockFieldsWithPageTitle,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutSubtitle: PageHeaderProps = {
  params: mockParamsDefault,
  fields: mockFieldsWithoutSubtitle,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutFields: PageHeaderProps = {
  params: mockParamsDefault,
  fields: null as unknown as PageHeaderProps['fields'],
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsEditing: PageHeaderProps = {
  params: mockParamsDefault,
  fields: mockFields,
  rendering: mockRendering,
  page: mockPageEditing,
};


