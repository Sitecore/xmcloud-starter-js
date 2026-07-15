import type { ButtonComponentProps } from '../../components/button-component/ButtonComponent';
import type { LinkField, ImageField, Page } from '@sitecore-content-sdk/nextjs';
import { IconName } from '@/enumerations/Icon.enum';
import { IconPosition } from '@/enumerations/IconPosition.enum';
import { ButtonVariants, ButtonSize } from '@/enumerations/ButtonStyle.enum';

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

// Valid button link
const mockButtonLink: LinkField = {
  value: {
    href: '/test-link',
    text: 'Click Me',
    linktype: 'internal',
  },
} as unknown as LinkField;

// Button link with no text
const mockButtonLinkNoText: LinkField = {
  value: {
    href: '/test-link',
    text: '',
    linktype: 'internal',
  },
} as unknown as LinkField;

// Button link with invalid href
const mockButtonLinkInvalidHref: LinkField = {
  value: {
    href: 'http://',
    text: 'Invalid Link',
    linktype: 'internal',
  },
} as unknown as LinkField;

// Mock icon field
const mockIconField = {
  value: IconName.ARROW_RIGHT,
};

// Mock image field for EditableButton
const mockImageField: ImageField = {
  value: {
    src: '/test-icon.png',
    alt: 'Test Icon',
  },
} as unknown as ImageField;

// Default button props
export const defaultButtonProps: ButtonComponentProps = {
  rendering: { componentName: 'Button', params: {} },
  params: {
    size: ButtonSize.DEFAULT,
    iconPosition: IconPosition.TRAILING,
  },
  fields: {
    buttonLink: mockButtonLink,
    icon: mockIconField,
    isAriaHidden: true,
  },
  page: mockPageNormal,
};

// Button with leading icon
export const buttonWithLeadingIcon: ButtonComponentProps = {
  rendering: { componentName: 'Button', params: {} },
  params: {
    size: ButtonSize.DEFAULT,
    iconPosition: IconPosition.LEADING,
  },
  fields: {
    buttonLink: mockButtonLink,
    icon: mockIconField,
    isAriaHidden: true,
  },
  page: mockPageNormal,
};

// Button without icon
export const buttonWithoutIcon: ButtonComponentProps = {
  rendering: { componentName: 'Button', params: {} },
  params: {
    size: ButtonSize.DEFAULT,
  },
  fields: {
    buttonLink: mockButtonLink,
    isAriaHidden: true,
  },
  page: mockPageNormal,
};

// Button in editing mode
export const buttonInEditingMode: ButtonComponentProps = {
  ...defaultButtonProps,
  params: {
    ...defaultButtonProps.params,
  },
};

// Button with no text (invalid)
export const buttonNoText: ButtonComponentProps = {
  ...defaultButtonProps,
  fields: {
    ...defaultButtonProps.fields,
    buttonLink: mockButtonLinkNoText,
  },
};

// Button with invalid href
export const buttonInvalidHref: ButtonComponentProps = {
  ...defaultButtonProps,
  fields: {
    ...defaultButtonProps.fields,
    buttonLink: mockButtonLinkInvalidHref,
  },
};

// Button with no fields
export const buttonNoFields: ButtonComponentProps = {
  rendering: { componentName: 'Button', params: {} },
  params: {},
  fields: undefined as unknown as ButtonComponentProps['fields'],
  page: mockPageNormal,
};

// Primary button variant
export const primaryButtonProps: ButtonComponentProps = {
  ...defaultButtonProps,
  variant: ButtonVariants.PRIMARY,
};

// Secondary button variant
export const secondaryButtonProps: ButtonComponentProps = {
  ...defaultButtonProps,
  variant: ButtonVariants.SECONDARY,
};

// Destructive button variant
export const destructiveButtonProps: ButtonComponentProps = {
  ...defaultButtonProps,
  variant: ButtonVariants.DESTRUCTIVE,
};

// Outline button variant
export const outlineButtonProps: ButtonComponentProps = {
  ...defaultButtonProps,
  variant: ButtonVariants.OUTLINE,
};

// Ghost button variant
export const ghostButtonProps: ButtonComponentProps = {
  ...defaultButtonProps,
  variant: ButtonVariants.GHOST,
};

// Link button variant
export const linkButtonProps: ButtonComponentProps = {
  ...defaultButtonProps,
  variant: ButtonVariants.LINK,
};

// Tertiary button variant
export const tertiaryButtonProps: ButtonComponentProps = {
  ...defaultButtonProps,
  variant: ButtonVariants.TERTIARY,
};

// ButtonBase props
export const buttonBaseProps = {
  buttonLink: mockButtonLink,
  icon: mockIconField,
  variant: ButtonVariants.DEFAULT,
  size: ButtonSize.DEFAULT,
  iconPosition: IconPosition.TRAILING,
  isAriaHidden: true,
  isPageEditing: false,
};

// EditableButton props
export const editableButtonProps = {
  buttonLink: mockButtonLink,
  icon: mockImageField,
  variant: ButtonVariants.DEFAULT,
  size: ButtonSize.DEFAULT,
  iconPosition: IconPosition.TRAILING,
  isAriaHidden: true,
  isPageEditing: false,
  asIconLink: false,
};

// EditableButton as icon link
export const editableButtonAsIconLink = {
  ...editableButtonProps,
  asIconLink: true,
};
