import React from 'react';
import type { BackgroundThumbailProps } from '../../components/background-thumbnail/BackgroundThumbnail.dev';
import type { Page } from '@sitecore-content-sdk/nextjs';

/**
 * Mock page object for normal mode
 */
export const mockPageNormal = {
  mode: {
    isEditing: false,
    isNormal: true,
    isPreview: false,
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

/**
 * Mock page object for editing mode
 */
export const mockPageEditing = {
  mode: {
    isEditing: true,
    isNormal: false,
    isPreview: false,
    name: 'edit' as const,
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

// Mock children element
const mockChildren = React.createElement('div', { 'data-testid': 'mock-children' }, 'Mock Child');

// Mock useSitecore context for editing mode
export const mockUseSitecoreEditing = {
  page: mockPageEditing,
};

// Mock useSitecore context for non-editing mode
export const mockUseSitecoreNormal = {
  page: mockPageNormal,
};

// Default props for testing
export const defaultBackgroundThumbnailProps: BackgroundThumbailProps = {
  children: mockChildren,
  rendering: {
    componentName: 'BackgroundThumbnail',
    params: {},
  },
  params: {},
  page: mockPageNormal,
};
