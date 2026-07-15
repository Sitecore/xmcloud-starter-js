// Mock props for PromoAnimated component tests
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { PromoAnimatedProps } from '../../components/promo-animated/promo-animated.props';
import { ColorSchemeLimited as ColorScheme } from '../../enumerations/ColorSchemeLimited.enum';
import { mockPage, mockPageEditing } from '../test-utils/mockPage';

// Inline utility functions
const createMockField = <T>(value: T): Field<T> => ({ value }) as unknown as Field<T>;
const createMockLinkField = (href: string, text: string): LinkField =>
  ({
    value: { href, text },
  }) as unknown as LinkField;
const createMockImageField = (src: string, alt: string): ImageField =>
  ({
    value: { src, alt, width: 452, height: 452 },
  }) as unknown as ImageField;

// Mock useSitecore contexts
export const mockUseSitecoreNormal = {
  page: { mode: { isEditing: false } },
} as unknown;

export const mockUseSitecoreEditing = {
  page: { mode: { isEditing: true } },
} as unknown;

// Default props with full content
export const defaultPromoAnimatedProps: PromoAnimatedProps = {
  rendering: {
    uid: 'promo-animated-default',
    componentName: 'PromoAnimated',
  },
  params: {
    colorScheme: ColorScheme.PRIMARY,
  },
  page: mockPage,
  fields: {
    image: createMockImageField('/images/promo-hero.jpg', 'Promotional Hero Image'),
    title: createMockField('Revolutionary Audio Experience'),
    description: createMockField(
      'Discover our latest collection of premium audio devices designed to elevate your listening experience to new heights.'
    ),
    primaryLink: createMockLinkField('/products/featured', 'Shop Now'),
    secondaryLink: createMockLinkField('/about', 'Learn More'),
  },
  isPageEditing: false,
};

// Props with minimal content
export const promoAnimatedPropsMinimal: PromoAnimatedProps = {
  rendering: {
    uid: 'promo-animated-minimal',
    componentName: 'PromoAnimated',
  },
  params: {
    colorScheme: ColorScheme.SECONDARY,
  },
  page: mockPage,
  fields: {
    image: createMockImageField('/images/simple-promo.jpg', 'Simple Promo'),
    title: createMockField('Simple Title'),
  },
  isPageEditing: false,
};

// Props without image
export const promoAnimatedPropsNoImage: PromoAnimatedProps = {
  rendering: {
    uid: 'promo-animated-no-image',
    componentName: 'PromoAnimated',
  },
  params: {
    colorScheme: ColorScheme.PRIMARY,
  },
  page: mockPage,
  fields: {
    image: createMockImageField('', ''),
    title: createMockField('Text Only Promo'),
    description: createMockField('This promo has no image component.'),
    primaryLink: createMockLinkField('/products', 'View Products'),
  },
  isPageEditing: false,
};

// Props without links
export const promoAnimatedPropsNoLinks: PromoAnimatedProps = {
  rendering: {
    uid: 'promo-animated-no-links',
    componentName: 'PromoAnimated',
  },
  params: {
    colorScheme: ColorScheme.SECONDARY,
  },
  page: mockPage,
  fields: {
    image: createMockImageField('/images/info-promo.jpg', 'Info Promo'),
    title: createMockField('Information Only'),
    description: createMockField('This promo provides information without action links.'),
  },
  isPageEditing: false,
};

// Props with only primary link
export const promoAnimatedPropsPrimaryOnly: PromoAnimatedProps = {
  rendering: {
    uid: 'promo-animated-primary-only',
    componentName: 'PromoAnimated',
  },
  params: {
    colorScheme: ColorScheme.PRIMARY,
  },
  page: mockPage,
  fields: {
    image: createMockImageField('/images/single-action.jpg', 'Single Action'),
    title: createMockField('Single Action Promo'),
    description: createMockField('This promo has only one call-to-action button.'),
    primaryLink: createMockLinkField('/shop', 'Start Shopping'),
  },
  isPageEditing: false,
};

// Props with only secondary link
export const promoAnimatedPropsSecondaryOnly: PromoAnimatedProps = {
  rendering: {
    uid: 'promo-animated-secondary-only',
    componentName: 'PromoAnimated',
  },
  params: {
    colorScheme: ColorScheme.SECONDARY,
  },
  page: mockPage,
  fields: {
    image: createMockImageField('/images/learn-more.jpg', 'Learn More'),
    title: createMockField('Educational Content'),
    description: createMockField('Explore our educational resources and guides.'),
    secondaryLink: createMockLinkField('/resources', 'Explore Resources'),
  },
  isPageEditing: false,
};

// Props in editing mode
export const promoAnimatedPropsEditing: PromoAnimatedProps = {
  ...defaultPromoAnimatedProps,
  page: mockPageEditing,
  isPageEditing: true,
};

// Props with empty links (editing mode should show them)
export const promoAnimatedPropsEmptyLinksEditing: PromoAnimatedProps = {
  rendering: {
    uid: 'promo-animated-empty-links',
    componentName: 'PromoAnimated',
  },
  params: {
    colorScheme: ColorScheme.PRIMARY,
  },
  page: mockPageEditing,
  fields: {
    image: createMockImageField('/images/editing-mode.jpg', 'Editing Mode'),
    title: createMockField('Editing Mode Title'),
    description: createMockField('This content shows empty links in editing mode.'),
    primaryLink: createMockLinkField('', ''),
    secondaryLink: createMockLinkField('', ''),
  },
  isPageEditing: true,
};

// Props with different color schemes
export const promoAnimatedPropsBlue: PromoAnimatedProps = {
  ...defaultPromoAnimatedProps,
  params: {
    colorScheme: ColorScheme.SECONDARY,
  },
};

export const promoAnimatedPropsGreen: PromoAnimatedProps = {
  ...defaultPromoAnimatedProps,
  params: {
    colorScheme: ColorScheme.PRIMARY,
  },
};

export const promoAnimatedPropsOrange: PromoAnimatedProps = {
  ...defaultPromoAnimatedProps,
  params: {
    colorScheme: ColorScheme.SECONDARY,
  },
};

// Props without fields
export const promoAnimatedPropsNoFields: PromoAnimatedProps = {
  rendering: {
    uid: 'promo-animated-no-fields',
    componentName: 'PromoAnimated',
  },
  params: {},
  page: mockPage,
  fields: undefined as any,
  isPageEditing: false,
};

// Props with empty fields
export const promoAnimatedPropsEmptyFields: PromoAnimatedProps = {
  rendering: {
    uid: 'promo-animated-empty-fields',
    componentName: 'PromoAnimated',
  },
  params: {
    colorScheme: ColorScheme.PRIMARY,
  },
  page: mockPage,
  fields: {
    image: createMockImageField('', ''),
    title: createMockField(''),
    description: createMockField(''),
  },
  isPageEditing: false,
};

// Props without color scheme (should use default)
export const promoAnimatedPropsNoColorScheme: PromoAnimatedProps = {
  rendering: {
    uid: 'promo-animated-no-color-scheme',
    componentName: 'PromoAnimated',
  },
  params: {},
  page: mockPage,
  fields: {
    image: createMockImageField('/images/default-scheme.jpg', 'Default Scheme'),
    title: createMockField('Default Color Scheme'),
    description: createMockField('This uses the default color scheme.'),
    primaryLink: createMockLinkField('/default', 'Default Action'),
  },
  isPageEditing: false,
};
