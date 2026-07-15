import { ImageField } from '@sitecore-content-sdk/nextjs';

// Mock image field
export const mockImageField: ImageField = {
  value: {
    src: '/images/test-image.jpg',
    alt: 'Test image',
    width: 280,
    height: 356,
  },
};

export const mockImageFieldLarge: ImageField = {
  value: {
    src: '/images/large-image.jpg',
    alt: 'Large image',
    width: 1920,
    height: 1080,
  },
};

export const mockImageFieldNoSize: ImageField = {
  value: {
    src: '/images/no-size.jpg',
    alt: 'Image without size',
  },
};

export const mockSitecoreContext = {
  page: {
    mode: {
      isNormal: true,
      isEditing: false,
    },
  },
};

export const mockSitecoreContextEditing = {
  page: {
    mode: {
      isNormal: false,
      isEditing: true,
    },
  },
};

// Default props with video and image
export const defaultProps = {
  video: '/videos/test-video.mp4',
  image: mockImageField,
  className: 'custom-media-class',
  pause: false,
  reducedMotion: false,
};

// Props with only video
export const propsWithOnlyVideo = {
  video: '/videos/only-video.mp4',
  image: undefined,
  className: '',
  pause: false,
  reducedMotion: false,
};

// Props with only image
export const propsWithOnlyImage = {
  video: undefined,
  image: mockImageField,
  className: 'image-only',
  pause: false,
  reducedMotion: false,
};

// Props with reduced motion enabled
export const propsWithReducedMotion = {
  video: '/videos/test-video.mp4',
  image: mockImageField,
  className: '',
  pause: false,
  reducedMotion: true,
};

// Props with video paused
export const propsWithPausedVideo = {
  video: '/videos/test-video.mp4',
  image: mockImageField,
  className: '',
  pause: true,
  reducedMotion: false,
};

// Props with large image
export const propsWithLargeImage = {
  video: undefined,
  image: mockImageFieldLarge,
  className: 'aspect-16/9',
  pause: false,
  reducedMotion: false,
};

// Props with image without size
export const propsWithImageNoSize = {
  video: undefined,
  image: mockImageFieldNoSize,
  className: '',
  pause: false,
  reducedMotion: false,
};

// Props with no media (should not render)
export const propsWithNoMedia = {
  video: undefined,
  image: undefined,
  className: '',
  pause: false,
  reducedMotion: false,
};

// Props with both video and reduced motion
export const propsWithVideoAndReducedMotion = {
  video: '/videos/test-video.mp4',
  image: mockImageField,
  className: 'reduced-motion-test',
  pause: false,
  reducedMotion: true,
};

// Props with custom dimensions
export const propsWithCustomClass = {
  video: '/videos/custom-video.mp4',
  image: mockImageField,
  className: 'aspect-280/356 custom-class',
  pause: false,
  reducedMotion: false,
};

