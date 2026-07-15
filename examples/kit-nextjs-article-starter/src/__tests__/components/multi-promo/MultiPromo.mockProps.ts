import { Field, Page, PageMode, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { MultiPromoProps, MultiPromoItemProps } from '@/components/multi-promo/multi-promo.props';

// Mock page objects
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

// Mock text fields
export const mockTitleField: Field<string> = {
  value: 'Featured Products',
};

export const mockDescriptionField: Field<string> = {
  value: '<p>Explore our curated selection of premium products designed for your lifestyle.</p>',
};

// Mock promo items
export const mockPromoItem1: MultiPromoItemProps = {
  heading: {
    jsonValue: {
      value: 'Premium Headphones',
    } as Field<string>,
  },
  image: {
    jsonValue: {
      value: {
        src: '/images/headphones.jpg',
        alt: 'Premium Headphones',
        width: 416,
        height: 384,
      },
    },
  },
  link: {
    jsonValue: {
      value: {
        href: '/products/headphones',
        text: 'Shop Now',
        title: 'Shop Headphones',
        target: '',
        linktype: 'internal',
      },
    },
  },
};

export const mockPromoItem2: MultiPromoItemProps = {
  heading: {
    jsonValue: {
      value: 'Smart Watch',
    } as Field<string>,
  },
  image: {
    jsonValue: {
      value: {
        src: '/images/smartwatch.jpg',
        alt: 'Smart Watch',
        width: 416,
        height: 384,
      },
    },
  },
  link: {
    jsonValue: {
      value: {
        href: '/products/smartwatch',
        text: 'Learn More',
        title: 'Learn about Smart Watch',
        target: '',
        linktype: 'internal',
      },
    },
  },
};

export const mockPromoItem3: MultiPromoItemProps = {
  heading: {
    jsonValue: {
      value: 'Wireless Speaker',
    } as Field<string>,
  },
  image: {
    jsonValue: {
      value: {
        src: '/images/speaker.jpg',
        alt: 'Wireless Speaker',
        width: 416,
        height: 384,
      },
    },
  },
  link: {
    jsonValue: {
      value: {
        href: '/products/speaker',
        text: 'View Details',
        title: 'View Speaker Details',
        target: '',
        linktype: 'internal',
      },
    },
  },
};

export const mockPromoItem4: MultiPromoItemProps = {
  heading: {
    jsonValue: {
      value: 'Laptop Stand',
    } as Field<string>,
  },
  image: {
    jsonValue: {
      value: {
        src: '/images/laptop-stand.jpg',
        alt: 'Laptop Stand',
        width: 416,
        height: 384,
      },
    },
  },
  link: {
    jsonValue: {
      value: {
        href: '/products/laptop-stand',
        text: 'Discover',
        title: 'Discover Laptop Stand',
        target: '',
        linktype: 'internal',
      },
    },
  },
};

export const mockPromoItemWithoutLink: MultiPromoItemProps = {
  heading: {
    jsonValue: {
      value: 'Coming Soon',
    } as Field<string>,
  },
  image: {
    jsonValue: {
      value: {
        src: '/images/coming-soon.jpg',
        alt: 'Coming Soon',
        width: 416,
        height: 384,
      },
    },
  },
};

// Complete fields data
export const mockFields = {
  data: {
    datasource: {
      title: {
        jsonValue: mockTitleField,
      },
      description: {
        jsonValue: mockDescriptionField,
      },
      children: {
        results: [mockPromoItem1, mockPromoItem2, mockPromoItem3, mockPromoItem4],
      },
    },
  },
};

export const mockFieldsWithoutDescription = {
  data: {
    datasource: {
      title: {
        jsonValue: mockTitleField,
      },
      children: {
        results: [mockPromoItem1, mockPromoItem2, mockPromoItem3],
      },
    },
  },
};

export const mockFieldsWithoutTitle: MultiPromoProps['fields'] = {
  data: {
    datasource: {
      title: {
        jsonValue: { value: '' } as Field<string>,
      },
      description: {
        jsonValue: mockDescriptionField,
      },
      children: {
        results: [mockPromoItem1, mockPromoItem2],
      },
    },
  },
};

export const mockFieldsWithoutChildren = {
  data: {
    datasource: {
      title: {
        jsonValue: mockTitleField,
      },
      description: {
        jsonValue: mockDescriptionField,
      },
    },
  },
};

export const mockFieldsWith3Items = {
  data: {
    datasource: {
      title: {
        jsonValue: mockTitleField,
      },
      description: {
        jsonValue: mockDescriptionField,
      },
      children: {
        results: [mockPromoItem1, mockPromoItem2, mockPromoItem3],
      },
    },
  },
};

export const mockFieldsWithoutDatasource: MultiPromoProps['fields'] = {
  data: {
    datasource: {
      title: {
        jsonValue: { value: '' } as Field<string>,
      },
    },
  },
};

// Mock params
export const mockParamsDefault = {
  numColumns: '3',
  styles: 'custom-multi-promo-style',
  RenderingIdentifier: 'multi-promo-rendering-id',
};

export const mockParams4Columns = {
  numColumns: '4',
  RenderingIdentifier: 'multi-promo-rendering-id',
};

export const mockParamsWithPositionStyles = {
  numColumns: '3',
  styles: 'position-right',
  RenderingIdentifier: 'multi-promo-rendering-id',
};

export const mockParamsWithoutStyles = {
  numColumns: '3',
  RenderingIdentifier: 'multi-promo-rendering-id',
};

// Mock rendering
const mockRendering: ComponentRendering = {
  componentName: 'MultiPromo',
};

// Complete props combinations
export const defaultProps: MultiPromoProps = {
  params: mockParamsDefault,
  fields: mockFields,
  rendering: mockRendering,
  name: 'MultiPromo',
  promos: [],
  page: mockPageBase,
};

export const propsWith4Columns: MultiPromoProps = {
  params: mockParams4Columns,
  fields: mockFields,
  rendering: mockRendering,
  name: 'MultiPromo',
  promos: [],
  page: mockPageBase,
};

export const propsWithPositionStyles: MultiPromoProps = {
  params: mockParamsWithPositionStyles,
  fields: mockFields,
  rendering: mockRendering,
  name: 'MultiPromo',
  promos: [],
  page: mockPageBase,
};

export const propsWithoutDescription: MultiPromoProps = {
  params: mockParamsDefault,
  fields: mockFieldsWithoutDescription,
  rendering: mockRendering,
  name: 'MultiPromo',
  promos: [],
  page: mockPageBase,
};

export const propsWithoutTitle: MultiPromoProps = {
  params: mockParamsDefault,
  fields: mockFieldsWithoutTitle,
  rendering: mockRendering,
  name: 'MultiPromo',
  promos: [],
  page: mockPageBase,
};

export const propsWithoutChildren: MultiPromoProps = {
  params: mockParamsDefault,
  fields: mockFieldsWithoutChildren,
  rendering: mockRendering,
  name: 'MultiPromo',
  promos: [],
  page: mockPageBase,
};

export const propsWith3Items: MultiPromoProps = {
  params: mockParamsDefault,
  fields: mockFieldsWith3Items,
  rendering: mockRendering,
  name: 'MultiPromo',
  promos: [],
  page: mockPageBase,
};

export const propsWithoutDatasource: MultiPromoProps = {
  params: mockParamsDefault,
  fields: mockFieldsWithoutDatasource,
  rendering: mockRendering,
  name: 'MultiPromo',
  promos: [],
  page: mockPageBase,
};

export const propsWithoutFields: MultiPromoProps = {
  params: mockParamsDefault,
  fields: null as unknown as MultiPromoProps['fields'],
  rendering: mockRendering,
  name: 'MultiPromo',
  promos: [],
  page: mockPageBase,
};

export const propsEditing: MultiPromoProps = {
  params: mockParamsDefault,
  fields: mockFields,
  rendering: mockRendering,
  name: 'MultiPromo',
  promos: [],
  page: mockPageEditing,
};

