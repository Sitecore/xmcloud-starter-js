import { Field, LinkField, ImageField, Page } from '@sitecore-content-sdk/nextjs';

/**
 * Mock page object for normal mode
 */
const mockPageNormal = {
  mode: {
    isEditing: false,
    isNormal: true,
    isPreview: false,
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

export const defaultCallToActionProps = {
  rendering: {
    componentName: 'CallToAction',
    params: {},
  },
  params: {
    styles: '',
  },
  fields: {
    CTATitle: {
      value: 'Transform Your Business Today',
    } as Field<string>,
    CTABody: {
      value:
        '<p>Join thousands of companies that trust our platform for their digital transformation journey.</p>',
    } as Field<string>,
    CTALink1: {
      value: {
        href: '/get-started',
        text: 'Get Started',
        title: 'Get Started',
      },
    } as LinkField,
    CTALink2: {
      value: {
        href: '/learn-more',
        text: 'Learn More',
        title: 'Learn More',
      },
    } as LinkField,
    CTAImage: {
      value: {
        src: '/images/cta-background.jpg',
        alt: 'CTA Background',
        width: 1920,
        height: 1080,
      },
    } as ImageField,
  },
  page: mockPageNormal,
};

export const ctaPropsWithStyles = {
  ...defaultCallToActionProps,
  params: {
    styles: 'custom-cta-class',
  },
  page: mockPageNormal,
};

export const ctaPropsNoLinks = {
  rendering: {
    componentName: 'CallToAction',
    params: {},
  },
  params: {
    styles: '',
  },
  fields: {
    CTATitle: {
      value: 'Special Offer',
    } as Field<string>,
    CTABody: {
      value: '<p>Limited time offer available now</p>',
    } as Field<string>,
    CTALink1: {
      value: {
        href: '',
        text: '',
        title: '',
      },
    } as LinkField,
    CTALink2: {
      value: {
        href: '',
        text: '',
        title: '',
      },
    } as LinkField,
    CTAImage: {
      value: {
        src: '/images/offer.jpg',
        alt: 'Special Offer',
        width: 1920,
        height: 1080,
      },
    } as ImageField,
  },
  page: mockPageNormal,
};

export const ctaPropsOnlyOneLink = {
  rendering: {
    componentName: 'CallToAction',
    params: {},
  },
  params: {
    styles: '',
  },
  fields: {
    CTATitle: {
      value: 'Join Us',
    } as Field<string>,
    CTABody: {
      value: '<p>Be part of our community</p>',
    } as Field<string>,
    CTALink1: {
      value: {
        href: '/signup',
        text: 'Sign Up',
        title: 'Sign Up',
      },
    } as LinkField,
    CTALink2: {
      value: {
        href: '',
        text: '',
        title: '',
      },
    } as LinkField,
    CTAImage: {
      value: {
        src: '/images/community.jpg',
        alt: 'Community',
        width: 1920,
        height: 1080,
      },
    } as ImageField,
  },
  page: mockPageNormal,
};
