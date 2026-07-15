// Mock data for Container component testing

import { mockPage } from '../../mocks/mockPage';

// Mock props with background image
export const mockContainerPropsWithBackground = {
  rendering: {
    componentName: 'Container',
    dataSource: '',
    uid: 'container-bg-uid',
  },
  params: {
    styles: 'container-styles',
    RenderingIdentifier: 'container-test-id',
    BackgroundImage: 'mediaurl="/path/to/background.jpg"',
    DynamicPlaceholderId: '1',
  },
  page: mockPage,
};

// Mock props without background image
export const mockContainerPropsNoBackground = {
  rendering: {
    componentName: 'Container',
    dataSource: '',
    uid: 'container-no-bg-uid',
  },
  params: {
    styles: 'no-bg-styles',
    RenderingIdentifier: 'container-no-bg-id',
    DynamicPlaceholderId: '2',
  },
  page: mockPage,
};

// Mock props with "container" in styles (should add wrapper)
export const mockContainerPropsWithWrapper = {
  rendering: {
    componentName: 'Container',
    dataSource: '',
    uid: 'container-wrapper-uid',
  },
  params: {
    styles: 'container other-class',
    RenderingIdentifier: 'container-wrapper-id',
    DynamicPlaceholderId: '3',
  },
  page: mockPage,
};

// Mock props without "container" in styles (no wrapper)
export const mockContainerPropsWithoutWrapper = {
  rendering: {
    componentName: 'Container',
    dataSource: '',
    uid: 'container-no-wrapper-uid',
  },
  params: {
    styles: 'other-styles',
    RenderingIdentifier: 'container-no-wrapper-id',
    DynamicPlaceholderId: '4',
  },
  page: mockPage,
};

// Mock props with different DynamicPlaceholderId
export const mockContainerPropsDifferentPlaceholder = {
  rendering: {
    componentName: 'Container',
    dataSource: '',
    uid: 'container-diff-ph-uid',
  },
  params: {
    styles: 'different-styles',
    RenderingIdentifier: 'container-diff-ph-id',
    BackgroundImage: 'mediaurl="/different/background.jpg"',
    DynamicPlaceholderId: '99',
  },
  page: mockPage,
};

// Mock props with empty fields (edge case)
export const mockContainerPropsEmpty = {
  rendering: {
    componentName: 'Container',
    dataSource: '',
    uid: 'container-empty-uid',
  },
  params: {
    styles: '',
    RenderingIdentifier: 'container-empty-id',
    DynamicPlaceholderId: '0',
  },
  page: mockPage,
};

