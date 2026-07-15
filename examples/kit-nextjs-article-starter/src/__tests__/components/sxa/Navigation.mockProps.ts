import { TextField } from '@sitecore-content-sdk/nextjs';

// Type for navigation fields structure
interface NavigationFields {
  Id: string;
  DisplayName: string;
  Title: TextField | null;
  NavigationTitle: TextField | null;
  Href: string;
  Querystring: string;
  Children: NavigationFields[];
  Styles: string[];
}

// Type for fields prop (object with navigation items)
type NavigationFieldsObject = {
  [key: string]: NavigationFields;
};

// Mock page data for useSitecore hook
export const mockPageData = {
  page: {
    mode: {
      isEditing: false,
    },
  },
};

export const mockPageDataEditing = {
  page: {
    mode: {
      isEditing: true,
    },
  },
};

// Mock navigation fields
export const mockNavigationFields = {
  Id: 'nav-1',
  DisplayName: 'Home',
  Title: {
    value: 'Home Page',
    editable: 'Home Page',
  } as TextField,
  NavigationTitle: {
    value: 'Home',
    editable: 'Home',
  } as TextField,
  Href: '/home',
  Querystring: '',
  Children: [],
  Styles: ['nav-item'],
};

export const mockNavigationFieldsWithChildren = {
  Id: 'nav-2',
  DisplayName: 'Products',
  Title: {
    value: 'Products Page',
    editable: 'Products Page',
  } as TextField,
  NavigationTitle: {
    value: 'Products',
    editable: 'Products',
  } as TextField,
  Href: '/products',
  Querystring: '',
  Children: [
    {
      Id: 'nav-2-1',
      DisplayName: 'Product 1',
      Title: {
        value: 'Product 1 Page',
        editable: 'Product 1 Page',
      } as TextField,
      NavigationTitle: {
        value: 'Product 1',
        editable: 'Product 1',
      } as TextField,
      Href: '/products/product-1',
      Querystring: '',
      Children: [],
      Styles: ['nav-item', 'nav-subitem'],
    },
    {
      Id: 'nav-2-2',
      DisplayName: 'Product 2',
      Title: {
        value: 'Product 2 Page',
        editable: 'Product 2 Page',
      } as TextField,
      NavigationTitle: {
        value: 'Product 2',
        editable: 'Product 2',
      } as TextField,
      Href: '/products/product-2',
      Querystring: '',
      Children: [],
      Styles: ['nav-item', 'nav-subitem'],
    },
  ],
  Styles: ['nav-item', 'has-children'],
};

export const mockNavigationFieldsWithoutTitle: NavigationFields = {
  Id: 'nav-3',
  DisplayName: 'About',
  Title: null,
  NavigationTitle: null,
  Href: '/about',
  Querystring: '',
  Children: [],
  Styles: ['nav-item'],
};

export const mockNavigationFieldsEmpty: NavigationFields = {
  Id: '',
  DisplayName: '',
  Title: null,
  NavigationTitle: null,
  Href: '',
  Querystring: '',
  Children: [],
  Styles: ['nav-item'],
};

// Mock params
export const mockParams = {
  GridParameters: 'col-12',
  Styles: 'custom-nav-style',
  RenderingIdentifier: 'nav-rendering-id',
};

export const mockParamsWithoutStyles = {
  GridParameters: 'col-12',
  Styles: '',
  RenderingIdentifier: 'nav-rendering-id',
};

export const mockParamsWithoutId = {
  GridParameters: 'col-12',
  Styles: 'custom-nav-style',
  RenderingIdentifier: '',
};

// Complete props combinations
// Note: Navigation Default component expects fields to be an object where each property is a navigation item
export const defaultProps = {
  params: mockParams,
  fields: { item1: mockNavigationFields } as NavigationFieldsObject,
  handleClick: jest.fn(),
  relativeLevel: 0,
  page: mockPageData.page,
};

export const propsWithChildren = {
  params: mockParams,
  fields: { item1: mockNavigationFieldsWithChildren } as NavigationFieldsObject,
  handleClick: jest.fn(),
  relativeLevel: 0,
  page: mockPageData.page,
};

export const propsWithoutStyles = {
  params: mockParamsWithoutStyles,
  fields: { item1: mockNavigationFields } as NavigationFieldsObject,
  handleClick: jest.fn(),
  relativeLevel: 0,
  page: mockPageData.page,
};

export const propsWithoutId = {
  params: mockParamsWithoutId,
  fields: { item1: mockNavigationFields } as NavigationFieldsObject,
  handleClick: jest.fn(),
  relativeLevel: 0,
  page: mockPageData.page,
};

export const propsWithoutTitle = {
  params: mockParams,
  fields: { item1: mockNavigationFieldsWithoutTitle } as NavigationFieldsObject,
  handleClick: jest.fn(),
  relativeLevel: 0,
  page: mockPageData.page,
};

export const propsEmpty = {
  params: mockParams,
  fields: {} as NavigationFieldsObject,
  handleClick: jest.fn(),
  relativeLevel: 0,
  page: mockPageData.page,
};
