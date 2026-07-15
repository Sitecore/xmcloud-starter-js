import { Field, ImageField, LinkField, Page, ComponentRendering, PageMode } from '@sitecore-content-sdk/nextjs';

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

export const mockPage = {
  page: mockPageBase,
};

export const mockPageEditingData = {
  page: mockPageEditing,
};

// Mock images
export const mockImageField: ImageField = {
  value: {
    src: '/test-article-hero.jpg',
    alt: 'Article Hero Image',
    width: 1200,
    height: 800,
  },
};

// Mock text fields
export const mockTitleField: Field<string> = {
  value: 'The Future of Web Development',
};

export const mockEyebrowField: Field<string> = {
  value: 'Technology',
};

export const mockReadTimeField: Field<string> = {
  value: '5 min read',
};

export const mockDisplayDateField: Field<string> = {
  value: '2024-01-15',
};

// Type definitions for author
// Note: These types are simplified for test mocks and may not exactly match the component's internal types
type PersonItem = {
  personProfileImage?: ImageField;
  personFirstName: Field<string>;
  personLastName: Field<string>;
  personJobTitle?: Field<string>;
  personBio?: Field<string>;
  personLinkedIn?: LinkField;
};

type AuthorReferenceField = {
  id: string;
  name: string;
  url?: string;
  displayName?: string;
  fields: PersonItem;
};

// Mock author
export const mockAuthor: AuthorReferenceField = {
  id: 'author-1',
  name: 'John Doe',
  url: '/authors/john-doe',
  fields: {
    personProfileImage: {
      value: {
        src: '/test-author.jpg',
        alt: 'John Doe',
        width: 200,
        height: 200,
      },
    },
    personFirstName: {
      value: 'John',
    },
    personLastName: {
      value: 'Doe',
    },
    personJobTitle: {
      value: 'Senior Developer',
    },
    personBio: {
      value: 'Experienced web developer',
    },
    personLinkedIn: {
      value: {
        href: 'https://linkedin.com/in/johndoe',
        text: 'LinkedIn',
        title: 'LinkedIn',
        target: '',
        linktype: 'external',
      },
    },
  },
};

export const mockAuthorWithoutImage: AuthorReferenceField = {
  ...mockAuthor,
  fields: {
    ...mockAuthor.fields,
    personProfileImage: undefined,
  },
};

export const mockAuthorWithoutJobTitle: AuthorReferenceField = {
  ...mockAuthor,
  fields: {
    ...mockAuthor.fields,
    personJobTitle: undefined,
  },
};

// Mock fields
export const mockFields = {
  data: {
    datasource: {
      imageRequired: {
        jsonValue: mockImageField,
      },
      eyebrowOptional: {
        jsonValue: mockEyebrowField,
      },
    },
    externalFields: {
      pageHeaderTitle: {
        jsonValue: mockTitleField,
      },
      pageReadTime: {
        jsonValue: mockReadTimeField,
      },
      pageDisplayDate: {
        jsonValue: mockDisplayDateField,
      },
      pageAuthor: {
        jsonValue: mockAuthor,
      },
    },
  },
};

export const mockFieldsWithoutEyebrow = {
  data: {
    datasource: {
      imageRequired: {
        jsonValue: mockImageField,
      },
    },
    externalFields: mockFields.data.externalFields,
  },
};

export const mockFieldsWithoutAuthor = {
  data: {
    datasource: mockFields.data.datasource,
    externalFields: {
      pageHeaderTitle: {
        jsonValue: mockTitleField,
      },
      pageReadTime: {
        jsonValue: mockReadTimeField,
      },
      pageDisplayDate: {
        jsonValue: mockDisplayDateField,
      },
    },
  },
};

export const mockFieldsWithoutReadTime = {
  data: {
    datasource: mockFields.data.datasource,
    externalFields: {
      pageHeaderTitle: {
        jsonValue: mockTitleField,
      },
      pageDisplayDate: {
        jsonValue: mockDisplayDateField,
      },
      pageAuthor: {
        jsonValue: mockAuthor,
      },
    },
  },
};

export const mockFieldsWithoutDate = {
  data: {
    datasource: mockFields.data.datasource,
    externalFields: {
      pageHeaderTitle: {
        jsonValue: mockTitleField,
      },
      pageReadTime: {
        jsonValue: mockReadTimeField,
      },
      pageAuthor: {
        jsonValue: mockAuthor,
      },
    },
  },
};

export const mockFieldsWithoutImage = {
  data: {
    datasource: {
      eyebrowOptional: {
        jsonValue: mockEyebrowField,
      },
    },
    externalFields: mockFields.data.externalFields,
  },
};

export const mockFieldsMinimal = {
  data: {
    datasource: {
      imageRequired: {
        jsonValue: mockImageField,
      },
    },
    externalFields: {
      pageHeaderTitle: {
        jsonValue: mockTitleField,
      },
    },
  },
};

// Mock params
export const mockParams = {
  styles: 'custom-header-style',
};

// Mock rendering
export const mockRendering: ComponentRendering = {
  componentName: 'ArticleHeader',
} as ComponentRendering;

// Type for ArticleHeader fields
type ArticleHeaderFieldsType = {
  data: {
    datasource: {
      imageRequired?: { jsonValue: ImageField };
      eyebrowOptional?: { jsonValue: Field<string> };
    };
    externalFields: {
      pageHeaderTitle: { jsonValue: Field<string> };
      pageReadTime?: { jsonValue: Field<string> };
      pageDisplayDate?: { jsonValue: Field<string> };
      pageAuthor?: { jsonValue: AuthorReferenceField };
    };
  };
};

// Complete props combinations
export const defaultProps = {
  params: mockParams,
  fields: mockFields,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutEyebrow = {
  params: mockParams,
  fields: mockFieldsWithoutEyebrow,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutAuthor = {
  params: mockParams,
  fields: mockFieldsWithoutAuthor,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutReadTime = {
  params: mockParams,
  fields: mockFieldsWithoutReadTime,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutDate = {
  params: mockParams,
  fields: mockFieldsWithoutDate,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutImage = {
  params: mockParams,
  fields: mockFieldsWithoutImage,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsMinimal = {
  params: mockParams,
  fields: mockFieldsMinimal,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutFields = {
  params: mockParams,
  fields: null as ArticleHeaderFieldsType | null,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithAuthorNoImage = {
  params: mockParams,
  fields: {
    data: {
      datasource: mockFields.data.datasource,
      externalFields: {
        ...mockFields.data.externalFields,
        pageAuthor: {
          jsonValue: mockAuthorWithoutImage,
        },
      },
    },
  },
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithAuthorNoJobTitle = {
  params: mockParams,
  fields: {
    data: {
      datasource: mockFields.data.datasource,
      externalFields: {
        ...mockFields.data.externalFields,
        pageAuthor: {
          jsonValue: mockAuthorWithoutJobTitle,
        },
      },
    },
  },
  rendering: mockRendering,
  page: mockPageBase,
};


