import { LinkField, ImageField, Page, ComponentRendering, PageMode } from '@sitecore-content-sdk/nextjs';
import { IconName } from '@/enumerations/Icon.enum';
import { ButtonVariants, ButtonSize } from '@/enumerations/ButtonStyle.enum';
import { IconPosition } from '@/enumerations/IconPosition.enum';
import { EnumValues } from '@/enumerations/generic.enum';
import type { ButtonComponentProps } from '@/components/button-component/ButtonComponent';

// Mock page data
const mockPageBase: Page = {
  mode: {
    isEditing: false,
    isPreview: false,
    isNormal: true,
    name: 'normal' as PageMode['name'],
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
};

const mockPageEditing: Page = {
  mode: {
    isEditing: true,
    isPreview: false,
    isNormal: false,
    name: 'edit' as PageMode['name'],
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
};

export const mockPageData = {
  page: mockPageBase,
};

export const mockPageDataEditing = {
  page: mockPageEditing,
};

// Mock link fields
export const mockButtonLink: LinkField = {
  value: {
    href: '/test-page',
    text: 'Click Me',
    linktype: 'internal',
    url: '/test-page',
  },
};

export const mockExternalButtonLink: LinkField = {
  value: {
    href: 'https://example.com',
    text: 'External Link',
    linktype: 'external',
    url: 'https://example.com',
  },
};

export const mockButtonLinkWithoutText: LinkField = {
  value: {
    href: '/test-page',
    text: '',
    linktype: 'internal',
    url: '/test-page',
  },
};

export const mockButtonLinkWithoutHref: LinkField = {
  value: {
    href: '',
    text: 'No Href',
    linktype: 'internal',
    url: '',
  },
};

export const mockButtonLinkHttpOnly: LinkField = {
  value: {
    href: 'http://',
    text: 'Invalid Link',
    linktype: 'internal',
    url: 'http://',
  },
};

// Mock image field for EditableImageButton
export const mockIconImage: ImageField = {
  value: {
    src: '/test-icon.svg',
    alt: 'Test Icon',
    width: 24,
    height: 24,
  },
};

export const mockIconImageWithoutSrc: ImageField = {
  value: {
    src: '',
    alt: 'No Icon',
    width: 24,
    height: 24,
  },
};

// Mock fields - Default component
export const mockFieldsDefault = {
  buttonLink: mockButtonLink,
  icon: {
    value: IconName.ARROW_RIGHT,
  },
  isAriaHidden: true,
};

export const mockFieldsWithLeadingIcon = {
  buttonLink: mockButtonLink,
  icon: {
    value: IconName.ARROW_LEFT,
  },
  isAriaHidden: true,
};

export const mockFieldsWithoutIcon = {
  buttonLink: mockButtonLink,
  isAriaHidden: true,
};

export const mockFieldsWithInvalidLink = {
  buttonLink: mockButtonLinkWithoutText,
  icon: {
    value: IconName.ARROW_RIGHT,
  },
  isAriaHidden: true,
};

export const mockFieldsExternalLink = {
  buttonLink: mockExternalButtonLink,
  icon: {
    value: IconName.EXTERNAL,
  },
  isAriaHidden: true,
};

// Mock params
export const mockParamsDefault = {
  size: ButtonSize.DEFAULT,
  iconPosition: IconPosition.TRAILING,
  iconClassName: 'h-5 w-5',
};

export const mockParamsLeadingIcon = {
  size: ButtonSize.DEFAULT,
  iconPosition: IconPosition.LEADING,
  iconClassName: 'h-5 w-5',
};

export const mockParamsEditing = {
  size: ButtonSize.DEFAULT,
  iconPosition: IconPosition.TRAILING,
  iconClassName: 'h-5 w-5',
  isPageEditing: true,
};

export const mockParamsLarge = {
  size: ButtonSize.LG,
  iconPosition: IconPosition.TRAILING,
  iconClassName: 'h-6 w-6',
};

export const mockParamsSmall = {
  size: ButtonSize.SM,
  iconPosition: IconPosition.TRAILING,
  iconClassName: 'h-4 w-4',
};

// Mock rendering
const mockRendering: ComponentRendering = {
  componentName: 'ButtonComponent',
} as ComponentRendering;

// Type for ButtonComponent fields
type ButtonFieldsType = {
  buttonLink: LinkField;
  icon?: { value: EnumValues<typeof IconName> };
  isAriaHidden?: boolean;
};

// Complete props combinations - Default component
export const defaultProps: ButtonComponentProps = {
  fields: mockFieldsDefault,
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithLeadingIcon: ButtonComponentProps = {
  fields: mockFieldsWithLeadingIcon,
  params: mockParamsLeadingIcon,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutIcon: ButtonComponentProps = {
  fields: mockFieldsWithoutIcon,
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsInEditing = {
  fields: mockFieldsDefault,
  params: mockParamsEditing,
  rendering: mockRendering,
  page: mockPageEditing,
} as unknown as ButtonComponentProps;

export const propsWithInvalidLink: ButtonComponentProps = {
  fields: mockFieldsWithInvalidLink,
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsPrimary: ButtonComponentProps = {
  fields: mockFieldsDefault,
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsSecondary: ButtonComponentProps = {
  fields: mockFieldsDefault,
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsDestructive: ButtonComponentProps = {
  fields: mockFieldsDefault,
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsGhost: ButtonComponentProps = {
  fields: mockFieldsDefault,
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsOutline: ButtonComponentProps = {
  fields: mockFieldsDefault,
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsLink: ButtonComponentProps = {
  fields: mockFieldsDefault,
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsTertiary: ButtonComponentProps = {
  fields: mockFieldsDefault,
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsLargeSize: ButtonComponentProps = {
  fields: mockFieldsDefault,
  params: mockParamsLarge,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsSmallSize: ButtonComponentProps = {
  fields: mockFieldsDefault,
  params: mockParamsSmall,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsExternalLink: ButtonComponentProps = {
  fields: mockFieldsExternalLink,
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutFields = {
  fields: null as ButtonFieldsType | null,
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
} as unknown as ButtonComponentProps;

export const propsWithHttpOnlyLink: ButtonComponentProps = {
  fields: {
    buttonLink: mockButtonLinkHttpOnly,
  },
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
};

// Props for EditableButton
export const editableButtonProps = {
  buttonLink: mockButtonLink,
  icon: {
    value: IconName.ARROW_RIGHT,
  },
  variant: ButtonVariants.PRIMARY,
  size: ButtonSize.DEFAULT,
  iconPosition: IconPosition.TRAILING,
  iconClassName: 'h-5 w-5',
  isAriaHidden: true,
  className: 'custom-class',
  isPageEditing: false,
  asIconLink: false,
};

export const editableButtonPropsAsIconLink = {
  ...editableButtonProps,
  asIconLink: true,
};

export const editableButtonPropsEditing = {
  ...editableButtonProps,
  isPageEditing: true,
};

// Props for EditableImageButton
export const editableImageButtonProps = {
  buttonLink: mockButtonLink,
  icon: mockIconImage,
  variant: ButtonVariants.PRIMARY,
  size: ButtonSize.DEFAULT,
  iconPosition: IconPosition.TRAILING,
  iconClassName: 'h-6 w-6',
  isAriaHidden: true,
  className: 'custom-class',
  isPageEditing: false,
  asIconLink: false,
};

export const editableImageButtonPropsEditing = {
  ...editableImageButtonProps,
  isPageEditing: true,
};

export const editableImageButtonPropsWithoutIcon = {
  ...editableImageButtonProps,
  icon: undefined,
};

export const editableImageButtonPropsWithoutSrc = {
  ...editableImageButtonProps,
  icon: mockIconImageWithoutSrc,
};

// Additional props for coverage
export const editableButtonPropsWithLeadingIcon = {
  ...editableButtonProps,
  iconPosition: IconPosition.LEADING,
};

export const editableButtonPropsWithLeadingIconEditing = {
  ...editableButtonPropsWithLeadingIcon,
  isPageEditing: true,
};

export const editableImageButtonPropsWithLeadingIcon = {
  ...editableImageButtonProps,
  iconPosition: IconPosition.LEADING,
};

export const editableImageButtonPropsWithLeadingIconEditing = {
  ...editableImageButtonPropsWithLeadingIcon,
  isPageEditing: true,
};

// Props for EditableImageButton with icon but no text (to test isValidEditableLink)
export const mockButtonLinkWithoutTextForImage: LinkField = {
  value: {
    href: '/test-page',
    text: '',
    linktype: 'internal',
    url: '/test-page',
  },
};

export const editableImageButtonPropsWithIconNoText = {
  buttonLink: mockButtonLinkWithoutTextForImage,
  icon: mockIconImage,
  variant: ButtonVariants.PRIMARY,
  size: ButtonSize.DEFAULT,
  iconPosition: IconPosition.TRAILING,
  iconClassName: 'h-6 w-6',
  isAriaHidden: true,
  className: 'custom-class',
  isPageEditing: false,
  asIconLink: false,
};

// Props for ButtonBase component
export const buttonBaseProps = {
  buttonLink: mockButtonLink,
  icon: {
    value: IconName.ARROW_RIGHT,
  },
  variant: ButtonVariants.PRIMARY,
  size: ButtonSize.DEFAULT,
  iconPosition: IconPosition.TRAILING,
  iconClassName: 'h-5 w-5',
  isAriaHidden: true,
  className: 'custom-class',
  isPageEditing: false,
};

export const buttonBasePropsWithLeadingIcon = {
  ...buttonBaseProps,
  iconPosition: IconPosition.LEADING,
};

export const buttonBasePropsEditing = {
  ...buttonBaseProps,
  isPageEditing: true,
};

// Props for Default component to test fallback icon logic
export const propsWithoutIconAndLinktype = {
  fields: {
    buttonLink: {
      value: {
        href: '/test-page',
        text: 'Click Me',
        linktype: '',
        url: '/test-page',
      },
    },
  },
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
} as unknown as ButtonComponentProps;

export const propsWithoutIconWithLinktype = {
  fields: {
    buttonLink: {
      value: {
        href: '/test-page',
        text: 'Click Me',
        linktype: 'external',
        url: '/test-page',
      },
    },
  },
  params: mockParamsDefault,
  rendering: mockRendering,
  page: mockPageBase,
} as unknown as ButtonComponentProps;

// Props for Default component to test NoDataFallback (fields null but in editing mode)
export const propsWithoutFieldsEditing = {
  fields: null as ButtonFieldsType | null,
  params: {
    ...mockParamsDefault,
    isPageEditing: true,
  },
  rendering: mockRendering,
  page: mockPageEditing,
} as unknown as ButtonComponentProps;
