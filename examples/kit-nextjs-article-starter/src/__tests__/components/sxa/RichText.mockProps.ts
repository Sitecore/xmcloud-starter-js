import { Field } from '@sitecore-content-sdk/nextjs';

// Type for RichText fields
interface RichTextFields {
  Text: Field<string>;
}

// Mock text field with HTML content
export const mockTextField: Field<string> = {
  value: '<p>This is rich text content</p><h2>Heading</h2><ul><li>Item 1</li><li>Item 2</li></ul>',
};

export const mockSimpleTextField: Field<string> = {
  value: '<p>Simple text</p>',
};

export const mockEmptyTextField: Field<string> = {
  value: '',
};

// Default props with text field
export const defaultProps = {
  params: {
    styles: 'custom-rich-text-style',
    RenderingIdentifier: 'rich-text-id',
  },
  fields: {
    Text: mockTextField,
  },
};

// Props with simple text
export const propsWithSimpleText = {
  params: {
    styles: 'simple-text-style',
    RenderingIdentifier: 'simple-text-id',
  },
  fields: {
    Text: mockSimpleTextField,
  },
};

// Props with empty text
export const propsWithEmptyText = {
  params: {
    styles: 'empty-text-style',
    RenderingIdentifier: 'empty-text-id',
  },
  fields: {
    Text: mockEmptyTextField,
  },
};

// Props without styles
export const propsWithoutStyles = {
  params: {
    styles: '',
    RenderingIdentifier: 'no-style-id',
  },
  fields: {
    Text: mockTextField,
  },
};

// Props with trailing spaces in styles
export const propsWithTrailingSpaces = {
  params: {
    styles: 'custom-style   ',
    RenderingIdentifier: 'trailing-space-id',
  },
  fields: {
    Text: mockTextField,
  },
};

// Props without RenderingIdentifier
export const propsWithoutId = {
  params: {
    styles: 'custom-style',
    RenderingIdentifier: '',
  },
  fields: {
    Text: mockTextField,
  },
};

// Props without fields
export const propsWithoutFields = {
  params: {
    styles: 'no-fields-style',
    RenderingIdentifier: 'no-fields-id',
  },
  fields: undefined as unknown as typeof defaultProps.fields,
};

// Props without Text field
export const propsWithoutTextField = {
  params: {
    styles: 'no-text-field',
    RenderingIdentifier: 'no-text-field-id',
  },
  fields: {} as unknown as RichTextFields,
};

// Props with null fields
export const propsWithNullFields = {
  params: {
    styles: 'null-fields',
    RenderingIdentifier: 'null-fields-id',
  },
  fields: null as unknown as typeof defaultProps.fields,
};

// Props with null Text field
export const propsWithNullTextField = {
  params: {
    styles: 'null-text',
    RenderingIdentifier: 'null-text-id',
  },
  fields: {
    Text: null as unknown as Field<string>,
  },
};

// Props with undefined params
export const propsWithUndefinedParams = {
  params: {} as typeof defaultProps.params,
  fields: {
    Text: mockTextField,
  },
};

// Props with undefined RenderingIdentifier
export const propsWithUndefinedId = {
  params: {
    styles: 'custom-style',
    RenderingIdentifier: undefined,
  } as unknown as typeof defaultProps.params,
  fields: {
    Text: mockTextField,
  },
};

