import type { CardProps } from '../../components/card/card.props';
import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { IconName } from '@/enumerations/Icon.enum';

// Mock heading field
const mockHeadingField: Field<string> = {
  value: 'Test Card Heading',
} as unknown as Field<string>;

// Mock description field
const mockDescriptionField: Field<string> = {
  value: '<p>This is a test card description with <strong>rich text</strong>.</p>',
} as unknown as Field<string>;

// Mock image field
const mockImageField: ImageField = {
  value: {
    src: '/test-card-image.jpg',
    alt: 'Test Card Image',
    width: 800,
    height: 600,
  },
} as unknown as ImageField;

// Mock link field
const mockLinkField: LinkField = {
  value: {
    href: '/test-page',
    text: 'Learn More',
    linktype: 'internal',
  },
} as unknown as LinkField;

// Default card props
export const defaultCardProps: CardProps = {
  heading: mockHeadingField,
  description: mockDescriptionField,
  image: mockImageField,
  link: mockLinkField,
  icon: IconName.ARROW_RIGHT,
  editable: false,
};

// Card props without image
export const cardPropsNoImage: CardProps = {
  heading: mockHeadingField,
  description: mockDescriptionField,
  link: mockLinkField,
  editable: false,
};

// Card props without link
export const cardPropsNoLink: CardProps = {
  heading: mockHeadingField,
  description: mockDescriptionField,
  image: mockImageField,
  link: undefined as unknown as LinkField,
  editable: false,
};

// Card props in editable mode
export const cardPropsEditable: CardProps = {
  heading: mockHeadingField,
  description: mockDescriptionField,
  image: mockImageField,
  link: mockLinkField,
  icon: IconName.EXTERNAL,
  editable: true,
};

// Card props with custom class
export const cardPropsWithClass: CardProps = {
  heading: mockHeadingField,
  description: mockDescriptionField,
  image: mockImageField,
  link: mockLinkField,
  className: 'custom-card-class',
  editable: false,
};

// Card props without icon (should use default)
export const cardPropsNoIcon: CardProps = {
  heading: mockHeadingField,
  description: mockDescriptionField,
  image: mockImageField,
  link: mockLinkField,
  editable: true,
};
