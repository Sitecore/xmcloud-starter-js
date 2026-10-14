/**
 * Test fixtures and mock data for PageContent component
 */

import type { RichTextField, LinkField, TextField, Page, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { mockPage as sharedMockPage } from '../../test-utils/mockPage';

interface PageContentFields {
  Title: TextField;
  Content: RichTextField;
  MainLink: LinkField;
}

type PageContentProps = ComponentProps & {
  fields: PageContentFields;
};

/**
 * Base mock data for PageContent component
 */
export const mockPageContentData = {
  title: 'Welcome to Our Site',
  content:
    '<p>This is the main content of the page. It contains rich text formatting and information.</p><p>More content here.</p>',
  emptyContent: '',
  simpleContent: 'Simple text content without HTML.',
  linkText: 'Learn More',
  linkHref: '/learn-more',
  linkTitle: 'Click to learn more',
};

/**
 * Mock title field
 */
export const mockTitleField: TextField = {
  value: mockPageContentData.title,
};

/**
 * Mock empty title field
 */
export const mockEmptyTitleField: TextField = {
  value: '',
};

/**
 * Mock content field
 */
export const mockContentField: RichTextField = {
  value: mockPageContentData.content,
};

/**
 * Mock empty content field
 */
export const mockEmptyContentField: RichTextField = {
  value: '',
};

/**
 * Mock simple content field
 */
export const mockSimpleContentField: RichTextField = {
  value: mockPageContentData.simpleContent,
};

/**
 * Mock link field
 */
export const mockLinkField: LinkField = {
  value: {
    href: mockPageContentData.linkHref,
    text: mockPageContentData.linkText,
    title: mockPageContentData.linkTitle,
  },
};

/**
 * Mock page object
 */
export const mockPage: Page = sharedMockPage;

/**
 * Mock rendering object
 */
const mockRendering: ComponentRendering = {
  componentName: 'PageContent',
  dataSource: '',
  uid: 'pagecontent-uid',
  placeholders: {},
};

/**
 * Default props for PageContent component testing
 */
export const defaultPageContentProps: PageContentProps = {
  rendering: mockRendering,
  params: {
    RenderingIdentifier: 'pagecontent-1',
    styles: 'pagecontent-styles',
  },
  fields: {
    Title: mockTitleField,
    Content: mockContentField,
    MainLink: mockLinkField,
  },
  page: mockPage,
};

/**
 * Props with empty content
 */
export const pageContentPropsEmptyContent: PageContentProps = {
  rendering: mockRendering,
  params: {
    RenderingIdentifier: 'pagecontent-2',
    styles: 'pagecontent-styles',
  },
  fields: {
    Title: mockTitleField,
    Content: mockEmptyContentField,
    MainLink: mockLinkField,
  },
  page: mockPage,
};

/**
 * Props with simple content (no HTML)
 */
export const pageContentPropsSimpleContent: PageContentProps = {
  rendering: mockRendering,
  params: {
    RenderingIdentifier: 'pagecontent-3',
    styles: 'pagecontent-styles',
  },
  fields: {
    Title: mockTitleField,
    Content: mockSimpleContentField,
    MainLink: mockLinkField,
  },
  page: mockPage,
};

/**
 * Props with minimal parameters
 */
export const pageContentPropsMinimal: PageContentProps = {
  rendering: mockRendering,
  params: {},
  fields: {
    Title: mockTitleField,
    Content: mockContentField,
    MainLink: mockLinkField,
  },
  page: mockPage,
};

/**
 * Props with null fields (edge case)
 */
export const pageContentPropsNullFields: PageContentProps = {
  rendering: mockRendering,
  params: {
    RenderingIdentifier: 'pagecontent-4',
    styles: 'pagecontent-styles',
  },
  fields: null as unknown as PageContentFields,
  page: mockPage,
};

/**
 * Mock useSitecore hook
 */
export const mockUseSitecore = {
  page: mockPage,
};

/**
 * Mock Sitecore context for editing mode
 */
export const mockSitecoreContextEditing = {
  page: {
    ...mockPage,
    mode: {
      isNormal: false,
      isEditing: true,
      isPreview: false,
    },
  },
};

/**
 * Mock Sitecore context with empty content
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const mockSitecoreContextEmptyContent = {
  page: {
    ...mockPage,
    layout: {
      sitecore: {
        ...mockPage.layout.sitecore,
        route: {
          fields: {
            Title: mockTitleField,
            Content: mockEmptyContentField,
          },
        } as any,
      },
    },
  },
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Alias for normal context (used in tests)
 */
export const mockSitecoreContextNormal = mockUseSitecore;
