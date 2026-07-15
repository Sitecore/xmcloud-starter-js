/**
 * Test fixtures and mock data for ContentBlock component
 */

import type { ComponentProps } from 'lib/component-props';
import { mockPage } from '../../test-utils/mockPage';

type ContentBlockProps = ComponentProps & {
  fields: {
    heading: { value: string };
    content: { value: string };
  };
};

/**
 * Base mock data for ContentBlock component
 */
export const mockContentBlockData = {
  basicHeading: {
    value: 'Sample Heading',
  },
  basicContent: {
    value: '<p>This is sample rich text content.</p>',
  },
  longHeading: {
    value: 'This is a very long heading that might be used for SEO purposes and testing',
  },
  complexContent: {
    value: `
      <div>
        <p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
        </ul>
        <p>Another paragraph with a <a href="/link">link</a>.</p>
      </div>
    `,
  },
  emptyHeading: {
    value: '',
  },
  emptyContent: {
    value: '',
  },
  specialCharsHeading: {
    value: 'Heading with & special <characters>',
  },
  specialCharsContent: {
    value: '<p>Content with &amp; &lt;special&gt; &quot;characters&quot;</p>',
  },
};

/**
 * Default props for ContentBlock component testing
 */
export const defaultContentBlockProps: ContentBlockProps = {
  params: {},
  rendering: {
    componentName: 'ContentBlock',
  },
  page: mockPage,
  fields: {
    heading: mockContentBlockData.basicHeading,
    content: mockContentBlockData.basicContent,
  },
};

/**
 * Props with complex content
 */
export const contentBlockPropsComplex: ContentBlockProps = {
  params: {},
  rendering: {
    componentName: 'ContentBlock',
  },
  page: mockPage,
  fields: {
    heading: mockContentBlockData.longHeading,
    content: mockContentBlockData.complexContent,
  },
};

/**
 * Props with empty heading
 */
export const contentBlockPropsEmptyHeading: ContentBlockProps = {
  params: {},
  rendering: {
    componentName: 'ContentBlock',
  },
  page: mockPage,
  fields: {
    heading: mockContentBlockData.emptyHeading,
    content: mockContentBlockData.basicContent,
  },
};

/**
 * Props with empty content
 */
export const contentBlockPropsEmptyContent: ContentBlockProps = {
  params: {},
  rendering: {
    componentName: 'ContentBlock',
  },
  page: mockPage,
  fields: {
    heading: mockContentBlockData.basicHeading,
    content: mockContentBlockData.emptyContent,
  },
};

/**
 * Props with both empty fields
 */
export const contentBlockPropsEmpty: ContentBlockProps = {
  params: {},
  rendering: {
    componentName: 'ContentBlock',
  },
  page: mockPage,
  fields: {
    heading: mockContentBlockData.emptyHeading,
    content: mockContentBlockData.emptyContent,
  },
};

/**
 * Props with special characters
 */
export const contentBlockPropsSpecialChars: ContentBlockProps = {
  params: {},
  rendering: {
    componentName: 'ContentBlock',
  },
  page: mockPage,
  fields: {
    heading: mockContentBlockData.specialCharsHeading,
    content: mockContentBlockData.specialCharsContent,
  },
};

/**
 * Props with null fields (edge case)
 */
export const contentBlockPropsNullFields: ContentBlockProps = {
  params: {},
  rendering: {
    componentName: 'ContentBlock',
  },
  page: mockPage,
  fields: null as unknown as ContentBlockProps['fields'],
};
