import { Page, PageMode, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { RichTextBlockProps } from '@/components/rich-text-block/rich-text-block.props';

// Mock page object
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

// Mock rendering data
const mockRendering: ComponentRendering = {
  componentName: 'RichTextBlock',
};

// Mock params data
export const mockParams: RichTextBlockProps['params'] = {
  RenderingIdentifier: 'test-rendering-id',
  styles: 'custom-styles',
};

// Mock params without styles
export const mockParamsWithoutStyles: RichTextBlockProps['params'] = {
  RenderingIdentifier: 'test-rendering-id',
  // styles is optional, so we can omit it
} as RichTextBlockProps['params'];

// Mock params without ID
export const mockParamsWithoutId: RichTextBlockProps['params'] = {
  styles: 'custom-styles',
  // RenderingIdentifier is optional, so we can omit it
} as RichTextBlockProps['params'];

// Mock params with multiple styles
export const mockParamsWithMultipleStyles = {
  RenderingIdentifier: 'test-rendering-id',
  styles: 'custom-style-1 custom-style-2',
};

// Mock fields data
export const mockFields = {
  text: {
    value: '<p>This is a test rich text content</p>',
  },
};

// Mock fields with empty text
export const mockFieldsWithEmptyText = {
  text: {
    value: '',
  },
};

// Mock fields with undefined text
export const mockFieldsWithUndefinedText: RichTextBlockProps['fields'] = {
  text: {
    value: undefined as unknown as string,
  },
};

// Mock fields with complex HTML content
export const mockFieldsWithComplexHtml: RichTextBlockProps['fields'] = {
  text: {
    value: `
      <h1>Title</h1>
      <p>Paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
      <ul>
        <li>List item 1</li>
        <li>List item 2</li>
      </ul>
    `,
  },
};

// Complete mock props for different scenarios
export const defaultProps: RichTextBlockProps = {
  fields: mockFields,
  rendering: mockRendering,
  params: mockParams,
  page: mockPage,
};

export const propsWithoutFields: RichTextBlockProps = {
  fields: undefined as unknown as RichTextBlockProps['fields'],
  rendering: mockRendering,
  params: mockParams,
  page: mockPage,
};

export const propsWithNullFields: RichTextBlockProps = {
  fields: null as unknown as RichTextBlockProps['fields'],
  rendering: mockRendering,
  params: mockParams,
  page: mockPage,
};

export const propsWithoutStyles: RichTextBlockProps = {
  fields: mockFields,
  rendering: mockRendering,
  params: mockParamsWithoutStyles,
  page: mockPage,
};

export const propsWithoutId: RichTextBlockProps = {
  fields: mockFields,
  rendering: mockRendering,
  params: mockParamsWithoutId,
  page: mockPage,
};

export const propsWithEmptyText: RichTextBlockProps = {
  fields: mockFieldsWithEmptyText,
  rendering: mockRendering,
  params: mockParams,
  page: mockPage,
};

export const propsWithUndefinedText: RichTextBlockProps = {
  fields: mockFieldsWithUndefinedText,
  rendering: mockRendering,
  params: mockParams,
  page: mockPage,
};

export const propsWithComplexHtml: RichTextBlockProps = {
  fields: mockFieldsWithComplexHtml,
  rendering: mockRendering,
  params: mockParams,
  page: mockPage,
};

export const propsWithMultipleStyles: RichTextBlockProps = {
  fields: mockFields,
  rendering: mockRendering,
  params: mockParamsWithMultipleStyles,
  page: mockPage,
};

