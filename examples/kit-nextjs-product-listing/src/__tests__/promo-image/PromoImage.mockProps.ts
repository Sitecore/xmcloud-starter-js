// Mock props for PromoImage component tests
import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { PromoImageProps } from '../../components/promo-image/promo-image.props';
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
    value: { src, alt, width: 1200, height: 800 },
  }) as unknown as ImageField;

// Default props with full content
export const defaultPromoImageProps: PromoImageProps = {
  params: {
    colorScheme: ColorScheme.PRIMARY,
  },
  page: mockPage,
  fields: {
    image: createMockImageField('/images/promo-hero-bg.jpg', 'Promo Background Image'),
    heading: createMockField('Experience Premium Audio'),
    description: createMockField(
      '<p>Discover our range of high-quality audio equipment designed for professionals and audiophiles alike. Every detail matters.</p>'
    ),
    link: createMockLinkField('/products/premium', 'Explore Collection'),
  },
  rendering: {
    uid: 'test-promo-image-uid',
    componentName: 'PromoImage',
    dataSource: '',
  },
  isPageEditing: false,
};

// Props with minimal content
export const promoImagePropsMinimal: PromoImageProps = {
  params: {
    colorScheme: ColorScheme.SECONDARY,
  },
  page: mockPage,
  fields: {
    image: createMockImageField('/images/simple-bg.jpg', 'Simple Background'),
    heading: createMockField('Simple Heading'),
    link: createMockLinkField('/simple', 'Learn More'),
  },
  rendering: {
    uid: 'test-promo-minimal-uid',
    componentName: 'PromoImage',
    dataSource: '',
  },
  isPageEditing: false,
};

// Props without image
export const promoImagePropsNoImage: PromoImageProps = {
  params: {
    colorScheme: ColorScheme.PRIMARY,
  },
  page: mockPage,
  fields: {
    image: createMockImageField('', ''),
    heading: createMockField('Text Only Promo'),
    description: createMockField('<p>This promo has no background image.</p>'),
    link: createMockLinkField('/text-only', 'View Details'),
  },
  rendering: {
    uid: 'test-promo-no-image-uid',
    componentName: 'PromoImage',
    dataSource: '',
  },
  isPageEditing: false,
};

// Props without heading
export const promoImagePropsNoHeading: PromoImageProps = {
  params: {
    colorScheme: ColorScheme.SECONDARY,
  },
  page: mockPage,
  fields: {
    image: createMockImageField('/images/no-heading.jpg', 'Image Only'),
    heading: createMockField(''),
    description: createMockField('<p>This promo has description and link but no heading.</p>'),
    link: createMockLinkField('/no-heading', 'Continue'),
  },
  rendering: {
    uid: 'test-promo-no-heading-uid',
    componentName: 'PromoImage',
    dataSource: '',
  },
  isPageEditing: false,
};

// Props without description
export const promoImagePropsNoDescription: PromoImageProps = {
  params: {
    colorScheme: ColorScheme.PRIMARY,
  },
  page: mockPage,
  fields: {
    image: createMockImageField('/images/no-desc.jpg', 'No Description'),
    heading: createMockField('Heading Only'),
    link: createMockLinkField('/no-desc', 'Take Action'),
  },
  rendering: {
    uid: 'test-promo-no-desc-uid',
    componentName: 'PromoImage',
    dataSource: '',
  },
  isPageEditing: false,
};

// Props without link
export const promoImagePropsNoLink: PromoImageProps = {
  params: {
    colorScheme: ColorScheme.SECONDARY,
  },
  page: mockPage,
  fields: {
    image: createMockImageField('/images/info-only.jpg', 'Information Only'),
    heading: createMockField('Information Display'),
    description: createMockField('<p>This promo provides information without any action link.</p>'),
    link: createMockLinkField('', ''),
  },
  rendering: {
    uid: 'test-promo-no-link-uid',
    componentName: 'PromoImage',
    dataSource: '',
  },
  isPageEditing: false,
};

