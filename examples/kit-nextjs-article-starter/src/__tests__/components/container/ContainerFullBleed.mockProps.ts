import { ComponentRendering, Page, PageMode } from '@sitecore-content-sdk/nextjs';
import { BackgroundColor } from '@/enumerations/BackgroundColor.enum';

const mockPage: Page = {
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

export const defaultProps = {
  params: {
    DynamicPlaceholderId: 'main-fullbleed',
    styles: 'custom-fullbleed-style',
    excludeTopMargin: '0',
    backgroundColor: undefined as BackgroundColor | undefined,
    backgroundImagePath: '',
    inset: '0',
  },
  rendering: {
    componentName: 'ContainerFullBleed',
    dataSource: '',
    placeholders: {
      'container-fullbleed-main-fullbleed': [{ componentName: 'Content' }],
    },
  } as ComponentRendering,
  page: mockPage,
};

export const propsWithPrimaryBackground = {
  params: {
    DynamicPlaceholderId: 'primary-bg',
    styles: '',
    excludeTopMargin: '0',
    backgroundColor: 'primary' as BackgroundColor,
    backgroundImagePath: '',
    inset: '0',
  },
  rendering: {
    componentName: 'ContainerFullBleed',
    dataSource: '',
    placeholders: {
      'container-fullbleed-primary-bg': [{ componentName: 'Content' }],
    },
  } as ComponentRendering,
  page: mockPage,
};

export const propsWithSecondaryBackground = {
  params: {
    DynamicPlaceholderId: 'secondary-bg',
    styles: '',
    excludeTopMargin: '0',
    backgroundColor: 'secondary' as BackgroundColor,
    backgroundImagePath: '',
    inset: '0',
  },
  rendering: {
    componentName: 'ContainerFullBleed',
    dataSource: '',
    placeholders: {
      'container-fullbleed-secondary-bg': [{ componentName: 'Content' }],
    },
  } as ComponentRendering,
  page: mockPage,
};

export const propsWithTertiaryBackground = {
  params: {
    DynamicPlaceholderId: 'tertiary-bg',
    styles: '',
    excludeTopMargin: '0',
    backgroundColor: 'tertiary' as BackgroundColor,
    backgroundImagePath: '',
    inset: '0',
  },
  rendering: {
    componentName: 'ContainerFullBleed',
    dataSource: '',
    placeholders: {
      'container-fullbleed-tertiary-bg': [{ componentName: 'Content' }],
    },
  } as ComponentRendering,
  page: mockPage,
};

export const propsWithTransparentBackground = {
  params: {
    DynamicPlaceholderId: 'transparent-bg',
    styles: '',
    excludeTopMargin: '0',
    backgroundColor: 'transparent' as BackgroundColor,
    backgroundImagePath: '',
    inset: '0',
  },
  rendering: {
    componentName: 'ContainerFullBleed',
    dataSource: '',
    placeholders: {
      'container-fullbleed-transparent-bg': [{ componentName: 'Content' }],
    },
  } as ComponentRendering,
  page: mockPage,
};

export const propsWithInset = {
  params: {
    DynamicPlaceholderId: 'inset',
    styles: '',
    excludeTopMargin: '0',
    backgroundColor: 'primary' as BackgroundColor,
    backgroundImagePath: '',
    inset: '1',
  },
  rendering: {
    componentName: 'ContainerFullBleed',
    dataSource: '',
    placeholders: {
      'container-fullbleed-inset': [{ componentName: 'Content' }],
    },
  } as ComponentRendering,
  page: mockPage,
};

export const propsWithBackgroundImage = {
  params: {
    DynamicPlaceholderId: 'bg-image',
    styles: '',
    excludeTopMargin: '0',
    backgroundColor: undefined as BackgroundColor | undefined,
    backgroundImagePath: '/images/background.jpg',
    inset: '0',
  },
  rendering: {
    componentName: 'ContainerFullBleed',
    dataSource: '',
    placeholders: {
      'container-fullbleed-bg-image': [{ componentName: 'Content' }],
    },
  } as ComponentRendering,
  page: mockPage,
};

export const propsWithExcludeTopMargin = {
  params: {
    DynamicPlaceholderId: 'no-margin',
    styles: '',
    excludeTopMargin: '1',
    backgroundColor: undefined as BackgroundColor | undefined,
    backgroundImagePath: '',
    inset: '0',
  },
  rendering: {
    componentName: 'ContainerFullBleed',
    dataSource: '',
    placeholders: {
      'container-fullbleed-no-margin': [{ componentName: 'Content' }],
    },
  } as ComponentRendering,
  page: mockPage,
};

export const propsWithInsetAndTransparent = {
  params: {
    DynamicPlaceholderId: 'inset-transparent',
    styles: '',
    excludeTopMargin: '0',
    backgroundColor: 'transparent' as BackgroundColor,
    backgroundImagePath: '',
    inset: '1',
  },
  rendering: {
    componentName: 'ContainerFullBleed',
    dataSource: '',
    placeholders: {
      'container-fullbleed-inset-transparent': [{ componentName: 'Content' }],
    },
  } as ComponentRendering,
  page: mockPage,
};

