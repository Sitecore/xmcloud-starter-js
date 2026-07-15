import type { PromoAnimatedProps } from '@/components/promo-animated/promo-animated.props';
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

export const mockPromoAnimatedProps: PromoAnimatedProps = {
  rendering: {
    componentName: 'PromoAnimated',
    dataSource: 'mock-datasource',
  },
  params: {
    colorScheme: 'primary',
  },
  fields: {
    image: {
      value: {
        src: '/images/alaris-ambulance-hero.jpg',
        alt: 'Alaris Advanced Life Support Ambulance',
        width: '800',
        height: '800',
      },
    },
    title: {
      value: 'Next-Generation Emergency Response',
    },
    description: {
      value:
        '<p>Experience the future of emergency medical services with our advanced Type I and Type III ambulances. Built with cutting-edge technology and uncompromising safety standards.</p>',
    },
    primaryLink: {
      value: {
        href: '/vehicles/ambulances',
        text: 'View Ambulances',
        linktype: 'internal',
        target: '',
      },
    },
    secondaryLink: {
      value: {
        href: '/contact/demo',
        text: 'Schedule Demo',
        linktype: 'internal',
        target: '',
      },
    },
  },
  page: mockPageBase,
  isPageEditing: false,
};

export const mockPromoAnimatedPropsFireTruck: PromoAnimatedProps = {
  rendering: {
    componentName: 'PromoAnimated',
    dataSource: 'mock-datasource',
  },
  params: {
    colorScheme: 'secondary',
  },
  fields: {
    image: {
      value: {
        src: '/images/alaris-fire-truck-hero.jpg',
        alt: 'Alaris Fire Truck with High-Pressure System',
        width: '800',
        height: '800',
      },
    },
    title: {
      value: 'Professional Fire & Rescue Equipment',
    },
    description: {
      value:
        '<p>Engineered for the most demanding firefighting operations. Our fire trucks feature 1500 GPM pumps, 750-gallon tanks, and advanced foam suppression systems.</p>',
    },
    primaryLink: {
      value: {
        href: '/vehicles/fire-trucks',
        text: 'Explore Fire Trucks',
        linktype: 'internal',
        target: '',
      },
    },
    secondaryLink: {
      value: {
        href: '/resources/specs',
        text: 'Download Specs',
        linktype: 'internal',
        target: '',
      },
    },
  },
  page: mockPageBase,
  isPageEditing: false,
};

export const mockPromoAnimatedPropsNoLinks: PromoAnimatedProps = {
  rendering: {
    componentName: 'PromoAnimated',
    dataSource: 'mock-datasource',
  },
  params: {},
  fields: {
    image: {
      value: {
        src: '/images/alaris-command-unit.jpg',
        alt: 'Alaris Mobile Command Unit',
        width: '800',
        height: '800',
      },
    },
    title: {
      value: 'Mobile Command Centers',
    },
    description: {
      value: '<p>Strategic coordination vehicles for large-scale emergency operations.</p>',
    },
  },
  page: mockPageBase,
  isPageEditing: false,
};