// Props with empty link in editing mode
export const promoImagePropsEmptyLinkEditing: PromoImageProps = {
  params: {
    colorScheme: ColorScheme.PRIMARY,
  },
  page: mockPageEditing,
  fields: {
    image: createMockImageField('/images/editing.jpg', 'Editing Mode'),
    heading: createMockField('Editing Mode Title'),
    description: createMockField('<p>This shows empty link in editing mode.</p>'),
    link: createMockLinkField('', ''),
  },
  rendering: {
    uid: 'test-promo-editing-uid',
    componentName: 'PromoImage',
    dataSource: '',
  },
  isPageEditing: true,
};

// Props with different color schemes
export const promoImagePropsBlue: PromoImageProps = {
  ...defaultPromoImageProps,
  params: {
    colorScheme: ColorScheme.SECONDARY,
  },
};

export const promoImagePropsGreen: PromoImageProps = {
  ...defaultPromoImageProps,
  params: {
    colorScheme: ColorScheme.PRIMARY,
  },
};

export const promoImagePropsOrange: PromoImageProps = {
  ...defaultPromoImageProps,
  params: {
    colorScheme: ColorScheme.SECONDARY,
  },
};

// Props without color scheme (should use default)
export const promoImagePropsNoColorScheme: PromoImageProps = {
  params: {},
  page: mockPage,
  fields: {
    image: createMockImageField('/images/default-color.jpg', 'Default Color'),
    heading: createMockField('Default Color Scheme'),
    description: createMockField('<p>This uses the default color scheme.</p>'),
    link: createMockLinkField('/default-color', 'Default Action'),
  },
  rendering: {
    uid: 'test-promo-no-color-uid',
    componentName: 'PromoImage',
    dataSource: '',
  },
  isPageEditing: false,
};

// Props without fields
export const promoImagePropsNoFields: PromoImageProps = {
  params: {},
  page: mockPage,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: undefined as any,
  rendering: {
    uid: 'test-promo-no-fields-uid',
    componentName: 'PromoImage',
    dataSource: '',
  },
  isPageEditing: false,
};

// Props with empty fields
export const promoImagePropsEmptyFields: PromoImageProps = {
  params: {
    colorScheme: ColorScheme.PRIMARY,
  },
  page: mockPage,
  fields: {
    image: createMockImageField('', ''),
    heading: createMockField(''),
    description: createMockField(''),
    link: createMockLinkField('', ''),
  },
  rendering: {
    uid: 'test-promo-empty-fields-uid',
    componentName: 'PromoImage',
    dataSource: '',
  },
  isPageEditing: false,
};

// Props in editing mode
export const promoImagePropsEditing: PromoImageProps = {
  ...defaultPromoImageProps,
  page: mockPageEditing,
  isPageEditing: true,
};

// Props with rich text description
export const promoImagePropsRichText: PromoImageProps = {
  ...defaultPromoImageProps,
  fields: {
    ...defaultPromoImageProps.fields,
    description: createMockField(
      '<h3>Advanced Audio Technology</h3><p>Experience <strong>crystal-clear sound</strong> with our latest innovations.</p><ul><li>High-fidelity drivers</li><li>Noise cancellation</li><li>Wireless connectivity</li></ul>'
    ),
  },
};

// Props with long content
export const promoImagePropsLongContent: PromoImageProps = {
  ...defaultPromoImageProps,
  fields: {
    image: createMockImageField('/images/long-content.jpg', 'Long Content Background'),
    heading: createMockField(
      'Revolutionary Audio Experience for Modern Professionals and Audiophiles'
    ),
    description: createMockField(
      "<p>Our comprehensive audio solutions are engineered for professionals who demand exceptional sound quality and reliability. Whether you're producing music in a studio, enjoying content at home, or collaborating in professional environments, our products deliver superior performance that exceeds industry standards.</p><p>With years of research and development, we've created a product lineup that combines cutting-edge technology with elegant design and user-friendly interfaces.</p>"
    ),
    link: createMockLinkField('/professional-audio', 'Explore Professional Solutions'),
  },
};
