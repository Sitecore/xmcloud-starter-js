// Mock data for Promo component testing

import { mockPage } from '../../mocks/mockPage';

// Mock props with all fields for Default variant
export const mockPromoPropsDefault = {
  rendering: {
    componentName: 'Promo',
    dataSource: '',
    uid: 'promo-default-uid',
  },
  params: {
    styles: 'promo-styles',
    RenderingIdentifier: 'promo-test-id',
  },
  fields: {
    PromoIcon: {
      value: {
        src: '/promo-icon.png',
        alt: 'Promo Icon',
        width: 100,
        height: 100,
      },
    },
    PromoText: {
      value: '<p>This is promotional text with <strong>emphasis</strong>.</p>',
    },
    PromoLink: {
      value: {
        href: '/promo-link',
        text: 'Learn More',
      },
    },
    PromoText2: {
      value: '<p>Secondary promo text.</p>',
    },
  },
  page: mockPage,
};

// Mock props with all fields for WithText variant
export const mockPromoPropsWithText = {
  rendering: {
    componentName: 'Promo',
    dataSource: '',
    uid: 'promo-withtext-uid',
  },
  params: {
    styles: 'promo-withtext-styles',
    RenderingIdentifier: 'promo-withtext-id',
  },
  fields: {
    PromoIcon: {
      value: {
        src: '/promo-icon-2.png',
        alt: 'Promo Icon 2',
        width: 100,
        height: 100,
      },
    },
    PromoText: {
      value: '<p>First promotional text.</p>',
    },
    PromoLink: {
      value: {
        href: '/link',
        text: 'Click Here',
      },
    },
    PromoText2: {
      value: '<p>Second promotional text for WithText variant.</p>',
    },
  },
  page: mockPage,
};

// Mock props with minimal fields
export const mockPromoPropsMinimal = {
  rendering: {
    componentName: 'Promo',
    dataSource: '',
    uid: 'promo-minimal-uid',
  },
  params: {
    styles: 'minimal-styles',
    RenderingIdentifier: 'promo-minimal-id',
  },
  fields: {
    PromoIcon: {
      value: {
        src: '/minimal-icon.png',
        alt: 'Minimal Icon',
        width: 50,
        height: 50,
      },
    },
    PromoText: {
      value: '<p>Minimal text.</p>',
    },
    PromoLink: {
      value: {},
    },
    PromoText2: {
      value: '',
    },
  },
  page: mockPage,
};

// Mock props with no fields (should show empty hint)
export const mockPromoPropsNoFields = {
  rendering: {
    componentName: 'Promo',
    dataSource: '',
    uid: 'promo-no-fields-uid',
  },
  params: {
    styles: 'no-fields-styles',
    RenderingIdentifier: 'promo-no-fields-id',
  },
  fields: null as unknown as typeof mockPromoPropsDefault.fields,
  page: mockPage,
};

