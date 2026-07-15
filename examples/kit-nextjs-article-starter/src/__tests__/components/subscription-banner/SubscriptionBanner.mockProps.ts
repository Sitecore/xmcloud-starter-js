import { Field, LinkField, Page, PageMode, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { SubscriptionBannerProps } from '@/components/subscription-banner/subscription-banner.props';

// Mock fields
export const mockTitleRequired: Field<string> = {
  value: 'Subscribe to Our Newsletter',
};

export const mockDescriptionOptional: Field<string> = {
  value: 'Get the latest updates delivered directly to your inbox',
};

export const mockButtonLink: LinkField = {
  value: {
    href: '/subscribe',
    text: 'Subscribe Now',
    linktype: 'internal',
    url: '/subscribe',
  },
};

export const mockEmailPlaceholder: Field<string> = {
  value: 'Enter your email address',
};

export const mockEmailErrorMessage: Field<string> = {
  value: 'Please enter a valid email address',
};

export const mockThankYouMessage: Field<string> = {
  value: 'Thank you for subscribing!',
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

// Mock rendering
const mockRendering: ComponentRendering = {
  componentName: 'SubscriptionBanner',
};

// Default props with all fields
export const defaultProps: SubscriptionBannerProps = {
  fields: {
    titleRequired: mockTitleRequired,
    descriptionOptional: mockDescriptionOptional,
    buttonLink: mockButtonLink,
    emailPlaceholder: mockEmailPlaceholder,
    emailErrorMessage: mockEmailErrorMessage,
    thankYouMessage: mockThankYouMessage,
  },
  params: {},
  rendering: mockRendering,
  page: mockPage,
};

// Props without optional description
export const propsWithoutDescription: SubscriptionBannerProps = {
  fields: {
    titleRequired: mockTitleRequired,
    buttonLink: mockButtonLink,
    emailPlaceholder: mockEmailPlaceholder,
    emailErrorMessage: mockEmailErrorMessage,
    thankYouMessage: mockThankYouMessage,
  },
  params: {},
  rendering: mockRendering,
  page: mockPage,
};

// Props with only required fields
export const propsMinimal: SubscriptionBannerProps = {
  fields: {
    titleRequired: mockTitleRequired,
    buttonLink: mockButtonLink,
  },
  params: {},
  rendering: mockRendering,
  page: mockPage,
};

// Props with empty title
export const propsWithEmptyTitle: SubscriptionBannerProps = {
  fields: {
    titleRequired: { value: '' },
    descriptionOptional: mockDescriptionOptional,
    buttonLink: mockButtonLink,
  },
  params: {},
  rendering: mockRendering,
  page: mockPage,
};

// Props without fields (null scenario)
export const propsWithoutFields: SubscriptionBannerProps = {
  fields: null as unknown as SubscriptionBannerProps['fields'],
  params: {},
  rendering: mockRendering,
  page: mockPage,
};

// Props with undefined fields
export const propsWithUndefinedFields: SubscriptionBannerProps = {
  fields: undefined as unknown as SubscriptionBannerProps['fields'],
  params: {},
  rendering: mockRendering,
  page: mockPage,
};

