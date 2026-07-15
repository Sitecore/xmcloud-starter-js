import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Default as Hero } from '@/components/hero/Hero';
import {
  defaultProps,
  propsWithPrimaryScheme,
  propsWithSecondaryScheme,
  propsWithTertiaryScheme,
  propsWithDarkScheme,
  propsWithoutDescription,
  propsWithoutLink,
  propsWithOnlyTitle,
  propsWithImagesOnly,
  propsWithoutColorScheme,
  propsWithoutFields,
  propsEditing,
  mockPageData,
  mockPageDataEditing,
} from './Hero.mockProps';
import type { HeroProps } from '@/components/hero/hero.props';

// Type definitions for mock components
interface MockTextProps {
  field?: { value?: string };
  tag?: string;
  className?: string;
}

interface MockEditableButtonProps {
  buttonLink?: { value?: { href?: string; text?: string } };
  className?: string;
  isPageEditing?: boolean;
}

interface MockAnimatedSectionProps {
  children?: React.ReactNode;
  direction?: string;
  className?: string;
  isPageEditing?: boolean;
}

interface MockMediaSectionProps {
  video?: string;
  image?: { value?: { src?: string } };
  className?: string;
  pause?: boolean;
  reducedMotion?: boolean;
}

interface MockButtonProps {
  children?: React.ReactNode;
  variant?: string;
  size?: string;
  onClick?: () => void;
  className?: string;
  [key: string]: unknown;
}

interface MockNoDataFallbackProps {
  componentName?: string;
}

// Mock the cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...args: Array<string | boolean | Record<string, boolean> | undefined>) => {
    return args
      .flat()
      .filter(Boolean)
      .map((arg) => {
        if (typeof arg === 'string') return arg;
        if (typeof arg === 'object') {
          return Object.keys(arg)
            .filter((key) => arg[key])
            .join(' ');
        }
        return '';
      })
      .join(' ')
      .trim();
  },
}));

// Mock the useSitecore hook
const mockUseSitecore = jest.fn();
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => mockUseSitecore(),
  Text: ({ field, tag, className }: MockTextProps) => {
    const Tag = tag || 'span';
    return React.createElement(Tag, { className }, field?.value || '');
  },
}));

// Mock EditableButton component
jest.mock('@/components/button-component/ButtonComponent', () => ({
  EditableButton: ({ buttonLink, className, isPageEditing }: MockEditableButtonProps) => (
    <button
      data-testid="hero-button"
      data-href={buttonLink?.value?.href}
      data-editing={isPageEditing}
      className={className}
    >
      {buttonLink?.value?.text || 'Button'}
    </button>
  ),
}));

// Mock AnimatedSection component
jest.mock('@/components/animated-section/AnimatedSection.dev', () => ({
  Default: ({ children, direction, className, isPageEditing }: MockAnimatedSectionProps) => (
    <div
      data-testid="animated-section"
      data-direction={direction}
      data-editing={isPageEditing}
      className={className}
    >
      {children}
    </div>
  ),
}));

// Mock MediaSection component
jest.mock('@/components/media-section/MediaSection.dev', () => ({
  Default: ({ video, image, className, pause, reducedMotion }: MockMediaSectionProps) => (
    <div
      data-testid="media-section"
      data-video={video}
      data-image={image?.value?.src}
      data-pause={pause}
      data-reduced-motion={reducedMotion}
      className={className}
    />
  ),
}));

// Mock UI Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, size, onClick, className, ...props }: MockButtonProps) => (
    <button
      data-testid="control-button"
      data-variant={variant}
      data-size={size}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Play: () => React.createElement('div', { 'data-testid': 'play-icon' }, 'Play'),
  Pause: () => React.createElement('div', { 'data-testid': 'pause-icon' }, 'Pause'),
}));

