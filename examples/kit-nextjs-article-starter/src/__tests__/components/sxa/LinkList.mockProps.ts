import { LinkField, TextField } from '@sitecore-content-sdk/nextjs';

// Type for link list item
interface LinkListItem {
  field?: {
    link?: LinkField;
  };
}

// Mock link fields
export const mockLink1: LinkField = {
  value: {
    href: '/page1',
    text: 'Page 1',
    title: 'Go to Page 1',
  },
};

export const mockLink2: LinkField = {
  value: {
    href: '/page2',
    text: 'Page 2',
    title: 'Go to Page 2',
  },
};

export const mockLink3: LinkField = {
  value: {
    href: '/page3',
    text: 'Page 3',
    title: 'Go to Page 3',
  },
};

export const mockLink4: LinkField = {
  value: {
    href: '/page4',
    text: 'Page 4',
    title: 'Go to Page 4',
  },
};

// Mock title field
export const mockTitleField: TextField = {
  value: 'Quick Links',
};

export const mockEmptyTitleField: TextField = {
  value: '',
};

// Default props with multiple links
export const defaultProps = {
  params: {
    styles: 'custom-link-list-style',
    RenderingIdentifier: 'link-list-id',
  },
  fields: {
    data: {
      datasource: {
        children: {
          results: [
            { field: { link: mockLink1 } },
            { field: { link: mockLink2 } },
            { field: { link: mockLink3 } },
          ],
        },
        field: {
          title: mockTitleField,
        },
      },
    },
  },
};

// Props with single link
export const propsWithSingleLink = {
  params: {
    styles: 'single-link-style',
    RenderingIdentifier: 'single-link-id',
  },
  fields: {
    data: {
      datasource: {
        children: {
          results: [{ field: { link: mockLink1 } }],
        },
        field: {
          title: mockTitleField,
        },
      },
    },
  },
};

// Props with four links (even number)
export const propsWithFourLinks = {
  params: {
    styles: 'four-links-style',
    RenderingIdentifier: 'four-links-id',
  },
  fields: {
    data: {
      datasource: {
        children: {
          results: [
            { field: { link: mockLink1 } },
            { field: { link: mockLink2 } },
            { field: { link: mockLink3 } },
            { field: { link: mockLink4 } },
          ],
        },
        field: {
          title: mockTitleField,
        },
      },
    },
  },
};

// Props without title
export const propsWithoutTitle = {
  params: {
    styles: 'no-title-style',
    RenderingIdentifier: 'no-title-id',
  },
  fields: {
    data: {
      datasource: {
        children: {
          results: [
            { field: { link: mockLink1 } },
            { field: { link: mockLink2 } },
          ],
        },
        field: {
          title: mockEmptyTitleField,
        },
      },
    },
  },
};

// Props without styles
export const propsWithoutStyles = {
  params: {
    styles: '',
    RenderingIdentifier: 'no-style-id',
  },
  fields: {
    data: {
      datasource: {
        children: {
          results: [
            { field: { link: mockLink1 } },
            { field: { link: mockLink2 } },
          ],
        },
        field: {
          title: mockTitleField,
        },
      },
    },
  },
};

// Props without RenderingIdentifier
export const propsWithoutId = {
  params: {
    styles: 'custom-style',
    RenderingIdentifier: '',
  },
  fields: {
    data: {
      datasource: {
        children: {
          results: [{ field: { link: mockLink1 } }],
        },
        field: {
          title: mockTitleField,
        },
      },
    },
  },
};

// Props with some invalid links (no link field)
export const propsWithInvalidLinks = {
  params: {
    styles: 'mixed-links',
    RenderingIdentifier: 'mixed-id',
  },
  fields: {
    data: {
      datasource: {
        children: {
          results: [
            { field: { link: mockLink1 } },
            { field: { link: undefined } } as unknown as LinkListItem,
            { field: { link: mockLink2 } },
            { field: undefined } as unknown as LinkListItem,
          ],
        },
        field: {
          title: mockTitleField,
        },
      },
    },
  },
};

// Props with no datasource (fallback rendering)
export const propsWithoutDatasource = {
  params: {
    styles: 'no-datasource',
    RenderingIdentifier: 'no-datasource-id',
  },
  fields: {
    data: undefined,
  } as unknown as typeof defaultProps.fields,
};

// Props with empty fields
export const propsWithEmptyFields = {
  params: {
    styles: 'empty-fields',
    RenderingIdentifier: 'empty-fields-id',
  },
  fields: undefined as unknown as typeof defaultProps.fields,
};

// Props with empty results
export const propsWithEmptyResults = {
  params: {
    styles: 'empty-results',
    RenderingIdentifier: 'empty-results-id',
  },
  fields: {
    data: {
      datasource: {
        children: {
          results: [],
        },
        field: {
          title: mockTitleField,
        },
      },
    },
  },
};

