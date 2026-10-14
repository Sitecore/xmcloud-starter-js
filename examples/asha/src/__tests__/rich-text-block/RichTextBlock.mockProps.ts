// Mock props for RichTextBlock component tests
import { Field } from '@sitecore-content-sdk/nextjs';
import { RichTextBlockProps } from '../../components/rich-text-block/rich-text-block.props';
import { mockPage } from '../test-utils/mockPage';

// Inline utility functions
const createMockField = <T>(value: T): Field<T> => ({ value }) as unknown as Field<T>;

// Default props with rich text content
export const defaultRichTextBlockProps: RichTextBlockProps = {
  params: {
    styles: 'custom-rich-text-styles',
    RenderingIdentifier: 'rich-text-block-1',
  },
  page: mockPage,
  fields: {
    text: createMockField(
      '<h2>Welcome to Our Platform</h2><p>This is a <strong>rich text</strong> block that supports HTML formatting including <em>emphasis</em>, <a href="/link">links</a>, and lists:</p><ul><li>First item</li><li>Second item</li><li>Third item with <code>code</code></li></ul><p>You can also include images and other media content.</p>'
    ),
  },
  rendering: {
    uid: 'test-rich-text-block-uid',
    componentName: 'RichTextBlock',
    dataSource: '',
  },
};

// Props with simple text content
export const richTextBlockPropsSimple: RichTextBlockProps = {
  params: {},
  page: mockPage,
  fields: {
    text: createMockField('<p>This is a simple paragraph of text without complex formatting.</p>'),
  },
  rendering: {
    uid: 'test-simple-uid',
    componentName: 'RichTextBlock',
    dataSource: '',
  },
};

// Props with minimal HTML
export const richTextBlockPropsMinimal: RichTextBlockProps = {
  params: {
    styles: 'minimal-styles',
  },
  page: mockPage,
  fields: {
    text: createMockField('Plain text without HTML tags'),
  },
  rendering: {
    uid: 'test-minimal-uid',
    componentName: 'RichTextBlock',
    dataSource: '',
  },
};

// Props with complex rich text
export const richTextBlockPropsComplex: RichTextBlockProps = {
  params: {
    styles: 'complex-formatting',
    RenderingIdentifier: 'complex-rich-text',
  },
  page: mockPage,
  fields: {
    text: createMockField(`
      <h1>Main Heading</h1>
      <h2>Subheading</h2>
      <p>This is a paragraph with <strong>bold text</strong>, <em>italic text</em>, and <u>underlined text</u>.</p>
      <blockquote>
        <p>This is a blockquote with important information.</p>
      </blockquote>
      <h3>List Examples</h3>
      <ul>
        <li>Unordered list item 1</li>
        <li>Unordered list item 2
          <ul>
            <li>Nested item</li>
            <li>Another nested item</li>
          </ul>
        </li>
      </ul>
      <ol>
        <li>Ordered list item 1</li>
        <li>Ordered list item 2</li>
      </ol>
      <p>Here's a <a href="https://example.com" target="_blank">link to external site</a> and some <code>inline code</code>.</p>
      <pre><code>
function example() {
  return "Hello, World!";
}
      </code></pre>
    `),
  },
  rendering: {
    uid: 'test-complex-uid',
    componentName: 'RichTextBlock',
    dataSource: '',
  },
};

// Props with empty content
export const richTextBlockPropsEmpty: RichTextBlockProps = {
  params: {
    styles: 'empty-content',
  },
  page: mockPage,
  fields: {
    text: createMockField(''),
  },
  rendering: {
    uid: 'test-empty-uid',
    componentName: 'RichTextBlock',
    dataSource: '',
  },
};

// Props with whitespace only
export const richTextBlockPropsWhitespace: RichTextBlockProps = {
  params: {},
  page: mockPage,
  fields: {
    text: createMockField('   \n\t  \n  '),
  },
  rendering: {
    uid: 'test-whitespace-uid',
    componentName: 'RichTextBlock',
    dataSource: '',
  },
};

