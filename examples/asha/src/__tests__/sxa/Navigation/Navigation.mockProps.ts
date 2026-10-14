/**
 * Test fixtures and mock data for Navigation component
 */

interface NavigationFields {
  Id: string;
  DisplayName: string;
  Title: {
    value: string;
  };
  NavigationTitle: {
    value: string;
  };
  Href: string;
  Querystring: string;
  Children: Array<NavigationFields>;
  Styles: string[];
}

type NavigationRecord = Record<string, NavigationFields>;

type NavigationProps = {
  params?: { [key: string]: string };
  fields: NavigationFields | NavigationRecord;
  handleClick: (event?: React.MouseEvent<HTMLElement>) => void;
  relativeLevel: number;
};

/**
 * Mock navigation data
 */
export const mockNavigationData = {
  basicItem: {
    Id: 'nav-1',
    DisplayName: 'Home',
    Title: { value: 'Home Page' },
    NavigationTitle: { value: 'Welcome' },
    Href: '/',
    Querystring: '',
    Children: [],
    Styles: ['nav-item'],
  },
  itemWithChildren: {
    Id: 'nav-2',
    DisplayName: 'Products',
    Title: { value: 'Our Products' },
    NavigationTitle: { value: 'Products' },
    Href: '/products',
    Querystring: '',
    Children: [
      {
        Id: 'nav-2-1',
        DisplayName: 'Product A',
        Title: { value: 'Product A' },
        NavigationTitle: { value: 'Product A' },
        Href: '/products/a',
        Querystring: '',
        Children: [],
        Styles: ['sub-item'],
      },
      {
        Id: 'nav-2-2',
        DisplayName: 'Product B',
        Title: { value: 'Product B' },
        NavigationTitle: { value: 'Product B' },
        Href: '/products/b',
        Querystring: '',
        Children: [],
        Styles: ['sub-item'],
      },
    ],
    Styles: ['nav-item', 'has-children'],
  },
  simpleItem: {
    Id: 'nav-3',
    DisplayName: 'About',
    Title: { value: 'About Us' },
    NavigationTitle: { value: 'About' },
    Href: '/about',
    Querystring: '?utm=nav',
    Children: [],
    Styles: ['nav-item'],
  },
};

/**
 * Mock useSitecore hook
 */
export const mockUseSitecore = {
  page: {
    mode: {
      isEditing: false,
    },
    layout: {
      sitecore: {
        route: {
          fields: {},
        },
      },
    },
  },
};

/**
 * Default props for Navigation component testing (Default variant)
 */
export const defaultNavigationProps: NavigationProps = {
  params: {
    RenderingIdentifier: 'navigation-1',
    GridParameters: 'col-12',
    Styles: 'custom-nav-style',
  },
  fields: {
    item1: {
      Id: 'nav-1',
      DisplayName: 'Home',
      Title: { value: 'Home Page' },
      NavigationTitle: { value: 'Welcome' },
      Href: '/',
      Querystring: '',
      Children: [],
      Styles: ['nav-item'],
    },
  } as NavigationRecord,
  handleClick: jest.fn(),
  relativeLevel: 0,
};

/**
 * Props with navigation items
 */
export const navigationWithItemsProps: NavigationProps = {
  params: {
    RenderingIdentifier: 'navigation-items',
    Styles: 'main-navigation',
  },
  fields: {
    item1: {
      Id: 'nav-1',
      DisplayName: 'Home',
      Title: { value: 'Home Page' },
      NavigationTitle: { value: 'Welcome' },
      Href: '/',
      Querystring: '',
      Children: [],
      Styles: ['nav-item'],
    },
    item2: {
      Id: 'nav-2',
      DisplayName: 'Products',
      Title: { value: 'Our Products' },
      NavigationTitle: { value: 'Products' },
      Href: '/products',
      Querystring: '',
      Children: [
        {
          Id: 'nav-2-1',
          DisplayName: 'Product A',
          Title: { value: 'Product A' },
          NavigationTitle: { value: 'Product A' },
          Href: '/products/a',
          Querystring: '',
          Children: [],
          Styles: ['nav-item'],
        },
      ],
      Styles: ['nav-item', 'has-children'],
    },
  } as NavigationRecord,
  handleClick: jest.fn(),
  relativeLevel: 0,
};

/**
 * Props for ButtonNavigation variant
 */
export const buttonNavigationProps: NavigationProps = {
  params: {
    RenderingIdentifier: 'button-nav',
  },
  fields: {
    item1: {
      Id: 'components',
      DisplayName: 'Components',
      Title: { value: 'UI Components' },
      NavigationTitle: { value: 'Components' },
      Href: '/components',
      Querystring: '',
      Children: [],
      Styles: [],
    },
    item2: {
      Id: 'layouts',
      DisplayName: 'Layouts',
      Title: { value: 'Page Layouts' },
      NavigationTitle: { value: 'Layouts' },
      Href: '/layouts',
      Querystring: '',
      Children: [],
      Styles: [],
    },
    item3: {
      Id: 'utilities',
      DisplayName: 'Utilities',
      Title: { value: 'Utility Components' },
      NavigationTitle: { value: 'Utilities' },
      Href: '/utilities',
      Querystring: '',
      Children: [],
      Styles: [],
    },
  } as NavigationRecord,
  handleClick: jest.fn(),
  relativeLevel: 0,
};

/**
 * Props with empty fields (edge case)
 */
export const emptyNavigationProps: NavigationProps = {
  params: {
    RenderingIdentifier: 'empty-nav',
  },
  fields: {} as NavigationRecord,
  handleClick: jest.fn(),
  relativeLevel: 0,
};

/**
 * Props for NavigationList component
 */
export const navigationListProps: NavigationProps = {
  params: {},
  fields: mockNavigationData.itemWithChildren,
  handleClick: jest.fn(),
  relativeLevel: 1,
};

/**
 * Props for NavigationList with no children
 */
export const navigationListLeafProps: NavigationProps = {
  params: {},
  fields: mockNavigationData.basicItem,
  handleClick: jest.fn(),
  relativeLevel: 1,
};
