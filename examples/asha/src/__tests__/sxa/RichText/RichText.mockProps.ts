/**
 * Test fixtures and mock data for RichText component
 */

import type { RichTextProps } from 'components/sxa/RichText';
import { mockPage } from '../../test-utils/mockPage';

/**
 * Base mock data for RichText component
 */
export const mockRichTextData = {
  basicHtml: {
    value: '<p>This is <strong>rich text</strong> content</p>',
  },
  complexHtml: {
    value: `
      <div>
        <h2>Heading</h2>
        <p>Paragraph with <a href="/link">link</a></p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </div>
    `,
  },
  specialCharacters: {
    value: '<p>Price: $99.99 &amp; Free Shipping</p>',
  },
  styledText: {
    value: '<p style="color: red;">Styled text</p>',
  },
  emptyString: {
    value: '',
  },
  headingContent: {
    value: '<h2>Section Title</h2><p>Content</p>',
  },
  linkWithAttributes: {
    value: '<a href="/page" title="Go to page">Click here</a>',
  },
};

/**
 * Default props for RichText component testing
 */
export const defaultRichTextProps: RichTextProps = {
  fields: {
    Text: mockRichTextData.basicHtml,
  },
  params: {
    RenderingIdentifier: 'richtext-1',
    styles: 'custom-styles',
  },
  rendering: {
    componentName: 'RichText',
  },
  page: mockPage,
};

/**
 * Props with null fields (editing mode placeholder)
 */
export const richTextPropsNullFields: RichTextProps = {
  ...defaultRichTextProps,
  fields: null as unknown as RichTextProps['fields'],
};

/**
 * Props with empty field object
 */
export const richTextPropsEmptyField: RichTextProps = {
  ...defaultRichTextProps,
  fields: {} as unknown as RichTextProps['fields'],
};

/**
 * Props with empty string value
 */
export const richTextPropsEmptyValue: RichTextProps = {
  ...defaultRichTextProps,
  fields: {
    Text: mockRichTextData.emptyString,
  },
};

/**
 * Props without RenderingIdentifier
 */
export const richTextPropsNoId: RichTextProps = {
  ...defaultRichTextProps,
  params: {
    styles: 'test-styles',
  },
};

/**
 * Props without custom styles
 */
export const richTextPropsNoStyles: RichTextProps = {
  ...defaultRichTextProps,
  params: {
    RenderingIdentifier: 'richtext-2',
  },
};

/**
 * Props with multiple CSS classes
 */
export const richTextPropsMultipleStyles: RichTextProps = {
  ...defaultRichTextProps,
  params: {
    RenderingIdentifier: 'richtext-3',
    styles: 'style-1 style-2 style-3',
  },
};

/**
 * Props with complex HTML
 */
export const richTextPropsComplexHtml: RichTextProps = {
  ...defaultRichTextProps,
  fields: {
    Text: mockRichTextData.complexHtml,
  },
};

/**
 * Props with special characters
 */
export const richTextPropsSpecialChars: RichTextProps = {
  ...defaultRichTextProps,
  fields: {
    Text: mockRichTextData.specialCharacters,
  },
};

/**
 * Props with inline styles
 */
export const richTextPropsStyledText: RichTextProps = {
  ...defaultRichTextProps,
  fields: {
    Text: mockRichTextData.styledText,
  },
};

/**
 * Props with heading content
 */
export const richTextPropsHeadingContent: RichTextProps = {
  ...defaultRichTextProps,
  fields: {
    Text: mockRichTextData.headingContent,
  },
};

/**
 * Props with link and attributes
 */
export const richTextPropsLinkContent: RichTextProps = {
  ...defaultRichTextProps,
  fields: {
    Text: mockRichTextData.linkWithAttributes,
  },
};
