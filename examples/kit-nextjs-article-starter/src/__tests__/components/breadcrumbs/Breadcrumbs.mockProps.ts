import { Field, ComponentRendering, Page, PageMode } from '@sitecore-content-sdk/nextjs';
import { GqlFieldString } from '@/types/gql.props';
import type { LinkFieldValue } from '@sitecore-content-sdk/nextjs';

// Type definition matching Breadcrumbs component
type BreadcrumbsPage = {
  name: string;
  title: GqlFieldString;
  navigationTitle: GqlFieldString;
  url?: LinkFieldValue;
};

// Mock breadcrumb pages
export const mockAncestorHome = {
  name: 'Home',
  title: {
    jsonValue: {
      value: 'Home Page',
    } as Field<string>,
  } as GqlFieldString,
  navigationTitle: {
    jsonValue: {
      value: 'Home',
    } as Field<string>,
  } as GqlFieldString,
  url: {
    href: '/',
    text: 'Home',
    linktype: 'internal',
  },
};

export const mockAncestorArticles = {
  name: 'Articles',
  title: {
    jsonValue: {
      value: 'Articles Page',
    } as Field<string>,
  } as GqlFieldString,
  navigationTitle: {
    jsonValue: {
      value: 'Articles',
    } as Field<string>,
  } as GqlFieldString,
  url: {
    href: '/articles',
    text: 'Articles',
    linktype: 'internal',
  },
};

export const mockAncestorTechnology = {
  name: 'Technology',
  title: {
    jsonValue: {
      value: 'Technology Category',
    } as Field<string>,
  } as GqlFieldString,
  navigationTitle: {
    jsonValue: {
      value: 'Tech',
    } as Field<string>,
  } as GqlFieldString,
  url: {
    href: '/articles/technology',
    text: 'Technology',
    linktype: 'internal',
  },
};

export const mockAncestorWithoutNavigationTitle = {
  name: 'No Nav Title',
  title: {
    jsonValue: {
      value: 'Page Without Nav Title',
    } as Field<string>,
  } as GqlFieldString,
  navigationTitle: {
    jsonValue: {
      value: '', // Empty string instead of null
    } as Field<string>,
  } as GqlFieldString,
  url: {
    href: '/page',
    text: 'Page',
    linktype: 'internal',
  },
};

export const mockAncestorWithoutUrl = {
  name: 'No URL',
  title: {
    jsonValue: {
      value: 'Page Without URL',
    } as Field<string>,
  } as GqlFieldString,
  navigationTitle: {
    jsonValue: {
      value: 'No URL',
    } as Field<string>,
  } as GqlFieldString,
  url: {
    href: '',
    text: '',
    linktype: '',
  },
};

// Mock fields
export const mockFieldsDefault = {
  data: {
    datasource: {
      ancestors: [mockAncestorHome, mockAncestorArticles, mockAncestorTechnology],
      name: 'Current Page Title',
    },
  },
};

export const mockFieldsWithLongName = {
  data: {
    datasource: {
      ancestors: [mockAncestorHome],
      name: 'This is a very long page title that should be truncated to fit within 25 characters',
    },
  },
};

export const mockFieldsWithoutAncestors = {
  data: {
    datasource: {
      ancestors: undefined as BreadcrumbsPage[] | undefined, // undefined instead of empty array
      name: 'Current Page',
    },
  },
};

export const mockFieldsWithSingleAncestor = {
  data: {
    datasource: {
      ancestors: [mockAncestorHome],
      name: 'Current Page',
    },
  },
};

export const mockFieldsWithMixedTitles = {
  data: {
    datasource: {
      ancestors: [
        mockAncestorHome,
        mockAncestorWithoutNavigationTitle,
        mockAncestorWithoutUrl,
      ],
      name: 'Current Page',
    },
  },
};

export const mockFieldsEmptyAncestors = {
  data: {
    datasource: {
      ancestors: undefined as BreadcrumbsPage[] | undefined, // undefined instead of empty array
      name: 'Current Page',
    },
  },
};

// Mock page
const mockPage: Page = {
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

// Mock rendering
const mockRendering: ComponentRendering = {
  componentName: 'Breadcrumbs',
} as ComponentRendering;

// Type for Breadcrumbs fields
type BreadcrumbsFieldsType = {
  data: {
    datasource: {
      ancestors?: BreadcrumbsPage[];
      name: string;
    };
  };
};

// Complete props combinations
export const defaultProps = {
  params: {},
  fields: mockFieldsDefault,
  rendering: mockRendering,
  page: mockPage,
};

export const propsWithLongName = {
  params: {},
  fields: mockFieldsWithLongName,
  rendering: mockRendering,
  page: mockPage,
};

export const propsWithoutAncestors = {
  params: {},
  fields: mockFieldsWithoutAncestors,
  rendering: mockRendering,
  page: mockPage,
};

export const propsWithSingleAncestor = {
  params: {},
  fields: mockFieldsWithSingleAncestor,
  rendering: mockRendering,
  page: mockPage,
};

export const propsWithMixedTitles = {
  params: {},
  fields: mockFieldsWithMixedTitles,
  rendering: mockRendering,
  page: mockPage,
};

export const propsEmptyAncestors = {
  params: {},
  fields: mockFieldsEmptyAncestors,
  rendering: mockRendering,
  page: mockPage,
};

export const propsWithoutFields = {
  params: {},
  fields: null as BreadcrumbsFieldsType | null,
  rendering: mockRendering,
  page: mockPage,
};

