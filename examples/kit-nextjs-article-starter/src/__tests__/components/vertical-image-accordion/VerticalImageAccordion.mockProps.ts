import { Field, ImageField, LinkField, ComponentRendering, Page, PageMode } from '@sitecore-content-sdk/nextjs';
import {
  VerticalImageAccordionProps,
  AccordionItem,
} from '@/components/vertical-image-accordion/vertical-image-accordion.props';

// Mock rendering object
const mockRendering: ComponentRendering = {
  componentName: 'VerticalImageAccordion',
  dataSource: '',
  params: {},
};

// Mock page object
const mockPage: Page = {
  mode: {
    name: 'normal' as PageMode['name'],
    isEditing: false,
    isPreview: false,
    isNormal: true,
    isDesignLibrary: false,
    designLibrary: { isVariantGeneration: false },
  },
  layout: {
    sitecore: {
      route: null,
    },
  } as Page['layout'],
  locale: 'en',
};

// Mock page object for editing mode
const mockPageEditing: Page = {
  mode: {
    name: 'edit' as PageMode['name'],
    isEditing: true,
    isPreview: false,
    isNormal: false,
    isDesignLibrary: false,
    designLibrary: { isVariantGeneration: false },
  },
  layout: {
    sitecore: {
      route: null,
    },
  } as Page['layout'],
  locale: 'en',
};

// Mock accordion items
export const mockAccordionItem1: AccordionItem = {
  title: {
    jsonValue: {
      value: 'Innovation & Technology',
    } as Field<string>,
  },
  description: {
    jsonValue: {
      value: 'Explore cutting-edge solutions that drive digital transformation',
    } as Field<string>,
  },
  image: {
    jsonValue: {
      value: {
        src: '/images/innovation.jpg',
        alt: 'Innovation',
        width: 800,
        height: 600,
      },
    } as ImageField,
  },
  link: {
    jsonValue: {
      value: {
        href: '/innovation',
        text: 'Learn More',
        linktype: 'internal',
        url: '/innovation',
      },
    } as LinkField,
  },
};

export const mockAccordionItem2: AccordionItem = {
  title: {
    jsonValue: {
      value: 'Design Excellence',
    } as Field<string>,
  },
  description: {
    jsonValue: {
      value: 'Crafting beautiful experiences that engage and inspire users',
    } as Field<string>,
  },
  image: {
    jsonValue: {
      value: {
        src: '/images/design.jpg',
        alt: 'Design',
        width: 800,
        height: 600,
      },
    } as ImageField,
  },
  link: {
    jsonValue: {
      value: {
        href: '/design',
        text: 'Explore Design',
        linktype: 'internal',
        url: '/design',
      },
    } as LinkField,
  },
};

export const mockAccordionItem3: AccordionItem = {
  title: {
    jsonValue: {
      value: 'Strategic Growth',
    } as Field<string>,
  },
  description: {
    jsonValue: {
      value: 'Building sustainable strategies for long-term success',
    } as Field<string>,
  },
  image: {
    jsonValue: {
      value: {
        src: '/images/growth.jpg',
        alt: 'Growth',
        width: 800,
        height: 600,
      },
    } as ImageField,
  },
  link: {
    jsonValue: {
      value: {
        href: '/growth',
        text: 'See Strategies',
        linktype: 'internal',
        url: '/growth',
      },
    } as LinkField,
  },
};

export const mockAccordionItemWithoutLink: AccordionItem = {
  title: {
    jsonValue: {
      value: 'No Link Item',
    } as Field<string>,
  },
  description: {
    jsonValue: {
      value: 'This item does not have a link',
    } as Field<string>,
  },
  image: {
    jsonValue: {
      value: {
        src: '/images/no-link.jpg',
        alt: 'No Link',
        width: 800,
        height: 600,
      },
    } as ImageField,
  },
};

export const mockAccordionItemWithoutImage: AccordionItem = {
  title: {
    jsonValue: {
      value: 'No Image Item',
    } as Field<string>,
  },
  description: {
    jsonValue: {
      value: 'This item does not have an image',
    } as Field<string>,
  },
  image: {
    jsonValue: {
      value: {
        src: '',
        alt: '',
        width: 0,
        height: 0,
      },
    } as ImageField,
  },
  link: {
    jsonValue: {
      value: {
        href: '/no-image',
        text: 'View Details',
        linktype: 'internal',
        url: '/no-image',
      },
    } as LinkField,
  },
};

// Mock title
export const mockTitle: Field<string> = {
  value: 'Our Services',
};

// Default props with all fields
export const defaultProps: VerticalImageAccordionProps = {
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: mockTitle,
        },
        items: {
          results: [mockAccordionItem1, mockAccordionItem2, mockAccordionItem3],
        },
      },
    },
  },
  params: {},
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPage,
};

// Props in editing mode
export const propsInEditingMode: VerticalImageAccordionProps = {
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: mockTitle,
        },
        items: {
          results: [mockAccordionItem1, mockAccordionItem2],
        },
      },
    },
  },
  params: {},
  isPageEditing: true,
  rendering: mockRendering,
  page: mockPageEditing,
};

// Props with single item
export const propsWithSingleItem: VerticalImageAccordionProps = {
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: mockTitle,
        },
        items: {
          results: [mockAccordionItem1],
        },
      },
    },
  },
  params: {},
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPage,
};

// Props with two items
export const propsWithTwoItems: VerticalImageAccordionProps = {
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: mockTitle,
        },
        items: {
          results: [mockAccordionItem1, mockAccordionItem2],
        },
      },
    },
  },
  params: {},
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPage,
};

// Props without title
export const propsWithoutTitle: VerticalImageAccordionProps = {
  fields: {
    data: {
      datasource: {
        items: {
          results: [mockAccordionItem1, mockAccordionItem2],
        },
      },
    },
  },
  params: {},
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPage,
};

// Props with item without link
export const propsWithItemWithoutLink: VerticalImageAccordionProps = {
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: mockTitle,
        },
        items: {
          results: [mockAccordionItem1, mockAccordionItemWithoutLink],
        },
      },
    },
  },
  params: {},
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPage,
};

// Props with item without image
export const propsWithItemWithoutImage: VerticalImageAccordionProps = {
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: mockTitle,
        },
        items: {
          results: [mockAccordionItem1, mockAccordionItemWithoutImage],
        },
      },
    },
  },
  params: {},
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPage,
};

// Props with empty items array
export const propsWithEmptyItems: VerticalImageAccordionProps = {
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: mockTitle,
        },
        items: {
          results: [],
        },
      },
    },
  },
  params: {},
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPage,
};

// Props without items
export const propsWithoutItems: VerticalImageAccordionProps = {
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: mockTitle,
        },
      },
    },
  },
  params: {},
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPage,
};

// Props without fields (null scenario)
export const propsWithoutFields: VerticalImageAccordionProps = {
  fields: null as unknown as typeof defaultProps.fields,
  params: {},
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPage,
};

// Props with undefined fields
export const propsWithUndefinedFields: VerticalImageAccordionProps = {
  fields: undefined as unknown as typeof defaultProps.fields,
  params: {},
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPage,
};

