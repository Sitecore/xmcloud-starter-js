import { VideoComponentProps } from '../../components/video/video-props';
import { ImageField, LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { mockPage } from '../test-utils/mockPage';

const createMockImageField = (src: string, alt: string): ImageField =>
  ({
    value: { src, alt },
  }) as unknown as ImageField;

const createMockLinkField = (href: string, text?: string): LinkField =>
  ({
    value: { href, text },
  }) as unknown as LinkField;

const createMockTextField = (value: string): TextField =>
  ({
    value,
  }) as unknown as TextField;

export const defaultVideoProps: VideoComponentProps = {
  rendering: { componentName: 'Video' },
  params: {
    darkPlayIcon: '0',
    useModal: '1',
    displayIcon: '1',
    styles: 'video-custom-styles',
  },
  page: mockPage,
  fields: {
    video: createMockLinkField('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'SYNC Audio Demo'),
    image: createMockImageField(
      '/images/video-thumbnail.jpg',
      'Video thumbnail showing SYNC audio equipment'
    ),
    title: createMockTextField('Professional Audio Solutions Demo'),
  },
};

export const videoPropsWithoutModal: VideoComponentProps = {
  ...defaultVideoProps,
  params: {
    darkPlayIcon: '0',
    useModal: '0', // Disable modal
    displayIcon: '1',
  },
};

export const videoPropsDarkPlayIcon: VideoComponentProps = {
  ...defaultVideoProps,
  params: {
    darkPlayIcon: '1', // Dark play icon
    useModal: '1',
    displayIcon: '1',
  },
};

export const videoPropsNoDisplayIcon: VideoComponentProps = {
  ...defaultVideoProps,
  params: {
    darkPlayIcon: '0',
    useModal: '1',
    displayIcon: '0', // No display icon
  },
};

export const videoPropsNoImage: VideoComponentProps = {
  ...defaultVideoProps,
  fields: {
    video: createMockLinkField('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'SYNC Audio Demo'),
    image: undefined, // No custom image - should use YouTube thumbnail
    title: createMockTextField('Video without custom thumbnail'),
  },
};

export const videoPropsVimeoUrl: VideoComponentProps = {
  ...defaultVideoProps,
  fields: {
    video: createMockLinkField('https://vimeo.com/123456789', 'Vimeo Demo Video'),
    image: createMockImageField('/images/vimeo-thumbnail.jpg', 'Vimeo video thumbnail'),
    title: createMockTextField('Vimeo Video Demo'),
  },
};

export const videoPropsLongTitle: VideoComponentProps = {
  ...defaultVideoProps,
  fields: {
    video: createMockLinkField(
      'https://www.youtube.com/watch?v=longvideo123',
      'Comprehensive SYNC Audio Equipment Demo'
    ),
    image: createMockImageField('/images/long-video-thumbnail.jpg', 'Detailed video thumbnail'),
    title: createMockTextField(
      'Comprehensive Professional Audio Equipment Demonstration Video Featuring SYNC Audio Products and Solutions for Studio and Live Applications'
    ),
  },
};

export const videoPropsSpecialChars: VideoComponentProps = {
  ...defaultVideoProps,
  fields: {
    video: createMockLinkField(
      'https://www.youtube.com/watch?v=special123',
      'Vidéo Spéciale SYNC™'
    ),
    image: createMockImageField(
      '/images/special-chars.jpg',
      'Vidéo avec caractères spéciaux & symboles'
    ),
    title: createMockTextField('Démonstration Équipements Audio SYNC™ - Qualité & Précision'),
  },
};

export const videoPropsEmptyImage: VideoComponentProps = {
  ...defaultVideoProps,
  fields: {
    video: createMockLinkField('https://www.youtube.com/watch?v=empty123', 'Empty Image Test'),
    image: createMockImageField('', ''), // Empty image fields
    title: createMockTextField('Video with empty image fields'),
  },
};

export const videoPropsNoVideo: VideoComponentProps = {
  ...defaultVideoProps,
  fields: {
    video: undefined, // No video URL
    image: createMockImageField('/images/no-video.jpg', 'No video placeholder'),
    title: createMockTextField('Component without video URL'),
  },
};

export const videoPropsEmptyVideoUrl: VideoComponentProps = {
  ...defaultVideoProps,
  fields: {
    video: createMockLinkField('', ''), // Empty video URL
    image: createMockImageField('/images/empty-url.jpg', 'Empty URL placeholder'),
    title: createMockTextField('Component with empty video URL'),
  },
};

export const videoPropsNoTitle: VideoComponentProps = {
  ...defaultVideoProps,
  fields: {
    video: createMockLinkField('https://www.youtube.com/watch?v=notitle123', 'No Title Video'),
    image: createMockImageField('/images/no-title.jpg', 'Video without title'),
    title: undefined, // No title
  },
};

export const videoPropsCustomIcon: VideoComponentProps = {
  ...defaultVideoProps,
  params: {
    darkPlayIcon: '0',
    useModal: '1',
    displayIcon: '1',
    customIcon: 'custom-play-icon',
  },
};

export const videoPropsAllCustomParams: VideoComponentProps = {
  ...defaultVideoProps,
  params: {
    darkPlayIcon: '1',
    useModal: '0',
    displayIcon: '0',
    styles: 'custom-video-styles bg-dark text-light premium-player',
    playButtonClassName: 'custom-play-button-styles',
  },
};

export const videoPropsNoFields: VideoComponentProps = {
  rendering: { componentName: 'Video' },
  params: {
    darkPlayIcon: '0',
    useModal: '1',
  },
  page: mockPage,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: null as any,
};

export const videoPropsEmptyFields: VideoComponentProps = {
  ...defaultVideoProps,
  fields: {
    video: createMockLinkField('', ''),
    image: createMockImageField('', ''),
    title: createMockTextField(''),
  },
};

export const videoPropsUndefinedFields: VideoComponentProps = {
  ...defaultVideoProps,
  fields: {
    video: undefined,
    image: undefined,
    title: undefined,
  },
};

export const videoPropsNoParams: VideoComponentProps = {
  ...defaultVideoProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: undefined as any,
};

export const videoPropsEmptyParams: VideoComponentProps = {
  ...defaultVideoProps,
  params: {},
};

export const videoPropsMalformedUrl: VideoComponentProps = {
  ...defaultVideoProps,
  fields: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    video: { value: { href: 'not-a-valid-url' } } as any,
    image: createMockImageField('/images/malformed.jpg', 'Malformed URL test'),
    title: createMockTextField('Malformed URL Test'),
  },
};

export const videoPropsMultipleVideos: VideoComponentProps = {
  ...defaultVideoProps,
  fields: {
    video: createMockLinkField('https://www.youtube.com/watch?v=multiple1', 'First Video'),
    image: createMockImageField('/images/multiple-1.jpg', 'First video thumbnail'),
    title: createMockTextField('Multiple Videos Test - Video 1'),
  },
};

export const videoPropsPlaylistUrl: VideoComponentProps = {
  ...defaultVideoProps,
  fields: {
    video: createMockLinkField(
      'https://www.youtube.com/playlist?list=PLrAXtmRdnEQy8Kx',
      'Audio Equipment Playlist'
    ),
    image: createMockImageField('/images/playlist.jpg', 'Playlist thumbnail'),
    title: createMockTextField('Professional Audio Equipment Video Series'),
  },
};

export const videoPropsShortUrl: VideoComponentProps = {
  ...defaultVideoProps,
  fields: {
    video: createMockLinkField('https://youtu.be/dQw4w9WgXcQ', 'Short YouTube URL'),
    image: createMockImageField('/images/short-url.jpg', 'Short URL video'),
    title: createMockTextField('Video with Short URL'),
  },
};

export const videoPropsEmbedUrl: VideoComponentProps = {
  ...defaultVideoProps,
  fields: {
    video: createMockLinkField('https://www.youtube.com/embed/dQw4w9WgXcQ', 'Embed URL Video'),
    image: createMockImageField('/images/embed.jpg', 'Embed URL video'),
    title: createMockTextField('Video with Embed URL'),
  },
};

// Mock video context states
export const mockVideoContextDefault = {
  playingVideoId: null,
  setPlayingVideoId: jest.fn(),
};

export const mockVideoContextPlaying = {
  playingVideoId: 'dQw4w9WgXcQ',
  setPlayingVideoId: jest.fn(),
};

export const mockVideoContextPlayingOther = {
  playingVideoId: 'other-video-id',
  setPlayingVideoId: jest.fn(),
};

// Mock video modal states
export const mockVideoModalDefault = {
  isOpen: false,
  openModal: jest.fn(),
  closeModal: jest.fn(),
};

export const mockVideoModalOpen = {
  isOpen: true,
  openModal: jest.fn(),
  closeModal: jest.fn(),
};

// Mock mobile detection results
export const mockIsMobileTrue = true;
export const mockIsMobileFalse = false;

// Mock useSitecore contexts for testing
export const mockUseSitecoreNormal = {
  page: { mode: { isEditing: false } },
} as unknown;

export const mockUseSitecoreEditing = {
  page: { mode: { isEditing: true } },
} as unknown;
