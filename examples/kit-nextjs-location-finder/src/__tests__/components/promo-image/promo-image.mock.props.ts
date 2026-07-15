import type { PromoImageProps } from '@/components/promo-image/promo-image.props';
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

export const mockPromoImageProps: PromoImageProps = {
  rendering: {
    componentName: 'PromoImage',
    dataSource: 'mock-datasource',
  },
  params: {
    colorScheme: 'primary',
  },
  fields: {
    image: {
      value: {
        src: '/images/alaris-ambulance-action.jpg',
        alt: 'Alaris Ambulance in Emergency Response',
        width: '1920',
        height: '1080',
      },
    },
    heading: {
      value: 'Save Lives with Advanced Emergency Vehicles',
    },
    description: {
      value:
        '<p>Our fleet of Type I and Type III ambulances are equipped with state-of-the-art life support systems, ensuring the highest level of patient care during transport.</p>',
    },
    link: {
      value: {
        href: '/vehicles/ambulances',
        text: 'Explore Ambulance Fleet',
        linktype: 'internal',
        target: '',
      },
    },
  },
  page: mockPageBase,
  isPageEditing: false,
};

export const mockPromoImagePropsFireTruck: PromoImageProps = {
  rendering: {
    componentName: 'PromoImage',
    dataSource: 'mock-datasource',
  },
  params: {
    colorScheme: 'secondary',
  },
  fields: {
    image: {
      value: {
        src: '/images/alaris-fire-truck-action.jpg',
        alt: 'Alaris Fire Truck Fighting Fire',
        width: '1920',
        height: '1080',
      },
    },
    heading: {
      value: 'Professional Fire Suppression Systems',
    },
    description: {
      value:
        '<p>High-capacity pumps and advanced foam systems designed for rapid fire suppression in critical situations.</p>',
    },
    link: {
      value: {
        href: '/vehicles/fire-trucks',
        text: 'View Fire Equipment',
        linktype: 'internal',
        target: '',
      },
    },
  },
  page: mockPageBase,
  isPageEditing: false,
};

export const mockPromoImagePropsNoLink: PromoImageProps = {
  rendering: {
    componentName: 'PromoImage',
    dataSource: 'mock-datasource',
  },
  params: {},
  fields: {
    image: {
      value: {
        src: '/images/alaris-rescue-team.jpg',
        alt: 'Alaris Rescue Team Training',
        width: '1920',
        height: '1080',
      },
    },
    heading: {
      value: 'Professional Training Programs',
    },
    description: {
      value: '<p>Comprehensive training for emergency vehicle operation and maintenance.</p>',
    },
    link: {
      value: {
        href: '',
        text: '',
        linktype: 'internal',
        target: '',
      },
    },
  },
  page: mockPageBase,
  isPageEditing: false,
};
