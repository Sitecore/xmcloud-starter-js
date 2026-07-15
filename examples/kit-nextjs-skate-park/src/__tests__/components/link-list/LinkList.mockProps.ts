// Mock data for LinkList component testing

import { mockPage } from '../../mocks/mockPage';

// Mock props with multiple links
export const mockLinkListProps = {
  rendering: {
    componentName: 'LinkList',
    dataSource: '',
    uid: 'linklist-uid',
  },
  params: {
    styles: 'linklist-styles',
    RenderingIdentifier: 'linklist-test-id',
  },
  fields: {
    data: {
      datasource: {
        children: {
          results: [
            {
              field: {
                link: {
                  value: {
                    href: '/link-1',
                    text: 'First Link',
                  },
                },
              },
            },
            {
              field: {
                link: {
                  value: {
                    href: '/link-2',
                    text: 'Second Link',
                  },
                },
              },
            },
            {
              field: {
                link: {
                  value: {
                    href: '/link-3',
                    text: 'Third Link',
                  },
                },
              },
            },
          ],
        },
        field: {
          title: {
            value: 'Link List Title',
          },
        },
      },
    },
  },
  page: mockPage,
};

// Mock props with single link
export const mockLinkListPropsSingle = {
  rendering: {
    componentName: 'LinkList',
    dataSource: '',
    uid: 'linklist-single-uid',
  },
  params: {
    styles: 'single-styles',
    RenderingIdentifier: 'linklist-single-id',
  },
  fields: {
    data: {
      datasource: {
        children: {
          results: [
            {
              field: {
                link: {
                  value: {
                    href: '/single-link',
                    text: 'Only Link',
                  },
                },
              },
            },
          ],
        },
        field: {
          title: {
            value: 'Single Link Title',
          },
        },
      },
    },
  },
  page: mockPage,
};

// Mock props with even number of links (for odd/even testing)
export const mockLinkListPropsEven = {
  rendering: {
    componentName: 'LinkList',
    dataSource: '',
    uid: 'linklist-even-uid',
  },
  params: {
    styles: 'even-styles',
    RenderingIdentifier: 'linklist-even-id',
  },
  fields: {
    data: {
      datasource: {
        children: {
          results: [
            {
              field: {
                link: {
                  value: {
                    href: '/link-a',
                    text: 'Link A',
                  },
                },
              },
            },
            {
              field: {
                link: {
                  value: {
                    href: '/link-b',
                    text: 'Link B',
                  },
                },
              },
            },
            {
              field: {
                link: {
                  value: {
                    href: '/link-c',
                    text: 'Link C',
                  },
                },
              },
            },
            {
              field: {
                link: {
                  value: {
                    href: '/link-d',
                    text: 'Link D',
                  },
                },
              },
            },
          ],
        },
        field: {
          title: {
            value: 'Even Links Title',
          },
        },
      },
    },
  },
  page: mockPage,
};

// Mock props with no datasource (should show empty state)
export const mockLinkListPropsNoData = {
  rendering: {
    componentName: 'LinkList',
    dataSource: '',
    uid: 'linklist-nodata-uid',
  },
  params: {
    styles: 'nodata-styles',
    RenderingIdentifier: 'linklist-nodata-id',
  },
  fields: {
    data: {},
  } as unknown as typeof mockLinkListProps.fields,
  page: mockPage,
};

