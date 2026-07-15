import type { ImageGalleryProps } from '../../components/image-gallery/image-gallery.props';
import type { Field, ImageField, Page } from '@sitecore-content-sdk/nextjs';

/**
 * Mock page object for normal mode
 */
const mockPageNormal = {
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
const mockPageEditing = {
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

// Inline utility functions
const createMockField = <T>(value: T): Field<T> => ({ value }) as unknown as Field<T>;
const createMockImageField = (src: string, alt: string): ImageField =>
  ({
    value: { src, alt, width: '800', height: '600' },
  }) as unknown as ImageField;

const mockTitleField = createMockField('Gallery Showcase');
const mockDescriptionField = createMockField(
  'Explore our stunning collection of professional photography.'
);

const mockImage1 = createMockImageField('/gallery/image1.jpg', 'Professional Portrait');
const mockImage2 = createMockImageField('/gallery/image2.jpg', 'Landscape Photography');
const mockImage3 = createMockImageField('/gallery/image3.jpg', 'Urban Architecture');
const mockImage4 = createMockImageField('/gallery/image4.jpg', 'Nature Scene');

const mockEmptyImageField = createMockImageField('', '');

export const defaultImageGalleryProps: ImageGalleryProps = {
  rendering: { componentName: 'ImageGallery', params: {} },
  params: {},
  page: mockPageNormal,
  fields: {
    title: mockTitleField,
    description: mockDescriptionField,
    image1: mockImage1,
    image2: mockImage2,
    image3: mockImage3,
    image4: mockImage4,
  },
  isPageEditing: false,
};

export const imageGalleryPropsNoFields: ImageGalleryProps = {
  rendering: { componentName: 'ImageGallery', params: {} },
  params: {},
  page: mockPageNormal,
  fields: {
    image1: mockEmptyImageField,
    image2: mockEmptyImageField,
    image3: mockEmptyImageField,
    image4: mockEmptyImageField,
  },
  isPageEditing: false,
};

export const imageGalleryPropsMinimal: ImageGalleryProps = {
  rendering: { componentName: 'ImageGallery', params: {} },
  params: {},
  page: mockPageNormal,
  fields: {
    title: mockTitleField,
    image1: mockImage1,
    image2: mockImage2,
    image3: mockEmptyImageField,
    image4: mockEmptyImageField,
  },
  isPageEditing: false,
};

export const imageGalleryPropsEditing: ImageGalleryProps = {
  ...defaultImageGalleryProps,
  page: mockPageEditing,
  isPageEditing: true,
};

// Mock useSitecore contexts
export const mockUseSitecoreNormal = {
  page: { mode: { isEditing: false } },
} as unknown;

export const mockUseSitecoreEditing = {
  page: { mode: { isEditing: true } },
} as unknown;