// Props without fields
export const richTextBlockPropsNoFields: RichTextBlockProps = {
  params: {
    styles: 'no-fields',
  },
  page: mockPage,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: undefined as any,
  rendering: {
    uid: 'test-no-fields-uid',
    componentName: 'RichTextBlock',
    dataSource: '',
  },
};

// Props with styles but no RenderingIdentifier
export const richTextBlockPropsNoId: RichTextBlockProps = {
  params: {
    styles: 'styled-without-id',
  },
  page: mockPage,
  fields: {
    text: createMockField('<p>Content without rendering identifier.</p>'),
  },
  rendering: {
    uid: 'test-no-id-uid',
    componentName: 'RichTextBlock',
    dataSource: '',
  },
};

// Props with RenderingIdentifier but no styles
export const richTextBlockPropsIdOnly: RichTextBlockProps = {
  params: {
    RenderingIdentifier: 'id-only-block',
  },
  page: mockPage,
  fields: {
    text: createMockField('<p>Content with ID but no custom styles.</p>'),
  },
  rendering: {
    uid: 'test-id-only-uid',
    componentName: 'RichTextBlock',
    dataSource: '',
  },
};

// Props with styles that need trimming
export const richTextBlockPropsStylesWithSpaces: RichTextBlockProps = {
  params: {
    styles: 'styles-with-trailing-spaces   ',
    RenderingIdentifier: 'trimmed-styles',
  },
  page: mockPage,
  fields: {
    text: createMockField('<p>Content with styles that have trailing spaces.</p>'),
  },
  rendering: {
    uid: 'test-styles-spaces-uid',
    componentName: 'RichTextBlock',
    dataSource: '',
  },
};

// Props for testing HTML entities
export const richTextBlockPropsHtmlEntities: RichTextBlockProps = {
  params: {},
  page: mockPage,
  fields: {
    text: createMockField(
      '<p>Content with HTML entities: &lt;script&gt;alert("test");&lt;/script&gt; and &amp; &copy; 2023</p>'
    ),
  },
  rendering: {
    uid: 'test-html-entities-uid',
    componentName: 'RichTextBlock',
    dataSource: '',
  },
};

// Props with table content
export const richTextBlockPropsTable: RichTextBlockProps = {
  params: {
    styles: 'table-content',
  },
  page: mockPage,
  fields: {
    text: createMockField(`
      <table>
        <thead>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
            <th>Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Row 1, Col 1</td>
            <td>Row 1, Col 2</td>
            <td>Row 1, Col 3</td>
          </tr>
          <tr>
            <td>Row 2, Col 1</td>
            <td>Row 2, Col 2</td>
            <td>Row 2, Col 3</td>
          </tr>
        </tbody>
      </table>
    `),
  },
  rendering: {
    uid: 'test-table-uid',
    componentName: 'RichTextBlock',
    dataSource: '',
  },
};

// Props with image content
export const richTextBlockPropsWithImages: RichTextBlockProps = {
  params: {
    styles: 'image-content',
  },
  page: mockPage,
  fields: {
    text: createMockField(`
      <p>Here's an image:</p>
      <img src="/images/example.jpg" alt="Example image" width="300" height="200" />
      <p>And here's another paragraph after the image.</p>
    `),
  },
  rendering: {
    uid: 'test-images-uid',
    componentName: 'RichTextBlock',
    dataSource: '',
  },
};

// Props with custom CSS classes in content
export const richTextBlockPropsWithClasses: RichTextBlockProps = {
  params: {},
  page: mockPage,
  fields: {
    text: createMockField(`
      <p class="highlight">This paragraph has a custom CSS class.</p>
      <div class="callout-box">
        <h4>Callout Title</h4>
        <p>This is a callout box with custom styling.</p>
      </div>
    `),
  },
  rendering: {
    uid: 'test-classes-uid',
    componentName: 'RichTextBlock',
    dataSource: '',
  },
};
