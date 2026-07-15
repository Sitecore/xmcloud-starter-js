/**
 * Test fixtures and mock data for Promo component
 */

interface PromoFields {
  PromoIcon: {
    value: {
      src: string;
      alt: string;
      width?: string;
      height?: string;
    };
  };
  PromoText: {
    value: string;
  };
  PromoLink: {
    value: {
      href: string;
      text: string;
      linktype?: string;
      url?: string;
      anchor?: string;
      target?: string;
    };
  };
  PromoText2: {
    value: string;
  };
  PromoText3: {
    value: string;
  };
}

type PromoProps = {
  params: { [key: string]: string };
  fields: PromoFields;
};

/**
 * Base mock data for Promo component
 */
export const mockPromoData = {
  defaultIcon: {
    value: {
      src: '/test-image.jpg',
      alt: 'Test Promo Image',
      width: '800',
      height: '600',
    },
  },
  defaultText: {
    value: '<h2>Featured Product</h2>',
  },
  defaultLink: {
    value: {
      href: '/products/featured',
      text: 'Learn More',
      linktype: 'internal',
    },
  },
  defaultText2: {
    value: '<p>Discover our amazing product features and benefits.</p>',
  },
  defaultText3: {
    value: '<div>New Arrival</div>',
  },
  emptyText: {
    value: '',
  },
};

/**
 * Default props for Promo component testing (Default variant)
 */
export const defaultPromoProps: PromoProps = {
  params: {
    RenderingIdentifier: 'promo-1',
    styles: 'custom-promo-style',
  },
  fields: {
    PromoIcon: mockPromoData.defaultIcon,
    PromoText: mockPromoData.defaultText,
    PromoLink: mockPromoData.defaultLink,
    PromoText2: mockPromoData.defaultText2,
    PromoText3: mockPromoData.defaultText3,
  },
};

/**
 * Props for CenteredCard variant
 */
export const centeredCardPromoProps: PromoProps = {
  params: {
    RenderingIdentifier: 'promo-centered',
    styles: 'centered-style',
  },
  fields: {
    PromoIcon: mockPromoData.defaultIcon,
    PromoText: {
      value: '<h2>Centered Promo Title</h2>',
    },
    PromoLink: mockPromoData.defaultLink,
    PromoText2: {
      value: '<p>Centered promotional content.</p>',
    },
    PromoText3: mockPromoData.defaultText3,
  },
};

/**
 * Props with minimal fields
 */
export const minimalPromoProps: PromoProps = {
  params: {
    styles: '',
  },
  fields: {
    PromoIcon: mockPromoData.defaultIcon,
    PromoText: mockPromoData.defaultText,
    PromoLink: mockPromoData.defaultLink,
    PromoText2: mockPromoData.emptyText,
    PromoText3: mockPromoData.emptyText,
  },
};

/**
 * Props with no fields (empty state)
 */
export const emptyPromoProps: PromoProps = {
  params: {
    styles: 'test-style',
  },
  fields: null as unknown as PromoFields,
};

/**
 * Props with empty text fields
 */
export const emptyTextFieldsProps: PromoProps = {
  params: {
    RenderingIdentifier: 'promo-empty',
    styles: '',
  },
  fields: {
    PromoIcon: mockPromoData.defaultIcon,
    PromoText: mockPromoData.emptyText,
    PromoLink: mockPromoData.defaultLink,
    PromoText2: mockPromoData.emptyText,
    PromoText3: mockPromoData.emptyText,
  },
};
