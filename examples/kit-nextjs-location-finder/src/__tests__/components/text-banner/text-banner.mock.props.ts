import { TextBannerProps } from '@/components/text-banner/text-banner.props';
import { Page } from '@sitecore-content-sdk/nextjs';

// Mock page object with all required Page properties
const mockPageBase = {
  mode: {
    isEditing: false,
    isPreview: false,
    isNormal: true,
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

const mockPageEditing = {
  mode: {
    isEditing: true,
    isPreview: false,
    isNormal: false,
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

export const mockTextBannerProps: TextBannerProps = {
  rendering: {
    componentName: 'TextBanner',
    dataSource: 'mock-datasource',
  },
  params: {
    styles: 'custom-style',
  },
  fields: {
    heading: {
      value: 'Advanced Emergency Response Vehicles',
    },
    description: {
      value:
        'Alaris manufactures cutting-edge ambulances, fire trucks, and mobile command centers designed to meet the critical needs of first responders nationwide.',
    },
  },
  page: mockPageBase,
  isPageEditing: false,
};

export const mockTextBannerPropsWithoutDescription: TextBannerProps = {
  rendering: {
    componentName: 'TextBanner',
    dataSource: 'mock-datasource',
  },
  params: {},
  fields: {
    heading: {
      value: 'Reliable Fleet Solutions',
    },
  },
  page: mockPageBase,
  isPageEditing: false,
};

export const mockTextBannerPropsEditing: TextBannerProps = {
  rendering: {
    componentName: 'TextBanner',
    dataSource: 'mock-datasource',
  },
  params: {
    styles: 'position-center',
  },
  fields: {
    heading: {
      value: 'Type I Ambulance Specifications',
    },
    description: {
      value:
        'Our Type I ambulances feature advanced life support systems, spacious patient compartments, and state-of-the-art medical equipment storage.',
    },
  },
  page: mockPageEditing,
  isPageEditing: true,
};

export const mockTextBannerPropsBlueTheme: TextBannerProps = {
  rendering: {
    componentName: 'TextBanner',
    dataSource: 'mock-datasource',
  },
  params: {},
  fields: {
    heading: {
      value: 'Fire & Rescue Excellence',
    },
    description: {
      value:
        'Built for the most demanding emergency scenarios with rugged construction and innovative safety features.',
    },
  },
  page: mockPageBase,
  isPageEditing: false,
};