// Mock NoDataFallback
jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: MockNoDataFallbackProps) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('Hero Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSitecore.mockReturnValue(mockPageData);

    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  describe('Basic rendering', () => {
    it('should render hero with all fields', () => {
      render(<Hero {...defaultProps} />);

      expect(screen.getByText('Welcome to Our Platform')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Discover amazing features and transform your experience with our innovative solutions.'
        )
      ).toBeInTheDocument();
      expect(screen.getByTestId('hero-button')).toBeInTheDocument();
    });

    it('should render as section element', () => {
      const { container } = render(<Hero {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('hero', '@container');
    });

    it('should render title as h1 tag', () => {
      render(<Hero {...defaultProps} />);

      const title = screen.getByText('Welcome to Our Platform');
      expect(title.tagName).toBe('H1');
    });

    it('should render description as p tag', () => {
      render(<Hero {...defaultProps} />);

      const description = screen.getByText(/Discover amazing features/);
      expect(description.tagName).toBe('P');
    });
  });

  describe('Color scheme variants', () => {
    it('should apply light color scheme classes', () => {
      const { container } = render(<Hero {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-light', 'text-primary');
    });

    it('should apply primary color scheme classes', () => {
      const { container } = render(<Hero {...propsWithPrimaryScheme} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('should apply secondary color scheme classes', () => {
      const { container } = render(<Hero {...propsWithSecondaryScheme} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-secondary', 'text-primary');
    });

    it('should apply tertiary color scheme classes', () => {
      const { container } = render(<Hero {...propsWithTertiaryScheme} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-tertiary', 'text-primary');
    });

    it('should apply dark color scheme classes', () => {
      const { container } = render(<Hero {...propsWithDarkScheme} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-dark', 'text-primary');
    });

    it('should apply default light scheme when colorScheme is not provided', () => {
      const { container } = render(<Hero {...propsWithoutColorScheme} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-light', 'text-primary');
    });

    it('should apply correct text color for description with primary scheme', () => {
      render(<Hero {...propsWithPrimaryScheme} />);

      const description = screen.getByText(/Discover amazing features/);
      expect(description).toHaveClass('text-primary-foreground');
    });

    it('should apply correct text color for description with non-primary schemes', () => {
      render(<Hero {...propsWithSecondaryScheme} />);

      const description = screen.getByText(/Discover amazing features/);
      expect(description).toHaveClass('text-secondary-foreground');
    });

    it('should apply correct button classes for primary scheme', () => {
      render(<Hero {...propsWithPrimaryScheme} />);

      const button = screen.getByTestId('hero-button');
      expect(button).toHaveClass('text-primary', 'bg-white', 'hover:bg-gray-100');
    });
  });

  describe('Optional fields handling', () => {
    it('should render without description field', () => {
      render(<Hero {...propsWithoutDescription} />);

      expect(screen.getByText('Welcome to Our Platform')).toBeInTheDocument();
      expect(screen.queryByText(/Discover amazing features/)).not.toBeInTheDocument();
      expect(screen.getByTestId('hero-button')).toBeInTheDocument();
    });

    it('should render without link field', () => {
      render(<Hero {...propsWithoutLink} />);

      expect(screen.getByText('Welcome to Our Platform')).toBeInTheDocument();
      expect(screen.getByText(/Discover amazing features/)).toBeInTheDocument();
      expect(screen.queryByTestId('hero-button')).not.toBeInTheDocument();
    });

    it('should render with only title', () => {
      render(<Hero {...propsWithOnlyTitle} />);

      expect(screen.getByText('Welcome to Our Platform')).toBeInTheDocument();
      expect(screen.queryByText(/Discover amazing features/)).not.toBeInTheDocument();
      expect(screen.queryByTestId('hero-button')).not.toBeInTheDocument();
    });
  });

  describe('Media sections rendering', () => {
    it('should render all four media sections', () => {
      render(<Hero {...defaultProps} />);

      const mediaSections = screen.getAllByTestId('media-section');
      expect(mediaSections).toHaveLength(4);
    });

    it('should render media sections with videos', () => {
      render(<Hero {...defaultProps} />);

      const mediaSections = screen.getAllByTestId('media-section');
      expect(mediaSections[0]).toHaveAttribute('data-video', '/videos/hero-video-1.mp4');
      expect(mediaSections[1]).toHaveAttribute('data-video', '/videos/hero-video-2.mp4');
      expect(mediaSections[2]).toHaveAttribute('data-video', '/videos/hero-video-3.mp4');
      expect(mediaSections[3]).toHaveAttribute('data-video', '/videos/hero-video-4.mp4');
    });

    it('should render media sections with images', () => {
      render(<Hero {...defaultProps} />);

      const mediaSections = screen.getAllByTestId('media-section');
      expect(mediaSections[0]).toHaveAttribute('data-image', '/images/hero-image-1.jpg');
      expect(mediaSections[1]).toHaveAttribute('data-image', '/images/hero-image-2.jpg');
      expect(mediaSections[2]).toHaveAttribute('data-image', '/images/hero-image-3.jpg');
      expect(mediaSections[3]).toHaveAttribute('data-image', '/images/hero-image-4.jpg');
    });

    it('should render media sections with correct aspect ratios', () => {
      render(<Hero {...defaultProps} />);

      const mediaSections = screen.getAllByTestId('media-section');
      expect(mediaSections[0]).toHaveClass('aspect-280/356');
      expect(mediaSections[1]).toHaveClass('aspect-280/196');
      expect(mediaSections[2]).toHaveClass('aspect-280/356');
      expect(mediaSections[3]).toHaveClass('aspect-280/356');
    });

    it('should render media sections with images only', () => {
      render(<Hero {...propsWithImagesOnly} />);

      const mediaSections = screen.getAllByTestId('media-section');
      expect(mediaSections).toHaveLength(4);
      // When no videos, data-video attribute might be undefined or empty
      mediaSections.forEach((section) => {
        const videoAttr = section.getAttribute('data-video');
        expect(videoAttr === null || videoAttr === '' || videoAttr === 'undefined').toBe(true);
      });
    });
  });

  describe('Play/Pause control', () => {
    it('should render play/pause button', () => {
      render(<Hero {...defaultProps} />);

      const controlButton = screen.getByTestId('control-button');
      expect(controlButton).toBeInTheDocument();
    });

    it('should show pause icon when playing', () => {
      render(<Hero {...defaultProps} />);

      expect(screen.getByTestId('pause-icon')).toBeInTheDocument();
    });

    it('should toggle play/pause state on button click', () => {
      render(<Hero {...defaultProps} />);

      const controlButton = screen.getByTestId('control-button');
      
      // Initially showing pause icon (playing)
      expect(screen.getByTestId('pause-icon')).toBeInTheDocument();
      
      // Click to pause
      fireEvent.click(controlButton);
      
      // Should now show play icon
      expect(screen.getByTestId('play-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('pause-icon')).not.toBeInTheDocument();
    });

    it('should have correct aria-label when playing', () => {
      render(<Hero {...defaultProps} />);

      const controlButton = screen.getByTestId('control-button');
      expect(controlButton).toHaveAttribute('aria-label', 'Pause Ambient Video');
    });

    it('should have correct aria-label when paused', () => {
      render(<Hero {...defaultProps} />);

      const controlButton = screen.getByTestId('control-button');
      fireEvent.click(controlButton);
      
      expect(controlButton).toHaveAttribute('aria-label', 'Play Ambient');
    });

    it('should not render control button when prefers-reduced-motion is set', () => {
      window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(<Hero {...defaultProps} />);

      expect(screen.queryByTestId('control-button')).not.toBeInTheDocument();
    });
  });

  describe('Editing mode behavior', () => {
    it('should render fields in editing mode even without values', () => {
      mockUseSitecore.mockReturnValue(mockPageDataEditing);
      render(<Hero {...propsEditing} />);

      expect(screen.getByTestId('animated-section')).toHaveAttribute('data-editing', 'true');
    });

    it('should pass editing state to EditableButton', () => {
      mockUseSitecore.mockReturnValue(mockPageDataEditing);
      render(<Hero {...propsEditing} />);

      const button = screen.getByTestId('hero-button');
      expect(button).toHaveAttribute('data-editing', 'true');
    });

    it('should set reducedMotion to true in editing mode', () => {
      mockUseSitecore.mockReturnValue(mockPageDataEditing);
      render(<Hero {...propsEditing} />);

      const mediaSections = screen.getAllByTestId('media-section');
      mediaSections.forEach((section) => {
        expect(section).toHaveAttribute('data-reduced-motion', 'true');
      });
    });
  });

  describe('AnimatedSection integration', () => {
    it('should render content in AnimatedSection', () => {
      render(<Hero {...defaultProps} />);

      const animatedSection = screen.getByTestId('animated-section');
      expect(animatedSection).toBeInTheDocument();
      expect(animatedSection).toHaveAttribute('data-direction', 'up');
    });

    it('should apply correct classes to AnimatedSection', () => {
      render(<Hero {...defaultProps} />);

      const animatedSection = screen.getByTestId('animated-section');
      expect(animatedSection).toHaveClass('@lg:flex-row', '@lg:items-center', '@lg:gap-10');
    });
  });

  describe('Component structure', () => {
    it('should apply custom styles from params', () => {
      const { container } = render(<Hero {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-hero-style');
    });

    it('should apply container query classes', () => {
      const { container } = render(<Hero {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('@container');
    });

    it('should apply correct padding classes', () => {
      const { container } = render(<Hero {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('py-24');
    });

    it('should apply overflow-hidden class', () => {
      const { container } = render(<Hero {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('overflow-hidden');
    });
  });

  describe('Edge cases and fallbacks', () => {
    it('should render NoDataFallback when fields is null', () => {
      render(<Hero {...propsWithoutFields} />);

      const fallback = screen.getByTestId('no-data-fallback');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent('Hero');
    });

    it('should render NoDataFallback when fields is undefined', () => {
      const propsWithUndefinedFields = {
        ...defaultProps,
        fields: undefined as unknown as HeroProps['fields'],
      };

      render(<Hero {...propsWithUndefinedFields} />);

      const fallback = screen.getByTestId('no-data-fallback');
      expect(fallback).toBeInTheDocument();
    });
  });

  describe('CSS classes and styling', () => {
    it('should apply correct title classes', () => {
      render(<Hero {...defaultProps} />);

      const title = screen.getByText('Welcome to Our Platform');
      expect(title).toHaveClass(
        'font-heading',
        '@lg:text-8xl',
        '@lg:leading-[90px]',
        'text-5xl',
        'font-normal',
        'leading-[60px]'
      );
    });

    it('should apply correct description classes', () => {
      render(<Hero {...defaultProps} />);

      const description = screen.getByText(/Discover amazing features/);
      expect(description).toHaveClass('font-body', 'text-medium', '@md:text-xl', 'text-lg');
    });

    it('should apply responsive gap classes to content', () => {
      const { container } = render(<Hero {...defaultProps} />);

      // Check for the class by looking at the element's className
      const contentDiv = Array.from(container.querySelectorAll('div')).find(
        (div) => div.className && div.className.includes('@lg:gap-10')
      );
      expect(contentDiv).toBeTruthy();
    });

    it('should apply correct media section container classes', () => {
      const { container } = render(<Hero {...defaultProps} />);

      // Check for the class by looking at the element's className
      const mediaContainer = Array.from(container.querySelectorAll('div')).find(
        (div) => div.className && div.className.includes('@lg:min-w-[120%]')
      );
      expect(mediaContainer).toBeTruthy();
      if (mediaContainer) {
        expect(mediaContainer.className).toContain('gap-4');
      }
    });
  });

  describe('Accessibility', () => {
    it('should render control button with proper aria-label', () => {
      render(<Hero {...defaultProps} />);

      const controlButton = screen.getByTestId('control-button');
      expect(controlButton).toHaveAttribute('aria-label');
    });

    it('should respect prefers-reduced-motion setting', () => {
      window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(<Hero {...defaultProps} />);

      const mediaSections = screen.getAllByTestId('media-section');
      mediaSections.forEach((section) => {
        expect(section).toHaveAttribute('data-reduced-motion', 'true');
      });
    });
  });
});

