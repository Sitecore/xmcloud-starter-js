export const mockCdpPageViewProps = {
  route: {
    itemId: '{test-item-id}',
    itemLanguage: 'en',
    name: 'Test Page',
  },
  context: {
    variantId: 'test-variant',
  },
  mode: {
    isNormal: true,
    isEditing: false,
    isPreview: false,
  },
  siteName: 'test-site',
};

export const mockEditingModeProps = {
  route: {
    itemId: '{test-item-id}',
    itemLanguage: 'en',
    name: 'Test Page',
  },
  context: {
    variantId: 'test-variant',
  },
  mode: {
    isNormal: false,
    isEditing: true,
    isPreview: false,
  },
  siteName: 'test-site',
};

export const mockNoRouteProps = {
  route: null,
  context: {},
  mode: {
    isNormal: true,
    isEditing: false,
    isPreview: false,
  },
  siteName: 'test-site',
};
