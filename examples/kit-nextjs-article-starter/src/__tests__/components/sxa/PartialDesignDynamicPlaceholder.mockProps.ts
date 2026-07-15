import { ComponentRendering, ComponentParams, Page, PageMode } from '@sitecore-content-sdk/nextjs';

// Mock page object
const mockPage: Page = {
  mode: {
    name: 'normal' as PageMode['name'],
    isEditing: false,
    isPreview: false,
    isNormal: true,
    isDesignLibrary: false,
    designLibrary: { isVariantGeneration: false },
  },
  layout: {
    sitecore: {
      route: null,
    },
  } as Page['layout'],
  locale: 'en',
};

// Mock params
const mockParams: ComponentParams = {};

// Default props with sig parameter
export const defaultProps = {
  rendering: {
    componentName: 'PartialDesignDynamicPlaceholder',
    dataSource: '',
    params: {
      sig: 'main-content-dynamic',
    },
  } as ComponentRendering,
  params: mockParams,
  page: mockPage,
};

// Props with different sig
export const propsWithCustomSig = {
  rendering: {
    componentName: 'PartialDesignDynamicPlaceholder',
    dataSource: '',
    params: {
      sig: 'sidebar-content-{*}',
    },
  } as ComponentRendering,
  params: mockParams,
  page: mockPage,
};

// Props with complex sig pattern
export const propsWithComplexSig = {
  rendering: {
    componentName: 'PartialDesignDynamicPlaceholder',
    dataSource: '',
    params: {
      sig: 'dynamic-placeholder-{GUID}-{*}',
    },
  } as ComponentRendering,
  params: mockParams,
  page: mockPage,
};

// Props with empty sig
export const propsWithEmptySig = {
  rendering: {
    componentName: 'PartialDesignDynamicPlaceholder',
    dataSource: '',
    params: {
      sig: '',
    },
  } as ComponentRendering,
  params: mockParams,
  page: mockPage,
};

// Props without sig parameter
export const propsWithoutSig = {
  rendering: {
    componentName: 'PartialDesignDynamicPlaceholder',
    dataSource: '',
    params: {},
  } as ComponentRendering,
  params: mockParams,
  page: mockPage,
};

// Props with undefined params
export const propsWithUndefinedParams = {
  rendering: {
    componentName: 'PartialDesignDynamicPlaceholder',
    dataSource: '',
    params: undefined,
  } as unknown as ComponentRendering,
  params: mockParams,
  page: mockPage,
};

// Props with null rendering
export const propsWithNullRendering = {
  rendering: null as unknown as ComponentRendering,
  params: mockParams,
  page: mockPage,
};

// Props with numeric sig
export const propsWithNumericSig = {
  rendering: {
    componentName: 'PartialDesignDynamicPlaceholder',
    dataSource: '',
    params: {
      sig: 'placeholder-123',
    },
  } as ComponentRendering,
  params: mockParams,
  page: mockPage,
};

