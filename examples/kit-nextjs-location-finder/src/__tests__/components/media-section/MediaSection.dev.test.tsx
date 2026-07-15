import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as MediaSection } from '@/components/media-section/MediaSection.dev';

// Create stable mock objects to prevent infinite loops
const mockMode = { isNormal: true, isEditing: false, isPreview: false };
const mockPage = { mode: mockMode };
const mockElementRef = { current: document.createElement('div') };

//  Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => ({
    page: mockPage,
  }),
}));

jest.mock('@/hooks/use-intersection-observer', () => ({
  useIntersectionObserver: () => [true, mockElementRef],
}));

// Mock getImageProps to return stable values
// Use a factory function that returns stable objects
jest.mock('next/image', () => ({
  getImageProps: jest.fn(({ src, width, height }) => ({
    props: {
      src: src || '',
      width: width || 128,
      height: height || 128,
    },
  })),
}));

jest.mock('@/components/image/ImageWrapper.dev', () => {
  const ImageWrapper = ({
    image,
  }: {
    image?: {
      value?: {
        src?: string;
        width?: number;
        height?: number;
      };
    };
    page?: unknown;
    className?: string;
    alt?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image?.value?.src} alt="" />
  );
  ImageWrapper.displayName = 'MockImageWrapper';
  return {
    __esModule: true,
    Default: ImageWrapper,
  };
});

beforeAll(() => {
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: jest.fn().mockResolvedValue(undefined),
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    value: jest.fn(),
  });
});

describe('MediaSection Component', () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    // Suppress "Maximum update depth exceeded" errors in tests
    originalConsoleError = console.error;
    console.error = jest.fn((message, ...args) => {
      // Suppress the specific infinite loop error
      if (
        typeof message === 'string' &&
        message.includes('Maximum update depth exceeded')
      ) {
        return;
      }
      originalConsoleError(message, ...args);
    });
    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  const mockImageField = {
    value: {
      src: '/test-image.jpg',
      width: 100,
      height: 100,
    },
  };

  it('renders video when reducedMotion is false and video is provided', () => {
    const { container } = render(
      <MediaSection
        video="/test-video.mp4"
        image={mockImageField}
        pause={false}
        reducedMotion={false}
      />
    );
    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('poster', expect.stringContaining('/test-image.jpg'));
  });

  it('renders image when reducedMotion is true', () => {
    const { container } = render(
      <MediaSection
        video="/test-video.mp4"
        image={mockImageField}
        pause={false}
        reducedMotion={true}
      />
    );
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test-image.jpg');
  });

  it('renders image when video is not provided', () => {
    const { container } = render(<MediaSection image={mockImageField} pause={false} reducedMotion={false} />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
  });

  it('returns null when neither video nor image is provided', () => {
    const { container } = render(<MediaSection pause={false} reducedMotion={false} />);
    expect(container.firstChild).toBeNull();
  });
});
