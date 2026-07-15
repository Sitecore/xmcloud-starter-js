/**
 * Test fixtures and mock data for AccordionBlock component
 */

import type { Field, LinkField, Page } from '@sitecore-content-sdk/nextjs';
import type {
  AccordionProps,
  AccordionItemProps,
} from '../../components/accordion-block/accordion-block.props';

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

/**
 * Mock page object for editing mode
 */
const mockPageEditing = {
  mode: {
    isEditing: true,
    isNormal: false,
    isPreview: false,
    name: 'edit' as const,
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

/**
 * Base mock data for AccordionBlock component
 */
export const mockAccordionData = {
  heading: 'Frequently Asked Questions',
  description: 'Need more help? Contact our support team.',
  linkText: 'Contact Support',
  linkHref: '/contact',
  item1Heading: 'What is this product?',
  item1Description: '<p>This is a comprehensive solution for your business needs.</p>',
  item2Heading: 'How do I get started?',
  item2Description: '<p>Simply sign up and follow our onboarding guide.</p>',
  item3Heading: 'What are the pricing options?',
  item3Description: '<p>We offer flexible pricing plans to suit different needs.</p>',
};

export const mockHeadingField: { jsonValue: Field<string> } = {
  jsonValue: {
    value: mockAccordionData.heading,
  },
};

export const mockDescriptionField: { jsonValue: Field<string> } = {
  jsonValue: {
    value: mockAccordionData.description,
  },
};

export const mockLinkField: { jsonValue: LinkField } = {
  jsonValue: {
    value: {
      href: mockAccordionData.linkHref,
      text: mockAccordionData.linkText,
      title: mockAccordionData.linkText,
      target: '',
      linktype: 'internal',
    },
  },
};

/**
 * Mock empty link field
 */
export const mockEmptyLinkField: { jsonValue: LinkField } = {
  jsonValue: {
    value: {
      href: '',
      text: '',
    },
  },
};

/**
 * Mock accordion items
 */
export const mockAccordionItem1: AccordionItemProps = {
  heading: {
    jsonValue: {
      value: mockAccordionData.item1Heading,
    },
  },
  description: {
    jsonValue: {
      value: mockAccordionData.item1Description,
    },
  },
};

export const mockAccordionItem2: AccordionItemProps = {
  heading: {
    jsonValue: {
      value: mockAccordionData.item2Heading,
    },
  },
  description: {
    jsonValue: {
      value: mockAccordionData.item2Description,
    },
  },
};

export const mockAccordionItem3: AccordionItemProps = {
  heading: {
    jsonValue: {
      value: mockAccordionData.item3Heading,
    },
  },
  description: {
    jsonValue: {
      value: mockAccordionData.item3Description,
    },
  },
};

/**
 * Default props for AccordionBlock component testing
 */
export const defaultAccordionProps: AccordionProps = {
  rendering: {
    componentName: 'AccordionBlock',
    params: {},
  },
  params: {
    RenderingIdentifier: 'accordion-1',
    styles: 'accordion-custom-styles',
  },
  fields: {
    data: {
      datasource: {
        heading: mockHeadingField,
        description: mockDescriptionField,
        link: mockLinkField,
        children: {
          results: [mockAccordionItem1, mockAccordionItem2, mockAccordionItem3],
        },
      },
    },
  },
  page: mockPageNormal,
  isPageEditing: false,
};

/**
 * Props with page editing mode enabled
 */
export const accordionPropsEditMode: AccordionProps = {
  rendering: {
    componentName: 'AccordionBlock',
    params: {},
  },
  params: {
    RenderingIdentifier: 'accordion-2',
    styles: 'accordion-custom-styles',
  },
  fields: {
    data: {
      datasource: {
        heading: mockHeadingField,
        description: mockDescriptionField,
        link: mockLinkField,
        children: {
          results: [mockAccordionItem1, mockAccordionItem2],
        },
      },
    },
  },
  page: mockPageEditing,
  isPageEditing: true,
};

/**
 * Props without optional fields (description and link)
 */
export const accordionPropsMinimal: AccordionProps = {
  rendering: {
    componentName: 'AccordionBlock',
    params: {},
  },
  params: {
    RenderingIdentifier: 'accordion-3',
    styles: '',
  },
  fields: {
    data: {
      datasource: {
        heading: mockHeadingField,
        link: mockEmptyLinkField,
        children: {
          results: [mockAccordionItem1],
        },
      },
    },
  },
  page: mockPageNormal,
  isPageEditing: false,
};

/**
 * Props with empty accordion items
 */
export const accordionPropsEmptyItems: AccordionProps = {
  rendering: {
    componentName: 'AccordionBlock',
    params: {},
  },
  params: {
    RenderingIdentifier: 'accordion-4',
    styles: 'accordion-styles',
  },
  fields: {
    data: {
      datasource: {
        heading: mockHeadingField,
        description: mockDescriptionField,
        link: mockLinkField,
        children: {
          results: [],
        },
      },
    },
  },
  page: mockPageNormal,
  isPageEditing: false,
};

/**
 * Props with single accordion item
 */
export const accordionPropsSingleItem: AccordionProps = {
  rendering: {
    componentName: 'AccordionBlock',
    params: {},
  },
  params: {
    RenderingIdentifier: 'accordion-5',
    styles: '',
  },
  fields: {
    data: {
      datasource: {
        heading: mockHeadingField,
        description: mockDescriptionField,
        link: mockLinkField,
        children: {
          results: [mockAccordionItem1],
        },
      },
    },
  },
  page: mockPageNormal,
  isPageEditing: false,
};

/**
 * Props without fields (should show fallback)
 */
export const accordionPropsNoFields: AccordionProps = {
  rendering: {
    componentName: 'AccordionBlock',
    params: {},
  },
  params: {
    RenderingIdentifier: 'accordion-6',
    styles: '',
  },
  fields: {
    data: {},
  } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  page: mockPageNormal,
  isPageEditing: false,
};

/**
 * Props with null datasource
 */
export const accordionPropsNullDatasource: AccordionProps = {
  rendering: {
    componentName: 'AccordionBlock',
    params: {},
  },
  params: {
    RenderingIdentifier: 'accordion-7',
    styles: '',
  },
  fields: {
    data: {
      datasource: undefined,
    },
  } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  page: mockPageNormal,
  isPageEditing: false,
};

/**
 * Mock useSitecore context for normal mode
 */
export const mockUseSitecoreNormal = {
  page: mockPageNormal,
};

/**
 * Mock useSitecore context for editing mode
 */
export const mockUseSitecoreEditing = {
  page: mockPageEditing,
};
