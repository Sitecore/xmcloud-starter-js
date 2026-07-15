// Mock data for Navigation component testing

import { mockPage } from '../../mocks/mockPage';

// Mock props with nested navigation structure
export const mockNavigationProps = {
  rendering: {
    componentName: 'Navigation',
    dataSource: '',
    uid: 'navigation-uid',
  },
  params: {
    styles: 'navigation-styles',
    RenderingIdentifier: 'navigation-test-id',
  },
  fields: {
    Home: {
      Id: 'home-id',
      DisplayName: 'Home',
      Title: {
        value: 'Home Page',
      },
      NavigationTitle: {
        value: 'Home',
      },
      Href: '/',
      Querystring: '',
      Children: [],
      Styles: ['home-style'],
    },
    About: {
      Id: 'about-id',
      DisplayName: 'About',
      Title: {
        value: 'About Us',
      },
      NavigationTitle: {
        value: 'About',
      },
      Href: '/about',
      Querystring: '',
      Children: [
        {
          Id: 'team-id',
          DisplayName: 'Team',
          Title: {
            value: 'Our Team',
          },
          NavigationTitle: {
            value: 'Team',
          },
          Href: '/about/team',
          Querystring: '',
          Children: [],
          Styles: ['team-style'],
        },
        {
          Id: 'history-id',
          DisplayName: 'History',
          Title: {
            value: 'Company History',
          },
          NavigationTitle: {
            value: 'History',
          },
          Href: '/about/history',
          Querystring: '',
          Children: [],
          Styles: ['history-style'],
        },
      ],
      Styles: ['about-style'],
    },
    Contact: {
      Id: 'contact-id',
      DisplayName: 'Contact',
      Title: {
        value: 'Contact Us',
      },
      NavigationTitle: null as unknown as { value: string },
      Href: '/contact',
      Querystring: '?from=nav',
      Children: [],
      Styles: ['contact-style'],
    },
  } as unknown as Record<string, {
    Id: string;
    DisplayName: string;
    Title: { value: string } | null;
    NavigationTitle: { value: string } | null;
    Href: string;
    Querystring: string;
    Children: unknown[];
    Styles: string[];
  }>,
  page: mockPage,
} as unknown as Parameters<typeof import('../../../components/navigation/Navigation').Default>[0];

// Mock props with simple flat navigation (no children)
export const mockNavigationPropsFlat = {
  rendering: {
    componentName: 'Navigation',
    dataSource: '',
    uid: 'navigation-flat-uid',
  },
  params: {
    styles: 'flat-styles',
    RenderingIdentifier: 'navigation-flat-id',
  },
  fields: {
    Page1: {
      Id: 'page1-id',
      DisplayName: 'Page One',
      Title: {
        value: 'First Page',
      },
      NavigationTitle: {
        value: 'Page 1',
      },
      Href: '/page1',
      Querystring: '',
      Children: [],
      Styles: [],
    },
    Page2: {
      Id: 'page2-id',
      DisplayName: 'Page Two',
      Title: {
        value: 'Second Page',
      },
      NavigationTitle: {
        value: 'Page 2',
      },
      Href: '/page2',
      Querystring: '',
      Children: [],
      Styles: [],
    },
  } as unknown as Record<string, {
    Id: string;
    DisplayName: string;
    Title: { value: string } | null;
    NavigationTitle: { value: string } | null;
    Href: string;
    Querystring: string;
    Children: unknown[];
    Styles: string[];
  }>,
  page: mockPage,
} as unknown as Parameters<typeof import('../../../components/navigation/Navigation').Default>[0];

// Mock props with DisplayName only (no Title or NavigationTitle)
export const mockNavigationPropsDisplayName = {
  rendering: {
    componentName: 'Navigation',
    dataSource: '',
    uid: 'navigation-display-uid',
  },
  params: {
    styles: 'display-styles',
    RenderingIdentifier: 'navigation-display-id',
  },
  fields: {
    SimpleLink: {
      Id: 'simple-id',
      DisplayName: 'Simple Link',
      Title: null as unknown as { value: string },
      NavigationTitle: null as unknown as { value: string },
      Href: '/simple',
      Querystring: '',
      Children: [],
      Styles: [],
    },
  } as unknown as Record<string, {
    Id: string;
    DisplayName: string;
    Title: { value: string } | null;
    NavigationTitle: { value: string } | null;
    Href: string;
    Querystring: string;
    Children: unknown[];
    Styles: string[];
  }>,
  page: mockPage,
} as unknown as Parameters<typeof import('../../../components/navigation/Navigation').Default>[0];

// Mock props with no fields (empty state)
export const mockNavigationPropsEmpty = {
  rendering: {
    componentName: 'Navigation',
    dataSource: '',
    uid: 'navigation-empty-uid',
  },
  params: {
    styles: 'empty-styles',
    RenderingIdentifier: 'navigation-empty-id',
  },
  fields: {} as unknown as Record<string, {
    Id: string;
    DisplayName: string;
    Title: { value: string } | null;
    NavigationTitle: { value: string } | null;
    Href: string;
    Querystring: string;
    Children: unknown[];
    Styles: string[];
  }>,
  page: mockPage,
} as unknown as Parameters<typeof import('../../../components/navigation/Navigation').Default>[0];

