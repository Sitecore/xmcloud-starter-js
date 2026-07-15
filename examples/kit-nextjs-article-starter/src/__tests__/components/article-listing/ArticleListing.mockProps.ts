import { Field, ImageField, LinkField, Page, ComponentRendering, PageMode } from '@sitecore-content-sdk/nextjs';
import type { ReferenceField } from '@/types/ReferenceField.props';
import type { AuthorReferenceField } from '@/types/AuthorTaxonomy.props';

// Type definition matching ArticleListing component
// Note: Component requires pageThumbnail as ImageField, but we use optional for test flexibility
type ArticleItem = {
  pageTitle: Field<string>;
  pageSummary: Field<string>;
  pageThumbnail: ImageField;
  pageReadTime: Field<string>;
  taxAuthor: AuthorReferenceField;
};

type ArticleItemReferenceFieldType = ReferenceField & {
  fields: ArticleItem;
};

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

// Solterra demo: Article 1
export const mockArticle1 = {
  url: '/articles/article-1',
  id: 'article-1',
  name: 'Article 1',
  fields: {
    pageTitle: {
      value: 'Introduction to React Hooks',
      editable: 'Introduction to React Hooks',
    } as Field<string>,
    pageSummary: {
      value: 'Learn the fundamentals of React Hooks and how they can improve your code.',
      editable: 'Learn the fundamentals of React Hooks',
    } as Field<string>,
    pageThumbnail: {
      value: {
        src: '/article-1-thumb.jpg',
        alt: 'Article 1 Thumbnail',
        width: 800,
        height: 600,
      },
    } as ImageField,
    pageReadTime: {
      value: '8 min read',
      editable: '8 min read',
    } as Field<string>,
    taxAuthor: {
      id: 'author-1',
      name: 'Jane Smith',
      fields: {
        personFirstName: {
          value: 'Jane',
        } as Field<string>,
        personLastName: {
          value: 'Smith',
        } as Field<string>,
        personProfileImage: {
          value: {
            src: '/jane-smith.jpg',
            alt: 'Jane Smith',
          },
        } as ImageField,
      },
    },
  },
};

// Solterra demo: QA Article 1
export const mockQaArticle1 = {
  url: '/articles/qa-article-1',
  id: 'qa-article-1',
  name: 'QA Article 1',
  fields: {
    pageTitle: {
      value: 'Partners in Sustainability',
      editable: 'Partners in Sustainability',
    } as Field<string>,
    pageSummary: {
      value: 'How Solterra & Co. works with partners to advance sustainable wellness.',
      editable: 'How Solterra & Co. works with partners',
    } as Field<string>,
    pageThumbnail: {
      value: {
        src: '/qa-article-1-thumb.jpg',
        alt: 'QA Article 1 Thumbnail',
        width: 800,
        height: 600,
      },
    } as ImageField,
    pageReadTime: {
      value: '4 min read',
      editable: '4 min read',
    } as Field<string>,
    taxAuthor: {
      id: 'author-2',
      name: 'John Doe',
      fields: {
        personFirstName: {
          value: 'John',
        } as Field<string>,
        personLastName: {
          value: 'Doe',
        } as Field<string>,
        personProfileImage: {
          value: {
            src: '/john-doe.jpg',
            alt: 'John Doe',
          },
        } as ImageField,
      },
    },
  },
};

// Extra article for tests that cover the regular (3+) article grid layout
export const mockArticleAdditional = {
  url: '/articles/article-additional',
  id: 'article-additional',
  name: 'Article Additional',
  fields: {
    pageTitle: {
      value: 'CSS Grid Layout Guide',
      editable: 'CSS Grid Layout Guide',
    } as Field<string>,
    pageSummary: {
      value: 'Master CSS Grid and create responsive layouts with ease.',
      editable: 'Master CSS Grid',
    } as Field<string>,
    pageThumbnail: {
      value: {
        src: '/article-additional-thumb.jpg',
        alt: 'Article Additional Thumbnail',
        width: 800,
        height: 600,
      },
    } as ImageField,
    pageReadTime: {
      value: '6 min read',
      editable: '6 min read',
    } as Field<string>,
    taxAuthor: {
      id: 'author-3',
      name: 'Sarah Johnson',
      fields: {
        personFirstName: {
          value: 'Sarah',
        } as Field<string>,
        personLastName: {
          value: 'Johnson',
        } as Field<string>,
        personProfileImage: undefined,
      },
    },
  },
};

