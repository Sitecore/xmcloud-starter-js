// Mock data for PageContent component testing

import { mockPage } from '../../mocks/mockPage';

// Mock props with content field
export const mockPageContentProps = {
  rendering: {
    componentName: 'PageContent',
    dataSource: '',
    uid: 'pagecontent-uid',
  },
  params: {
    styles: 'pagecontent-styles',
    RenderingIdentifier: 'pagecontent-test-id',
  },
  fields: {
    Content: {
      value: '<p>This is page content with <strong>formatting</strong> and <em>styles</em>.</p>',
    },
  },
  page: mockPage,
};

// Mock props with rich content
export const mockPageContentPropsRich = {
  rendering: {
    componentName: 'PageContent',
    dataSource: '',
    uid: 'pagecontent-rich-uid',
  },
  params: {
    styles: 'rich-content-styles',
    RenderingIdentifier: 'pagecontent-rich-id',
  },
  fields: {
    Content: {
      value: '<h2>Heading</h2><p>Paragraph with <a href="/link">link</a>.</p><ul><li>Item 1</li><li>Item 2</li></ul>',
    },
  },
  page: mockPage,
};

// Mock props with simple text
export const mockPageContentPropsSimple = {
  rendering: {
    componentName: 'PageContent',
    dataSource: '',
    uid: 'pagecontent-simple-uid',
  },
  params: {
    styles: 'simple-styles',
    RenderingIdentifier: 'pagecontent-simple-id',
  },
  fields: {
    Content: {
      value: '<p>Simple page content text.</p>',
    },
  },
  page: mockPage,
};

// Mock props with no content field (should show placeholder)
export const mockPageContentPropsNoContent = {
  rendering: {
    componentName: 'PageContent',
    dataSource: '',
    uid: 'pagecontent-nocontent-uid',
  },
  params: {
    styles: 'nocontent-styles',
    RenderingIdentifier: 'pagecontent-nocontent-id',
  },
  fields: {
    Content: null as unknown as typeof mockPageContentProps.fields.Content,
  },
  page: mockPage,
};

// Mock props with empty content
export const mockPageContentPropsEmpty = {
  rendering: {
    componentName: 'PageContent',
    dataSource: '',
    uid: 'pagecontent-empty-uid',
  },
  params: {
    styles: 'empty-styles',
    RenderingIdentifier: 'pagecontent-empty-id',
  },
  fields: {
    Content: {
      value: '',
    },
  },
  page: mockPage,
};

