// Mock data for ContentBlock component testing

import { mockPage } from '../../mocks/mockPage';

// Mock props with heading and content
export const mockContentBlockProps = {
  rendering: {
    componentName: 'ContentBlock',
    dataSource: '',
    uid: 'contentblock-uid',
  },
  params: {
    styles: 'contentblock-styles',
    RenderingIdentifier: 'contentblock-test-id',
  },
  fields: {
    heading: {
      value: 'Content Block Heading',
    },
    content: {
      value: '<p>This is the <strong>content</strong> with some <em>formatting</em>.</p>',
    },
  },
  page: mockPage,
};

// Mock props with simple content
export const mockContentBlockPropsSimple = {
  rendering: {
    componentName: 'ContentBlock',
    dataSource: '',
    uid: 'contentblock-simple-uid',
  },
  params: {
    styles: 'simple-styles',
    RenderingIdentifier: 'contentblock-simple-id',
  },
  fields: {
    heading: {
      value: 'Simple Heading',
    },
    content: {
      value: '<p>Simple content text.</p>',
    },
  },
  page: mockPage,
};

// Mock props with long content
export const mockContentBlockPropsLong = {
  rendering: {
    componentName: 'ContentBlock',
    dataSource: '',
    uid: 'contentblock-long-uid',
  },
  params: {
    styles: 'long-styles',
    RenderingIdentifier: 'contentblock-long-id',
  },
  fields: {
    heading: {
      value: 'Long Content Block',
    },
    content: {
      value: '<p>This is a longer content block with multiple sentences. It demonstrates how the component handles larger amounts of text.</p><p>It can even have multiple paragraphs.</p>',
    },
  },
  page: mockPage,
};

// Mock props with empty content
export const mockContentBlockPropsEmpty = {
  rendering: {
    componentName: 'ContentBlock',
    dataSource: '',
    uid: 'contentblock-empty-uid',
  },
  params: {
    styles: 'empty-styles',
    RenderingIdentifier: 'contentblock-empty-id',
  },
  fields: {
    heading: {
      value: '',
    },
    content: {
      value: '',
    },
  },
  page: mockPage,
};

