import { TextBannerProps } from '../../components/text-banner/text-banner.props';
import { Field } from '@sitecore-content-sdk/nextjs';
import { mockPage, mockPageEditing } from '../test-utils/mockPage';

const createMockField = <T>(value: T): Field<T> => ({ value }) as unknown as Field<T>;

export const defaultTextBannerProps: TextBannerProps = {
  rendering: { componentName: 'TextBanner' },
  params: {
    styles: 'position-left custom-text-banner-styles',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme: 'primary' as any,
  },
  fields: {
    heading: createMockField('Transform Your Audio Experience'),
    description: createMockField(
      "Discover the pinnacle of sound engineering with SYNC Audio's premium collection of professional headphones, studio monitors, and acoustic equipment designed for discerning audiophiles."
    ),
  },
  isPageEditing: false,
  page: mockPage,
};

export const textBannerPropsMinimal: TextBannerProps = {
  rendering: { componentName: 'TextBanner' },
  params: {},
  fields: {
    heading: createMockField('Professional Audio Equipment'),
  },
  isPageEditing: false,
  page: mockPage,
};

export const textBannerPropsNoDescription: TextBannerProps = {
  ...defaultTextBannerProps,
  fields: {
    heading: createMockField('Quality Sound Solutions'),
    description: undefined,
  },
};

export const textBannerPropsPositionCenter: TextBannerProps = {
  ...defaultTextBannerProps,
  params: {
    styles: 'position-center premium-styling bg-dark',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme: 'secondary' as any,
  },
};

export const textBannerPropsPositionRight: TextBannerProps = {
  ...defaultTextBannerProps,
  params: {
    styles: 'position-right text-light custom-theme',
  },
};

export const textBannerPropsLongContent: TextBannerProps = {
  ...defaultTextBannerProps,
  fields: {
    heading: createMockField(
      'SYNC Audio - Revolutionizing Professional Sound Engineering and Audio Production Through Innovative Technology, Precision Craftsmanship, and Uncompromising Quality Standards That Set New Benchmarks in the Industry'
    ),
    description: createMockField(
      "Experience the ultimate in professional audio excellence with SYNC Audio's comprehensive ecosystem of premium sound equipment. Our meticulously engineered headphones, studio monitors, and acoustic solutions are crafted for professional musicians, sound engineers, music producers, and audiophiles who demand nothing less than perfection. From intimate studio sessions to large-scale concert productions, SYNC Audio delivers the clarity, precision, and reliability that industry professionals trust. Our commitment to innovation drives us to continuously push the boundaries of acoustic technology, ensuring that every product meets the exacting standards required for professional audio work. Discover how SYNC Audio is transforming the landscape of sound reproduction and helping artists achieve their creative vision with unprecedented fidelity and detail."
    ),
  },
};

export const textBannerPropsSpecialChars: TextBannerProps = {
  ...defaultTextBannerProps,
  fields: {
    heading: createMockField('SYNC™ Àudio - Équipement Professionnel & Spëcialisé'),
    description: createMockField(
      "Découvrez l'excellence acoustique avec SYNC™ Audio. Nos équipements de haute qualité offrent une précision inégalée pour les professionnels de l'audio & les audiophiles exigeants."
    ),
  },
};

export const textBannerPropsEmptyFields: TextBannerProps = {
  ...defaultTextBannerProps,
  fields: {
    heading: createMockField(''),
    description: createMockField(''),
  },
};

export const textBannerPropsNoFields: TextBannerProps = {
  rendering: { componentName: 'TextBanner' },
  params: {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: null as any,
  isPageEditing: false,
  page: mockPage,
};

export const textBannerPropsUndefinedHeading: TextBannerProps = {
  ...defaultTextBannerProps,
  fields: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    heading: undefined as any,
    description: createMockField('Description without heading'),
  },
};

export const textBannerPropsEditing: TextBannerProps = {
  ...defaultTextBannerProps,
  isPageEditing: true,
  page: mockPageEditing,
};

export const textBannerPropsNoStyles: TextBannerProps = {
  ...defaultTextBannerProps,
  params: {},
};

export const textBannerPropsCustomTheme: TextBannerProps = {
  ...defaultTextBannerProps,
  params: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme: 'secondary' as any,
    styles: 'theme-secondary position-center',
  },
};

export const textBannerPropsMultipleStyles: TextBannerProps = {
  ...defaultTextBannerProps,
  params: {
    styles: 'position-left bg-primary text-white border-accent custom-padding responsive-layout',
  },
};

export const textBannerPropsNoParams: TextBannerProps = {
  ...defaultTextBannerProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: undefined as any,
};

export const textBannerPropsReducedMotion: TextBannerProps = {
  ...defaultTextBannerProps,
  fields: {
    heading: createMockField('Accessible Audio Solutions'),
    description: createMockField('Experience premium sound with accessibility in mind.'),
  },
};

// Mock useSitecore contexts for testing
export const mockUseSitecoreNormal = {
  page: { mode: { isEditing: false } },
} as unknown;

export const mockUseSitecoreEditing = {
  page: { mode: { isEditing: true } },
} as unknown;
