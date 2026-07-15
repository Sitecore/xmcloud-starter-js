import { ImageField, LinkField, Page, PageMode } from '@sitecore-content-sdk/nextjs';
import { GlobalHeaderProps } from '@/components/global-header/global-header.props';

// Mock page object with all required Page properties
const mockPageBase: Page = {
  mode: {
    isEditing: false,
    isPreview: false,
    isNormal: true,
    name: 'normal' as PageMode['name'],
    designLibrary: { isVariantGeneration: false },
    isDesignLibrary: false,
  },
  layout: {
    sitecore: {
      context: {},
      route: null,
    },
  },
  locale: 'en',
};

const mockPageEditing: Page = {
  mode: {
    isEditing: true,
    isPreview: false,
    isNormal: false,
    name: 'edit' as PageMode['name'],
    designLibrary: { isVariantGeneration: false },
    isDesignLibrary: false,
  },
  layout: {
    sitecore: {
      context: {},
      route: null,
    },
  },
  locale: 'en',
};

// Mock page data for useSitecore hook
export const mockPageData = {
  page: mockPageBase,
};

export const mockPageDataEditing = {
  page: mockPageEditing,
};

// Mock logo field
export const mockLogo: ImageField = {
  value: {
    src: '/images/header-logo.svg',
    alt: 'Company Logo',
    width: 164,
    height: 40,
  },
};

// Mock navigation links
export const mockNavLink1: LinkField = {
  value: {
    href: '/about',
    text: 'About',
    title: 'About Us',
    target: '',
    linktype: 'internal',
  },
};

export const mockNavLink2: LinkField = {
  value: {
    href: '/services',
    text: 'Services',
    title: 'Our Services',
    target: '',
    linktype: 'internal',
  },
};

export const mockNavLink3: LinkField = {
  value: {
    href: '/blog',
    text: 'Blog',
    title: 'Read our blog',
    target: '',
    linktype: 'internal',
  },
};

export const mockNavLink4: LinkField = {
  value: {
    href: '/contact',
    text: 'Contact',
    title: 'Contact Us',
    target: '',
    linktype: 'internal',
  },
};

// Mock header contact link
export const mockHeaderContact: LinkField = {
  value: {
    href: '/get-started',
    text: 'Get Started',
    title: 'Get Started',
    target: '',
    linktype: 'internal',
  },
};

// Complete fields data
export const mockFields = {
  data: {
    item: {
      logo: {
        jsonValue: mockLogo,
      },
      children: {
        results: [
          { link: { jsonValue: mockNavLink1 } },
          { link: { jsonValue: mockNavLink2 } },
          { link: { jsonValue: mockNavLink3 } },
          { link: { jsonValue: mockNavLink4 } },
        ],
      },
      headerContact: {
        jsonValue: mockHeaderContact,
      },
    },
  },
};

export const mockFieldsWithoutLogo = {
  data: {
    item: {
      logo: {
        jsonValue: { value: undefined } as unknown as ImageField,
      },
      children: {
        results: [
          { link: { jsonValue: mockNavLink1 } },
          { link: { jsonValue: mockNavLink2 } },
        ],
      },
      headerContact: {
        jsonValue: mockHeaderContact,
      },
    },
  },
};

export const mockFieldsWithoutLinks = {
  data: {
    item: {
      logo: {
        jsonValue: mockLogo,
      },
      children: {
        results: [] as Array<{ link: { jsonValue: LinkField } }>,
      },
      headerContact: {
        jsonValue: mockHeaderContact,
      },
    },
  },
};

export const mockFieldsWithoutContact = {
  data: {
    item: {
      logo: {
        jsonValue: mockLogo,
      },
      children: {
        results: [
          { link: { jsonValue: mockNavLink1 } },
          { link: { jsonValue: mockNavLink2 } },
        ],
      },
      headerContact: {
        jsonValue: { value: undefined } as unknown as LinkField,
      },
    },
  },
};

export const mockFieldsWithEmptyItem = {
  data: {
    item: {
      logo: {
        jsonValue: undefined as unknown as ImageField,
      },
      children: {
        results: [] as Array<{ link: { jsonValue: LinkField } }>,
      },
      headerContact: {
        jsonValue: undefined as unknown as LinkField,
      },
    },
  },
} as unknown as GlobalHeaderProps['fields'];

// Complete props combinations
export const defaultProps: GlobalHeaderProps = {
  params: {
    styles: 'custom-header-style',
    RenderingIdentifier: 'header-rendering-id',
  },
  fields: mockFields as GlobalHeaderProps['fields'],
  rendering: { 
    componentName: 'GlobalHeader',
    uid: 'header-uid',
  } as GlobalHeaderProps['rendering'],
  page: mockPageBase,
};

export const propsWithoutLogo: GlobalHeaderProps = {
  params: {
    RenderingIdentifier: 'header-rendering-id',
  },
  fields: mockFieldsWithoutLogo as GlobalHeaderProps['fields'],
  rendering: { componentName: 'GlobalHeader' } as GlobalHeaderProps['rendering'],
  page: mockPageBase,
};

export const propsWithoutLinks: GlobalHeaderProps = {
  params: {
    RenderingIdentifier: 'header-rendering-id',
  },
  fields: mockFieldsWithoutLinks as GlobalHeaderProps['fields'],
  rendering: { componentName: 'GlobalHeader' } as GlobalHeaderProps['rendering'],
  page: mockPageBase,
};

export const propsWithoutContact: GlobalHeaderProps = {
  params: {
    RenderingIdentifier: 'header-rendering-id',
  },
  fields: mockFieldsWithoutContact as GlobalHeaderProps['fields'],
  rendering: { componentName: 'GlobalHeader' } as GlobalHeaderProps['rendering'],
  page: mockPageBase,
};

export const propsWithEmptyItem: GlobalHeaderProps = {
  params: {
    RenderingIdentifier: 'header-rendering-id',
  },
  fields: mockFieldsWithEmptyItem as GlobalHeaderProps['fields'],
  rendering: { componentName: 'GlobalHeader' } as GlobalHeaderProps['rendering'],
  page: mockPageBase,
};

export const propsWithoutFields: GlobalHeaderProps = {
  params: {
    RenderingIdentifier: 'header-rendering-id',
  },
  fields: undefined as unknown as GlobalHeaderProps['fields'],
  rendering: { componentName: 'GlobalHeader' } as GlobalHeaderProps['rendering'],
  page: mockPageBase,
};

export const propsEditing: GlobalHeaderProps = {
  ...defaultProps,
  page: mockPageEditing,
};

