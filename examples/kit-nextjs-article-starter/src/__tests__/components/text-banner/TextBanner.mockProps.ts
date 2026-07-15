import { Field, LinkField, ImageField, ComponentRendering, Page, PageMode } from '@sitecore-content-sdk/nextjs';
import { TextBannerProps } from '@/components/text-banner/text-banner.props';

// Mock rendering object
const mockRendering: ComponentRendering = {
  componentName: 'TextBanner',
  dataSource: '',
  params: {},
};

// Mock page object
const mockPage: Page = {
  mode: {
    name: 'normal' as PageMode['name'],
    isEditing: false,
    isPreview: false,
    isNormal: true,
    isDesignLibrary: false,
    designLibrary: { isVariantGeneration: false },
  },
  layout: {
    sitecore: {
      route: null,
    },
  } as Page['layout'],
  locale: 'en',
};

// Mock page object for editing mode
const mockPageEditing: Page = {
  mode: {
    name: 'edit' as PageMode['name'],
    isEditing: true,
    isPreview: false,
    isNormal: false,
    isDesignLibrary: false,
    designLibrary: { isVariantGeneration: false },
  },
  layout: {
    sitecore: {
      route: null,
    },
  } as Page['layout'],
  locale: 'en',
};

// Mock fields
export const mockHeading: Field<string> = {
  value: 'Welcome to Our Platform',
};

export const mockDescription: Field<string> = {
  value: 'Discover amazing features and benefits that will transform your experience',
};

export const mockLink: LinkField = {
  value: {
    href: '/learn-more',
    text: 'Learn More',
    linktype: 'internal',
    url: '/learn-more',
  },
};

export const mockLink2: LinkField = {
  value: {
    href: '/get-started',
    text: 'Get Started',
    linktype: 'internal',
    url: '/get-started',
  },
};

export const mockImage: ImageField = {
  value: {
    src: '/images/banner-background.jpg',
    alt: 'Banner Background',
    width: 1920,
    height: 600,
  },
};

// Default props with all fields
export const defaultProps: TextBannerProps = {
  fields: {
    heading: mockHeading,
    description: mockDescription,
    link: mockLink,
    link2: mockLink2,
    image: mockImage,
  },
  params: {
    theme: 'primary',
  },
  rendering: mockRendering,
  page: mockPage,
};

// Props without image
export const propsWithoutImage: TextBannerProps = {
  fields: {
    heading: mockHeading,
    description: mockDescription,
    link: mockLink,
    link2: mockLink2,
  },
  params: {
    theme: 'primary',
  },
  rendering: mockRendering,
  page: mockPage,
};

// Props with single link
export const propsWithSingleLink: TextBannerProps = {
  fields: {
    heading: mockHeading,
    description: mockDescription,
    link: mockLink,
  },
  params: {},
  rendering: mockRendering,
  page: mockPage,
};

// Props without links
export const propsWithoutLinks: TextBannerProps = {
  fields: {
    heading: mockHeading,
    description: mockDescription,
  },
  params: {},
  rendering: mockRendering,
  page: mockPage,
};

// Props without description
export const propsWithoutDescription: TextBannerProps = {
  fields: {
    heading: mockHeading,
    link: mockLink,
  },
  params: {},
  rendering: mockRendering,
  page: mockPage,
};

// Props with theme variants
export const propsWithSecondaryTheme: TextBannerProps = {
  fields: {
    heading: mockHeading,
    description: mockDescription,
    link: mockLink,
  },
  params: {
    theme: 'secondary',
  },
  rendering: mockRendering,
  page: mockPage,
};

export const propsWithDarkTheme: TextBannerProps = {
  fields: {
    heading: mockHeading,
    description: mockDescription,
    link: mockLink,
  },
  params: {
    theme: 'dark',
  },
  rendering: mockRendering,
  page: mockPage,
};

export const propsWithLightTheme: TextBannerProps = {
  fields: {
    heading: mockHeading,
    description: mockDescription,
    link: mockLink,
  },
  params: {
    theme: 'light',
  },
  rendering: mockRendering,
  page: mockPage,
};

export const propsWithMutedTheme: TextBannerProps = {
  fields: {
    heading: mockHeading,
    description: mockDescription,
    link: mockLink,
  },
  params: {
    theme: 'muted',
  },
  rendering: mockRendering,
  page: mockPage,
};

export const propsWithAccentTheme: TextBannerProps = {
  fields: {
    heading: mockHeading,
    description: mockDescription,
    link: mockLink,
  },
  params: {
    theme: 'accent',
  },
  rendering: mockRendering,
  page: mockPage,
};

// Props with exclude top margin
export const propsWithExcludeTopMargin: TextBannerProps = {
  fields: {
    heading: mockHeading,
    description: mockDescription,
    link: mockLink,
  },
  params: {
    excludeTopMargin: '1',
  },
  rendering: mockRendering,
  page: mockPage,
};

// Props with custom styles
export const propsWithCustomStyles: TextBannerProps = {
  fields: {
    heading: mockHeading,
    description: mockDescription,
    link: mockLink,
  },
  params: {
    styles: 'custom-banner-styles',
  },
  rendering: mockRendering,
  page: mockPage,
};

// Props with empty heading
export const propsWithEmptyHeading: TextBannerProps = {
  fields: {
    heading: { value: '' },
    description: mockDescription,
    link: mockLink,
  },
  params: {},
  rendering: mockRendering,
  page: mockPage,
};

// Props without fields (null scenario)
export const propsWithoutFields: TextBannerProps = {
  fields: null as unknown as typeof defaultProps.fields,
  params: {},
  rendering: mockRendering,
  page: mockPage,
};

// Props with undefined fields
export const propsWithUndefinedFields: TextBannerProps = {
  fields: undefined as unknown as typeof defaultProps.fields,
  params: {},
  rendering: mockRendering,
  page: mockPage,
};

// Props for editing mode
export const propsInEditingMode: TextBannerProps = {
  fields: {
    heading: mockHeading,
    description: mockDescription,
    link: mockLink,
    link2: mockLink2,
  },
  params: {},
  isPageEditing: true,
  rendering: mockRendering,
  page: mockPageEditing,
};

