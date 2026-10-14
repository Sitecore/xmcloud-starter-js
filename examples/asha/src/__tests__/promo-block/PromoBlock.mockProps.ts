// Mock props for PromoBlock component tests
import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { PromoBlockProps } from '../../components/promo-block/promo-block.props';
import { Orientation } from '../../enumerations/Orientation.enum';
import { Variation } from '../../enumerations/Variation.enum';
import { mockPage } from '../test-utils/mockPage';

// Inline utility functions
const createMockField = <T>(value: T): Field<T> => ({ value }) as unknown as Field<T>;
const createMockLinkField = (href: string, text: string): LinkField =>
  ({
    value: { href, text },
  }) as unknown as LinkField;
const createMockImageField = (src: string, alt: string): ImageField =>
  ({
    value: { src, alt, width: 600, height: 400 },
  }) as unknown as ImageField;

// Default props with complete content
export const defaultPromoBlockProps: PromoBlockProps = {
  rendering: { componentName: 'PromoBlock', params: {} },
  params: {
    orientation: Orientation.IMAGE_LEFT,
    variation: Variation.DEFAULT,
  },
  page: mockPage,
  fields: {
    heading: createMockField('Premium Audio Experience'),
    description: createMockField(
      '<p>Discover our revolutionary audio technology that transforms how you experience sound. From crystal-clear highs to deep, rich bass tones.</p>'
    ),
    image: createMockImageField('/images/promo-block-hero.jpg', 'Premium Audio Setup'),
    link: createMockLinkField('/products/premium', 'Explore Premium Collection'),
  },
};

// Props with image on the right
export const promoBlockPropsImageRight: PromoBlockProps = {
  ...defaultPromoBlockProps,
  params: {
    orientation: Orientation.IMAGE_RIGHT,
    variation: Variation.DEFAULT,
  },
};

// Props with variation two (VERSION_TWO)
export const promoBlockPropsVariationTwo: PromoBlockProps = {
  ...defaultPromoBlockProps,
  params: {
    orientation: Orientation.IMAGE_LEFT,
    variation: Variation.VERSION_TWO,
  },
};

// Props with variation two and image right
export const promoBlockPropsVariationTwoImageRight: PromoBlockProps = {
  ...defaultPromoBlockProps,
  params: {
    orientation: Orientation.IMAGE_RIGHT,
    variation: Variation.VERSION_TWO,
  },
};

// Props without link
export const promoBlockPropsNoLink: PromoBlockProps = {
  ...defaultPromoBlockProps,
  fields: {
    heading: createMockField('Information Only'),
    description: createMockField(
      '<p>This promo block provides information without a call-to-action link.</p>'
    ),
    image: createMockImageField('/images/info-block.jpg', 'Information Block'),
  },
};

// Props with minimal content
export const promoBlockPropsMinimal: PromoBlockProps = {
  rendering: { componentName: 'PromoBlock', params: {} },
  params: {
    orientation: Orientation.IMAGE_LEFT,
  },
  page: mockPage,
  fields: {
    heading: createMockField('Simple Heading'),
    description: createMockField('Simple description text'),
    image: createMockImageField('/images/simple.jpg', 'Simple Image'),
  },
};

// Props with empty content
export const promoBlockPropsEmpty: PromoBlockProps = {
  rendering: { componentName: 'PromoBlock', params: {} },
  params: {},
  page: mockPage,
  fields: {
    heading: createMockField(''),
    description: createMockField(''),
    image: createMockImageField('', ''),
  },
};

// Props with rich text description
export const promoBlockPropsRichText: PromoBlockProps = {
  ...defaultPromoBlockProps,
  fields: {
    ...defaultPromoBlockProps.fields,
    description: createMockField(
      '<h4>Advanced Features</h4><p>Experience <strong>superior sound quality</strong> with our latest technology.</p><ul><li>High-fidelity drivers</li><li>Active noise cancellation</li><li>Long-lasting battery</li></ul>'
    ),
  },
};

// Props with long content
export const promoBlockPropsLongContent: PromoBlockProps = {
  ...defaultPromoBlockProps,
  fields: {
    heading: createMockField('Revolutionary Audio Technology for the Modern Professional'),
    description: createMockField(
      "<p>Our cutting-edge audio solutions are designed for professionals who demand the highest quality sound reproduction. Whether you're mixing in a studio, enjoying music at home, or taking calls on the go, our products deliver exceptional performance that exceeds industry standards. With years of research and development, we've created a lineup that combines innovative technology with elegant design.</p><p>Each product in our collection features premium materials and advanced engineering to ensure durability and superior acoustic performance.</p>"
    ),
    image: createMockImageField('/images/professional-audio.jpg', 'Professional Audio Equipment'),
    link: createMockLinkField('/products/professional', 'View Professional Series'),
  },
};

// Props without fields (should show NoDataFallback)
export const promoBlockPropsNoFields: Partial<PromoBlockProps> = {
  params: {},
  fields: undefined,
};

// Props with missing image
export const promoBlockPropsNoImage: Partial<PromoBlockProps> = {
  params: {
    orientation: Orientation.IMAGE_LEFT,
    variation: Variation.DEFAULT,
  },
  fields: {
    heading: createMockField('Text Only Content'),
    description: createMockField(
      '<p>This promo block has text content but no image component.</p>'
    ),
    image: createMockImageField('', ''),
    link: createMockLinkField('/text-content', 'Read More'),
  } as unknown as PromoBlockProps['fields'],
};

// Props for testing all orientations
export const promoBlockOrientations = [
  {
    name: 'Image Left',
    props: { ...defaultPromoBlockProps, params: { orientation: Orientation.IMAGE_LEFT } },
  },
  {
    name: 'Image Right',
    props: { ...defaultPromoBlockProps, params: { orientation: Orientation.IMAGE_RIGHT } },
  },
];

// Props for testing all variations
export const promoBlockVariations = [
  {
    name: 'Default Variation',
    props: { ...defaultPromoBlockProps, params: { variation: Variation.DEFAULT } },
  },
  {
    name: 'Version Two Variation',
    props: { ...defaultPromoBlockProps, params: { variation: Variation.VERSION_TWO } },
  },
];

// Props for TextLink variant testing
export const textLinkPromoBlockProps: PromoBlockProps = {
  ...defaultPromoBlockProps,
  fields: {
    heading: createMockField('Text Link Variant'),
    description: createMockField(
      '<p>This variant uses VERSION_TWO variation with outline button type.</p>'
    ),
    image: createMockImageField('/images/text-link.jpg', 'Text Link Variant'),
    link: createMockLinkField('/text-link', 'Text Link Action'),
  },
};

// Props for ButtonLink variant testing (same as default)
export const buttonLinkPromoBlockProps: PromoBlockProps = {
  ...defaultPromoBlockProps,
  fields: {
    heading: createMockField('Button Link Variant'),
    description: createMockField(
      '<p>This is the standard button link variant (same as default).</p>'
    ),
    image: createMockImageField('/images/button-link.jpg', 'Button Link Variant'),
    link: createMockLinkField('/button-link', 'Button Link Action'),
  },
};
