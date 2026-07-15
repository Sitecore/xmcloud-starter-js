import { Field, Page, PageMode, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

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
  componentName: 'ContentBlock',
};

// Mock params data
export const mockParams = {
  RenderingIdentifier: 'content-block-rendering-id',
  styles: 'custom-content-style',
};

// Mock fields data
export const mockFields = {
  heading: {
    value: 'Test Heading',
    editable: 'Test Heading',
  } as Field<string>,
  content: {
    value: '<p>This is test content with <strong>bold</strong> text.</p>',
    editable: '<p>This is test content with <strong>bold</strong> text.</p>',
  } as Field<string>,
};

export const mockFieldsWithEmptyHeading = {
  heading: {
    value: '',
    editable: '',
  } as Field<string>,
  content: {
    value: '<p>This is test content.</p>',
    editable: '<p>This is test content.</p>',
  } as Field<string>,
};

export const mockFieldsWithEmptyContent = {
  heading: {
    value: 'Test Heading',
    editable: 'Test Heading',
  } as Field<string>,
  content: {
    value: '',
    editable: '',
  } as Field<string>,
};

export const mockFieldsWithComplexContent = {
  heading: {
    value: 'Complex Content Heading',
    editable: 'Complex Content Heading',
  } as Field<string>,
  content: {
    value: `
      <h2>Subheading</h2>
      <p>Paragraph with <em>italic</em> and <strong>bold</strong> text.</p>
      <ul>
        <li>List item 1</li>
        <li>List item 2</li>
      </ul>
      <blockquote>This is a quote</blockquote>
    `,
    editable: `
      <h2>Subheading</h2>
      <p>Paragraph with <em>italic</em> and <strong>bold</strong> text.</p>
      <ul>
        <li>List item 1</li>
        <li>List item 2</li>
      </ul>
      <blockquote>This is a quote</blockquote>
    `,
  } as Field<string>,
};

// Complete props combinations
export const defaultProps: ComponentProps & { fields: typeof mockFields } = {
  rendering: mockRendering,
  params: mockParams,
  fields: mockFields,
  page: mockPage,
};

export const propsWithEmptyHeading: ComponentProps & { fields: typeof mockFieldsWithEmptyHeading } = {
  rendering: mockRendering,
  params: mockParams,
  fields: mockFieldsWithEmptyHeading,
  page: mockPage,
};

export const propsWithEmptyContent: ComponentProps & { fields: typeof mockFieldsWithEmptyContent } = {
  rendering: mockRendering,
  params: mockParams,
  fields: mockFieldsWithEmptyContent,
  page: mockPage,
};

export const propsWithComplexContent: ComponentProps & { fields: typeof mockFieldsWithComplexContent } = {
  rendering: mockRendering,
  params: mockParams,
  fields: mockFieldsWithComplexContent,
  page: mockPage,
};