// Mock link field
export const mockLinkField: LinkField = {
  value: {
    href: '/all-articles',
    text: 'View All Articles',
    title: 'View All Articles',
    linktype: 'internal',
  },
};

// Mock fields — matches Solterra Landing Page Article Listing (Article 1 + QA Article 1)
export const mockFields = {
  titleOptional: {
    value: 'Latest Articles',
    editable: 'Latest Articles',
  } as Field<string>,
  descriptionOptional: {
    value: 'Discover our latest insights and tutorials',
    editable: 'Discover our latest insights and tutorials',
  } as Field<string>,
  linkOptional: mockLinkField,
  featuredContent: [mockArticle1, mockQaArticle1] as ArticleItemReferenceFieldType[],
};

export const mockFieldsThreeArticles = {
  titleOptional: mockFields.titleOptional,
  descriptionOptional: mockFields.descriptionOptional,
  linkOptional: mockLinkField,
  featuredContent: [mockArticle1, mockQaArticle1, mockArticleAdditional] as ArticleItemReferenceFieldType[],
};

export const mockFieldsWithoutTitle = {
  linkOptional: mockLinkField,
  featuredContent: [mockArticle1, mockQaArticle1] as ArticleItemReferenceFieldType[],
};

export const mockFieldsWithoutDescription = {
  titleOptional: mockFields.titleOptional,
  linkOptional: mockLinkField,
  featuredContent: [mockArticle1, mockQaArticle1] as ArticleItemReferenceFieldType[],
};

export const mockFieldsWithoutLink = {
  titleOptional: mockFields.titleOptional,
  descriptionOptional: mockFields.descriptionOptional,
  featuredContent: [mockArticle1, mockQaArticle1] as ArticleItemReferenceFieldType[],
};

export const mockFieldsTwoArticles = {
  titleOptional: mockFields.titleOptional,
  descriptionOptional: mockFields.descriptionOptional,
  linkOptional: mockLinkField,
  featuredContent: [mockArticle1, mockQaArticle1] as ArticleItemReferenceFieldType[],
};

export const mockFieldsOneArticle = {
  titleOptional: mockFields.titleOptional,
  featuredContent: [mockArticle1] as ArticleItemReferenceFieldType[],
};

export const mockFieldsNoArticles = {
  titleOptional: mockFields.titleOptional,
  descriptionOptional: mockFields.descriptionOptional,
  linkOptional: mockLinkField,
  featuredContent: [] as ArticleItemReferenceFieldType[],
};

// Mock params
export const mockParams = {
  styles: 'custom-listing-style',
};

// Mock rendering
export const mockRendering: ComponentRendering = {
  componentName: 'ArticleListing',
} as ComponentRendering;

// Complete props combinations
export const defaultProps = {
  params: mockParams,
  fields: mockFields,
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsThreeArticles = {
  params: mockParams,
  fields: mockFieldsThreeArticles,
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutTitle = {
  params: mockParams,
  fields: mockFieldsWithoutTitle,
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutDescription = {
  params: mockParams,
  fields: mockFieldsWithoutDescription,
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsWithoutLink = {
  params: mockParams,
  fields: mockFieldsWithoutLink,
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsTwoArticles = {
  params: mockParams,
  fields: mockFieldsTwoArticles,
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsOneArticle = {
  params: mockParams,
  fields: mockFieldsOneArticle,
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsNoArticles = {
  params: mockParams,
  fields: mockFieldsNoArticles,
  isPageEditing: false,
  rendering: mockRendering,
  page: mockPageBase,
};

export const propsEditing = {
  params: mockParams,
  fields: mockFields,
  isPageEditing: true,
  rendering: mockRendering,
  page: mockPageEditing,
};
