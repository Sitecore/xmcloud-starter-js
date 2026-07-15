import { Field, LinkField, RichTextField, Page, ComponentRendering, PageMode } from '@sitecore-content-sdk/nextjs';
import { AccordionItemProps, AccordionFields } from '@/components/accordion-block/accordion-block.props';

// Mock page objects with full Page type
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

// Mock page data for useSitecore hook
export const mockPageData = {
  page: mockPageBase,
};

export const mockPageDataEditing = {
  page: mockPageEditing,
};

// Mock fields data
export const mockHeadingField: Field<string> = {
  value: 'Frequently Asked Questions',
};

export const mockDescriptionField: Field<string> = {
  value: 'Find answers to common questions',
};

export const mockLinkField: LinkField = {
  value: {
    href: '/contact-us',
    text: 'Contact Us',
    title: 'Contact Us',
    target: '',
    linktype: 'internal',
  },
};

export const mockAccordionItem1: AccordionItemProps = {
  heading: {
    jsonValue: {
      value: 'What is this product?',
    } as Field<string>,
  },
  description: {
    jsonValue: {
      value: '<p>This is a detailed description of the product.</p>',
    } as RichTextField,
  },
};

export const mockAccordionItem2: AccordionItemProps = {
  heading: {
    jsonValue: {
      value: 'How do I use it?',
    } as Field<string>,
  },
  description: {
    jsonValue: {
      value: '<p>Follow these steps to use the product effectively.</p>',
    } as RichTextField,
  },
};

export const mockAccordionItem3: AccordionItemProps = {
  heading: {
    jsonValue: {
      value: 'What is the pricing?',
    } as Field<string>,
  },
  description: {
    jsonValue: {
      value: '<p>Our pricing starts at $99/month.</p>',
    } as RichTextField,
  },
};

export const mockFields = {
  data: {
    datasource: {
      heading: {
        jsonValue: mockHeadingField,
      },
      description: {
        jsonValue: mockDescriptionField,
      },
      link: {
        jsonValue: mockLinkField,
      },
      children: {
        results: [mockAccordionItem1, mockAccordionItem2, mockAccordionItem3],
      },
    },
  },
};

export const mockFieldsWithoutDescription = {
  data: {
    datasource: {
      heading: {
        jsonValue: mockHeadingField,
      },
      link: {
        jsonValue: mockLinkField,
      },
      children: {
        results: [mockAccordionItem1, mockAccordionItem2],
      },
    },
  },
};

export const mockFieldsWithoutLink = {
  data: {
    datasource: {
      heading: {
        jsonValue: mockHeadingField,
      },
      description: {
        jsonValue: mockDescriptionField,
      },
      children: {
        results: [mockAccordionItem1],
      },
    },
  },
};

export const mockFieldsWithEmptyChildren = {
  data: {
    datasource: {
      heading: {
        jsonValue: mockHeadingField,
      },
      description: {
        jsonValue: mockDescriptionField,
      },
      link: {
        jsonValue: mockLinkField,
      },
      children: {
        results: [],
      },
    },
  },
};

export const mockFieldsWithoutDatasource = {
  data: {},
};

// Mock params data
export const mockParams = {
  styles: 'custom-accordion-style',
  RenderingIdentifier: 'accordion-rendering-id',
};

export const mockParamsWithoutStyles = {
  RenderingIdentifier: 'accordion-rendering-id',
};

// Complete props combinations
export const defaultProps = {
  params: mockParams,
  fields: mockFields,
  isPageEditing: false,
  rendering: { componentName: 'AccordionBlock' } as ComponentRendering,
  page: mockPageBase,
};

export const propsWithoutDescription = {
  params: mockParams,
  fields: mockFieldsWithoutDescription,
  isPageEditing: false,
  rendering: { componentName: 'AccordionBlock' } as ComponentRendering,
  page: mockPageBase,
};

export const propsWithoutLink = {
  params: mockParams,
  fields: mockFieldsWithoutLink,
  isPageEditing: false,
  rendering: { componentName: 'AccordionBlock' } as ComponentRendering,
  page: mockPageBase,
};

export const propsWithEmptyChildren = {
  params: mockParams,
  fields: mockFieldsWithEmptyChildren,
  isPageEditing: false,
  rendering: { componentName: 'AccordionBlock' } as ComponentRendering,
  page: mockPageBase,
};

export const propsWithoutStyles = {
  params: mockParamsWithoutStyles,
  fields: mockFields,
  isPageEditing: false,
  rendering: { componentName: 'AccordionBlock' } as ComponentRendering,
  page: mockPageBase,
};

export const propsEditing = {
  params: mockParams,
  fields: mockFields,
  isPageEditing: true,
  rendering: { componentName: 'AccordionBlock' } as ComponentRendering,
  page: mockPageEditing,
};

export const propsWithoutDatasource = {
  params: mockParams,
  fields: mockFieldsWithoutDatasource,
  isPageEditing: false,
  rendering: { componentName: 'AccordionBlock' } as ComponentRendering,
  page: mockPageBase,
};

export const propsWithoutFields = {
  params: mockParams,
  fields: undefined as AccordionFields['fields'] | undefined,
  isPageEditing: false,
  rendering: { componentName: 'AccordionBlock' } as ComponentRendering,
  page: mockPageBase,
};


