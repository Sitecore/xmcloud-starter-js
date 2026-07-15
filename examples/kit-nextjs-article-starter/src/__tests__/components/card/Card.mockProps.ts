import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { IconName } from '@/enumerations/Icon.enum';
import { EnumValues } from '@/enumerations/generic.enum';

// Type for Card component props (matching Card.dev.tsx)
type CardPropsType = {
  heading: Field<string>;
  description: Field<string>;
  image?: ImageField;
  link: LinkField;
  icon?: EnumValues<typeof IconName>;
  className?: string;
  editable?: boolean;
};

// Mock text fields
export const mockHeadingField: Field<string> = {
  value: 'Card Heading',
};

export const mockDescriptionField: Field<string> = {
  value: '<p>This is a card description with <strong>rich text</strong> content.</p>',
};

export const mockEmptyHeadingField: Field<string> = {
  value: '',
};

export const mockEmptyDescriptionField: Field<string> = {
  value: '',
};

// Mock image field
export const mockImageField: ImageField = {
  value: {
    src: '/test-card-image.jpg',
    alt: 'Card Image',
    width: 800,
    height: 600,
  },
};

export const mockImageFieldWithoutSrc: ImageField = {
  value: {
    src: '',
    alt: 'No Image',
    width: 0,
    height: 0,
  },
};

// Mock link field
export const mockLinkField: LinkField = {
  value: {
    href: '/read-more',
    text: 'Read More',
    linktype: 'internal',
    url: '/read-more',
  },
};

export const mockExternalLinkField: LinkField = {
  value: {
    href: 'https://example.com',
    text: 'Visit Website',
    linktype: 'external',
    url: 'https://example.com',
  },
};

export const mockEmptyLinkField: LinkField = {
  value: {
    href: '',
    text: '',
    linktype: 'internal',
    url: '',
  },
};

// Complete props combinations
export const defaultProps = {
  heading: mockHeadingField,
  description: mockDescriptionField,
  image: mockImageField,
  link: mockLinkField,
  icon: IconName.ARROW_RIGHT,
  className: 'custom-card-class',
  editable: false,
};

export const propsWithoutImage = {
  heading: mockHeadingField,
  description: mockDescriptionField,
  image: undefined,
  link: mockLinkField,
  icon: IconName.ARROW_RIGHT,
  editable: false,
};

export const propsWithoutLink = {
  heading: mockHeadingField,
  description: mockDescriptionField,
  image: mockImageField,
  link: undefined as unknown as LinkField,
  icon: IconName.ARROW_RIGHT,
  editable: false,
} as unknown as CardPropsType;

export const propsWithEmptyLink = {
  heading: mockHeadingField,
  description: mockDescriptionField,
  image: mockImageField,
  link: mockEmptyLinkField,
  icon: IconName.ARROW_RIGHT,
  editable: false,
};

export const propsWithoutIcon = {
  heading: mockHeadingField,
  description: mockDescriptionField,
  image: mockImageField,
  link: mockLinkField,
  icon: undefined,
  editable: false,
};

export const propsWithExternalLink = {
  heading: mockHeadingField,
  description: mockDescriptionField,
  image: mockImageField,
  link: mockExternalLinkField,
  icon: IconName.EXTERNAL,
  editable: false,
};

export const propsEditable = {
  heading: mockHeadingField,
  description: mockDescriptionField,
  image: mockImageField,
  link: mockLinkField,
  icon: IconName.ARROW_RIGHT,
  editable: true,
};

export const propsWithEmptyFields = {
  heading: mockEmptyHeadingField,
  description: mockEmptyDescriptionField,
  image: mockImageFieldWithoutSrc,
  link: mockLinkField,
  icon: IconName.ARROW_RIGHT,
  editable: false,
};

export const propsMinimal = {
  heading: mockHeadingField,
  description: mockDescriptionField,
  image: undefined,
  link: undefined as unknown as LinkField,
  icon: undefined,
  editable: false,
} as unknown as CardPropsType;

export const propsWithCustomIcon = {
  heading: mockHeadingField,
  description: mockDescriptionField,
  image: mockImageField,
  link: mockLinkField,
  icon: IconName.ARROW_RIGHT, // Use valid icon from enum
  editable: false,
};

export const propsWithoutClassName = {
  heading: mockHeadingField,
  description: mockDescriptionField,
  image: mockImageField,
  link: mockLinkField,
  icon: IconName.ARROW_RIGHT,
  className: undefined,
  editable: false,
};

