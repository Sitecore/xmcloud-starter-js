import {
  ComponentRendering,
  Page,
  PageMode,
  RichTextField,
} from '@sitecore-content-sdk/nextjs';

// Mock rich text field with content
export const mockContentField: RichTextField = {
  value: '<p>This is page content</p><h2>Heading</h2><ul><li>Item 1</li><li>Item 2</li></ul>',
};

export const mockEmptyContentField: RichTextField = {
  value: '',
};

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
      context: {},
      route: {
        name: 'page-content-route',
        fields: {
          Content: {
            value: '<p>Content from route</p>',
          },
        },
        placeholders: {},
      },
    },
    locale: 'en',
    mode: {
      isEditing: false,
      isPreview: false,
    },
  } as unknown as Page['layout'],
  locale: 'en',
};

const mockPageWithoutContent: Page = {
  ...mockPage,
  layout: {
    sitecore: {
      context: {},
      route: {
        name: 'page-content-route',
        fields: {},
        placeholders: {},
      },
    },
  } as unknown as Page['layout'],
};

export const mockSitecoreContext = {
  page: mockPage,
};

export const mockSitecoreContextWithoutContent = {
  page: mockPageWithoutContent,
};

const mockRendering: ComponentRendering = {
  componentName: 'PageContent',
  dataSource: '',
  params: {
    Styles: 'custom-page-content-style',
    RenderingIdentifier: 'page-content-id',
  },
};

// Default props with content field
export const defaultProps = {
  rendering: mockRendering,
  page: mockPage,
  params: {
    Styles: 'custom-page-content-style',
    RenderingIdentifier: 'page-content-id',
  },
  fields: {
    Content: mockContentField,
  },
};

// Props with empty content
export const propsWithEmptyContent = {
  rendering: mockRendering,
  page: mockPage,
  params: {
    Styles: 'empty-content-style',
    RenderingIdentifier: 'empty-content-id',
  },
  fields: {
    Content: mockEmptyContentField,
  },
};

// Props without styles
export const propsWithoutStyles = {
  rendering: mockRendering,
  page: mockPage,
  params: {
    Styles: '',
    RenderingIdentifier: 'no-style-id',
  },
  fields: {
    Content: mockContentField,
  },
};

// Props without RenderingIdentifier
export const propsWithoutId = {
  rendering: mockRendering,
  page: mockPage,
  params: {
    Styles: 'custom-style',
    RenderingIdentifier: '',
  },
  fields: {
    Content: mockContentField,
  },
};

// Props without fields (page has no route content for fallback tests)
export const propsWithoutFields = {
  rendering: mockRendering,
  page: mockPageWithoutContent,
  params: {
    Styles: 'no-fields-style',
    RenderingIdentifier: 'no-fields-id',
  },
  fields: undefined as unknown as typeof defaultProps.fields,
};

// Props without Content field (page has no route content for fallback tests)
export const propsWithoutContentField = {
  rendering: mockRendering,
  page: mockPageWithoutContent,
  params: {
    Styles: 'no-content-field',
    RenderingIdentifier: 'no-content-field-id',
  },
  fields: {} as unknown as typeof defaultProps.fields,
};

// Props with undefined params
export const propsWithUndefinedParams = {
  rendering: mockRendering,
  page: mockPage,
  params: {} as typeof defaultProps.params,
  fields: {
    Content: mockContentField,
  },
};

// Props with null content field
export const propsWithNullContent = {
  rendering: mockRendering,
  page: mockPageWithoutContent,
  params: {
    Styles: 'null-content',
    RenderingIdentifier: 'null-content-id',
  },
  fields: {
    Content: null as unknown as RichTextField,
  },
};
