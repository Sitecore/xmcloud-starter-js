// Mock data for Image component testing

import { mockPage } from '../../mocks/mockPage';

// Mock props with all fields (image, caption, and link)
export const mockImagePropsComplete = {
  rendering: {
    componentName: 'Image',
    dataSource: '',
    uid: 'image-complete-uid',
  },
  params: {
    styles: 'image-styles',
    RenderingIdentifier: 'image-test-id',
  },
  fields: {
    Image: {
      value: {
        src: '/test-image.jpg',
        alt: 'Test Image Alt Text',
        width: 800,
        height: 600,
      },
    },
    ImageCaption: {
      value: 'This is a test image caption',
    },
    TargetUrl: {
      value: {
        href: '/test-link',
        text: 'Test Link',
      },
    },
  },
  page: mockPage,
};

// Mock props with image but no link (should not wrap in link)
export const mockImagePropsNoLink = {
  rendering: {
    componentName: 'Image',
    dataSource: '',
    uid: 'image-no-link-uid',
  },
  params: {
    styles: 'image-no-link-styles',
    RenderingIdentifier: 'image-no-link-id',
  },
  fields: {
    Image: {
      value: {
        src: '/test-image-no-link.jpg',
        alt: 'Image without link',
        width: 800,
        height: 600,
      },
    },
    ImageCaption: {
      value: 'Caption without link',
    },
    TargetUrl: {
      value: {},
    },
  },
  page: mockPage,
};

// Mock props with no fields (should show empty hint)
export const mockImagePropsNoFields = {
  rendering: {
    componentName: 'Image',
    dataSource: '',
    uid: 'image-no-fields-uid',
  },
  params: {
    styles: 'image-empty-styles',
    RenderingIdentifier: 'image-empty-id',
  },
  fields: null as unknown as typeof mockImagePropsComplete.fields,
  page: mockPage,
};

// Mock props for Banner variant
export const mockBannerProps = {
  rendering: {
    componentName: 'Image',
    dataSource: '',
    uid: 'banner-uid',
  },
  params: {
    styles: 'banner-styles',
    RenderingIdentifier: 'banner-test-id',
  },
  fields: {
    Image: {
      value: {
        src: '/banner-background.jpg',
        alt: 'Banner Background',
        width: 1920,
        height: 600,
      },
    },
    ImageCaption: {
      value: '',
    },
    TargetUrl: {
      value: {},
    },
  },
  page: mockPage,
};

