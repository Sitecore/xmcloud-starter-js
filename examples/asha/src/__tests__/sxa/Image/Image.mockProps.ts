/**
 * Test fixtures and mock data for Image component
 */

import type { ImageField, LinkField, Field, Page, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { mockPage as sharedMockPage, mockPageEditing as sharedMockPageEditing } from '../../test-utils/mockPage';

interface ImageFields {
  Image: ImageField & { metadata?: { [key: string]: unknown } };
  ImageCaption: Field<string>;
  TargetUrl: LinkField;
}

type ImageProps = ComponentProps & {
  fields: ImageFields;
};

/**
 * Base mock data for Image component
 */
export const mockImageData = {
  basicImage: {
    value: {
      src: '/-/media/image.jpg',
      alt: 'Sample image',
      width: 800,
      height: 600,
    },
  },
  imageWithCaption: {
    value: {
      src: '/-/media/image-with-caption.jpg',
      alt: 'Image with caption',
      width: 400,
      height: 300,
    },
  },
  imageWithLink: {
    value: {
      src: '/-/media/clickable-image.jpg',
      alt: 'Clickable image',
      width: 600,
      height: 400,
    },
  },
  emptyImage: {
    value: {
      class: 'scEmptyImage',
      src: '',
      alt: '',
    },
  },
};

export const mockImageCaption: Field<string> = {
  value: 'Sample image caption',
};

export const mockEmptyImageCaption: Field<string> = {
  value: '',
};

export const mockTargetUrl: LinkField = {
  value: {
    href: '/target-page',
    title: 'Go to target page',
  },
};

export const mockEmptyTargetUrl: LinkField = {
  value: {
    href: '',
  },
};

/**
 * Mock page object for Image component testing
 */
export const mockPage: Page = sharedMockPage;

export const mockPageEditing: Page = sharedMockPageEditing;

/**
 * Mock rendering object
 */
const mockRendering: ComponentRendering = {
  componentName: 'Image',
  dataSource: '',
  uid: 'image-uid',
  placeholders: {},
};

/**
 * Default props for Image component testing
 */
export const defaultImageProps: ImageProps = {
  rendering: mockRendering,
  params: {
    RenderingIdentifier: 'image-1',
    styles: 'image-styles',
  },
  fields: {
    Image: mockImageData.basicImage,
    ImageCaption: mockImageCaption,
    TargetUrl: mockEmptyTargetUrl,
  },
  page: mockPage,
};

export const imagePropsWithCaption: ImageProps = {
  rendering: mockRendering,
  params: {
    RenderingIdentifier: 'image-2',
    styles: 'image-styles',
  },
  fields: {
    Image: mockImageData.imageWithCaption,
    ImageCaption: mockImageCaption,
    TargetUrl: mockEmptyTargetUrl,
  },
  page: mockPage,
};

export const imagePropsWithLink: ImageProps = {
  rendering: mockRendering,
  params: {
    RenderingIdentifier: 'image-3',
    styles: 'image-styles',
  },
  fields: {
    Image: mockImageData.imageWithLink,
    ImageCaption: mockImageCaption,
    TargetUrl: mockTargetUrl,
  },
  page: mockPage,
};

/**
 * Props with empty image (editing placeholder)
 */
export const imagePropsEmptyImage: ImageProps = {
  rendering: mockRendering,
  params: {
    RenderingIdentifier: 'image-4',
    styles: 'image-styles',
  },
  fields: {
    Image: mockImageData.emptyImage,
    ImageCaption: mockEmptyImageCaption,
    TargetUrl: mockEmptyTargetUrl,
  },
  page: mockPageEditing,
};

export const imagePropsMinimal: ImageProps = {
  rendering: mockRendering,
  params: {},
  fields: {
    Image: mockImageData.basicImage,
    ImageCaption: mockEmptyImageCaption,
    TargetUrl: mockEmptyTargetUrl,
  },
  page: mockPage,
};

export const imagePropsNullFields: ImageProps = {
  rendering: mockRendering,
  params: {
    RenderingIdentifier: 'image-5',
    styles: 'image-styles',
  },
  fields: null as unknown as ImageFields,
  page: mockPage,
};

/**
 * Props for Banner variant
 */
export const bannerImageProps: ImageProps = {
  rendering: mockRendering,
  params: {
    RenderingIdentifier: 'banner-1',
    styles: 'hero-banner-styles',
  },
  fields: {
    Image: mockImageData.basicImage,
    ImageCaption: mockEmptyImageCaption,
    TargetUrl: mockEmptyTargetUrl,
  },
  page: mockPage,
};

/**
 * Props for Banner variant with background image
 */
export const bannerImagePropsWithBackground: ImageProps = {
  rendering: mockRendering,
  params: {
    RenderingIdentifier: 'banner-2',
    styles: 'hero-banner-styles',
  },
  fields: {
    Image: {
      ...mockImageData.basicImage,
      value: {
        ...mockImageData.basicImage.value,
        class: 'scEmptyImage', // This triggers background image mode
      },
    },
    ImageCaption: mockEmptyImageCaption,
    TargetUrl: mockEmptyTargetUrl,
  },
  page: mockPageEditing,
};
