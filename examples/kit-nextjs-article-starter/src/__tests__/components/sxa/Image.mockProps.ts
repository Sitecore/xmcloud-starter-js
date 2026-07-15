import { ImageField, LinkField, Field, Page, ComponentRendering, ComponentParams } from '@sitecore-content-sdk/nextjs';

// Mock page data
export const mockPage = {
  mode: {
    isEditing: false,
    isPreview: false,
    isNormal: true,
    name: 'normal' as const,
    designLibrary: { isVariantGeneration: false },
    isDesignLibrary: false,
  },
  layout: { sitecore: { context: {}, route: null } },
  locale: 'en',
} as unknown as Page;

export const mockPageEditing = {
  ...mockPage,
  mode: {
    ...mockPage.mode,
    isEditing: true,
    isNormal: false,
    name: 'edit' as const,
  },
} as unknown as Page;

export const mockRendering = {} as ComponentRendering;

// Mock image field data
export const mockImageField: ImageField = {
  value: {
    src: '/test-image.jpg',
    alt: 'Test Image',
    width: 800,
    height: 600,
  },
};

export const mockImageFieldWithoutAlt: ImageField = {
  value: {
    src: '/test-image.jpg',
    alt: '',
    width: 800,
    height: 600,
  },
};

export const mockImageFieldEmpty: ImageField = {
  value: undefined,
};

// Mock link field data
export const mockLinkField: LinkField = {
  value: {
    href: '/test-link',
    title: 'Test Link',
    querystring: '',
  },
};

export const mockLinkFieldEmpty: LinkField = {
  value: undefined as unknown as LinkField['value'],
};

// Mock fields data
export const mockFields = {
  Image: mockImageField,
  ImageCaption: {
    value: 'Test Image Caption',
    editable: 'Test Image Caption',
  } as Field<string>,
  TargetUrl: mockLinkField,
};

export const mockFieldsWithoutLink = {
  Image: mockImageField,
  ImageCaption: {
    value: 'Test Image Caption',
    editable: 'Test Image Caption',
  } as Field<string>,
  TargetUrl: mockLinkFieldEmpty,
};

export const mockFieldsWithEmptyImage = {
  Image: mockImageFieldEmpty,
  ImageCaption: {
    value: 'Test Image Caption',
    editable: 'Test Image Caption',
  } as Field<string>,
  TargetUrl: mockLinkField,
};

export const mockFieldsWithoutAlt = {
  Image: mockImageFieldWithoutAlt,
  ImageCaption: {
    value: 'Test Image Caption',
    editable: 'Test Image Caption',
  } as Field<string>,
  TargetUrl: mockLinkField,
};

// Mock params data
export const mockParams: ComponentParams = {
  styles: 'custom-image-style',
  RenderingIdentifier: 'image-rendering-id',
};

export const mockParamsWithoutStyles: ComponentParams = {
  styles: '',
  RenderingIdentifier: 'image-rendering-id',
};

export const mockParamsWithoutId: ComponentParams = {
  styles: 'custom-image-style',
  RenderingIdentifier: '',
};

// Complete props combinations
export const defaultProps = {
  rendering: mockRendering,
  params: mockParams,
  page: mockPage,
  fields: mockFields,
};

export const propsWithoutStyles = {
  rendering: mockRendering,
  params: mockParamsWithoutStyles,
  page: mockPage,
  fields: mockFields,
};

export const propsWithoutId = {
  rendering: mockRendering,
  params: mockParamsWithoutId,
  page: mockPage,
  fields: mockFields,
};

export const propsWithoutLink = {
  rendering: mockRendering,
  params: mockParams,
  page: mockPage,
  fields: mockFieldsWithoutLink,
};

export const propsWithEmptyImage = {
  rendering: mockRendering,
  params: mockParams,
  page: mockPage,
  fields: mockFieldsWithEmptyImage,
};

export const propsWithoutAlt = {
  rendering: mockRendering,
  params: mockParams,
  page: mockPage,
  fields: mockFieldsWithoutAlt,
};

export const propsEditing = {
  rendering: mockRendering,
  params: mockParams,
  page: mockPageEditing,
  fields: mockFields,
};


