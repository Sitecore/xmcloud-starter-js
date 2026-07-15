// Mock data for Title component testing

import { mockPage } from '../../mocks/mockPage';

export const mockTitleProps = {
  rendering: {
    componentName: 'Title',
    dataSource: '',
    uid: 'test-uid',
  },
  params: {
    styles: 'test-styles',
    RenderingIdentifier: 'test-id',
  },
  fields: {
    data: {
      datasource: {
        url: {
          path: '/test-page',
          siteName: 'test-site',
        },
        field: {
          jsonValue: {
            value: 'Test Title from Datasource',
          },
        },
      },
    },
  },
  page: mockPage,
};

// Mock props for editing mode
export const mockTitlePropsEditing = {
  rendering: {
    componentName: 'Title',
    dataSource: '',
    uid: 'editing-uid',
  },
  params: {
    styles: 'editing-styles',
    RenderingIdentifier: 'editing-id',
  },
  fields: {
    data: {
      datasource: {
        url: {
          path: '/editing-page',
          siteName: 'editing-site',
        },
        field: {
          jsonValue: {
            value: 'Editing Mode Title',
          },
        },
      },
    },
  },
  page: {
    ...mockPage,
    mode: {
      ...mockPage.mode,
      isEditing: true,
    },
  },
};

// Mock props with no fields (edge case)
export const mockTitlePropsNoFields = {
  rendering: {
    componentName: 'Title',
    dataSource: '',
    uid: 'no-fields-uid',
  },
  params: {
    styles: 'no-fields-styles',
    RenderingIdentifier: 'no-fields-id',
  },
  fields: {
    data: {
      // No datasource or contextItem
    },
  },
  page: mockPage,
};

