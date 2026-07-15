import type { ComponentRendering, NextjsContentSdkComponent, Page } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from '@/lib/component-props';

/** Empty map for unit tests that render placeholder-hosting components. */
export const testComponentMap = new Map<string, NextjsContentSdkComponent>();

export const mockPage = {
  mode: {
    isEditing: false,
    isPreview: false,
    isNormal: true,
    name: 'normal' as const,
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
} as Page;

export const mockRendering = {
  componentName: 'TestComponent',
} as ComponentRendering;

/** Minimal Sitecore layout props for component unit tests. */
export const baseSitecoreProps: Pick<ComponentProps, 'rendering' | 'params' | 'page'> = {
  rendering: mockRendering,
  params: {},
  page: mockPage,
};
