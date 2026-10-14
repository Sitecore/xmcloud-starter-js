/**
 * Test fixtures and mock data for LinkList component
 */

import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';

type ResultsFieldLink = {
  field: {
    link: LinkField;
  };
};

interface LinkListFields {
  data: {
    datasource: {
      children: {
        results: ResultsFieldLink[];
      };
      field: {
        title: TextField;
      };
    };
  };
}

type LinkListProps = {
  params: { [key: string]: string };
  fields: LinkListFields;
};

/**
 * Base mock data for LinkList component
 */
export const mockLinkListData = {
  title: 'Navigation Links',
  emptyTitle: '',
  links: [
    {
      text: 'Home',
      href: '/',
      title: 'Go to Home',
    },
    {
      text: 'About',
      href: '/about',
      title: 'Learn About Us',
    },
    {
      text: 'Contact',
      href: '/contact',
      title: 'Get in Touch',
    },
  ],
  anchorLinks: [
    {
      text: 'Section 1',
      href: '#section1',
      title: 'Jump to Section 1',
    },
    {
      text: 'Section 2',
      href: '#section2',
      title: 'Jump to Section 2',
    },
  ],
};

/**
 * Mock link fields
 */
export const mockLinkFields: LinkField[] = mockLinkListData.links.map((link) => ({
  value: {
    href: link.href,
    text: link.text,
    title: link.title,
  },
}));

/**
 * Mock anchor link fields
 */
export const mockAnchorLinkFields: LinkField[] = mockLinkListData.anchorLinks.map((link) => ({
  value: {
    href: link.href,
    text: link.text,
    title: link.title,
  },
}));

/**
 * Mock title field
 */
export const mockTitleField: TextField = {
  value: mockLinkListData.title,
};

/**
 * Mock empty title field
 */
export const mockEmptyTitleField: TextField = {
  value: '',
};

/**
 * Mock results with links
 */
export const mockResultsWithLinks: ResultsFieldLink[] = mockLinkFields.map((linkField) => ({
  field: {
    link: linkField,
  },
}));

/**
 * Mock results with anchor links
 */
export const mockResultsWithAnchorLinks: ResultsFieldLink[] = mockAnchorLinkFields.map(
  (linkField) => ({
    field: {
      link: linkField,
    },
  })
);

/**
 * Mock empty results
 */
export const mockEmptyResults: ResultsFieldLink[] = [];

/**
 * Default props for LinkList component testing
 */
export const defaultLinkListProps: LinkListProps = {
  params: {
    RenderingIdentifier: 'linklist-1',
    styles: 'linklist-styles',
  },
  fields: {
    data: {
      datasource: {
        children: {
          results: mockResultsWithLinks,
        },
        field: {
          title: mockTitleField,
        },
      },
    },
  },
};

/**
 * Props with anchor links for AnchorNav variant
 */
export const anchorNavLinkListProps: LinkListProps = {
  params: {
    RenderingIdentifier: 'anchor-nav-1',
    styles: 'anchor-nav-styles',
  },
  fields: {
    data: {
      datasource: {
        children: {
          results: mockResultsWithAnchorLinks,
        },
        field: {
          title: mockTitleField,
        },
      },
    },
  },
};

/**
 * Props with empty title
 */
export const linkListPropsEmptyTitle: LinkListProps = {
  params: {
    RenderingIdentifier: 'linklist-2',
    styles: 'linklist-styles',
  },
  fields: {
    data: {
      datasource: {
        children: {
          results: mockResultsWithLinks,
        },
        field: {
          title: mockEmptyTitleField,
        },
      },
    },
  },
};

/**
 * Props with no links
 */
export const linkListPropsNoLinks: LinkListProps = {
  params: {
    RenderingIdentifier: 'linklist-3',
    styles: 'linklist-styles',
  },
  fields: {
    data: {
      datasource: {
        children: {
          results: mockEmptyResults,
        },
        field: {
          title: mockTitleField,
        },
      },
    },
  },
};

/**
 * Props with minimal parameters
 */
export const linkListPropsMinimal: LinkListProps = {
  params: {},
  fields: {
    data: {
      datasource: {
        children: {
          results: mockResultsWithLinks,
        },
        field: {
          title: mockTitleField,
        },
      },
    },
  },
};

/**
 * Props with null fields (edge case)
 */
export const linkListPropsNullFields: LinkListProps = {
  params: {
    RenderingIdentifier: 'linklist-4',
    styles: 'linklist-styles',
  },
  fields: null as unknown as LinkListFields,
};
