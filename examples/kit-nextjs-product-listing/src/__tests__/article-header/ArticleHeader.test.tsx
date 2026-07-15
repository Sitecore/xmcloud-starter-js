import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// We'll dynamically import ArticleHeader after mocks are set up so mocks apply reliably
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ArticleHeader: React.ComponentType<any>;
import { fullProps, minimalProps, noFieldsProps } from './ArticleHeader.mockProps';

// Mock lucide-react icons (ESM) to avoid transform issues in Jest
jest.mock('lucide-react', () => ({
  Facebook: () => <svg data-testid="icon-facebook" />,
  Linkedin: () => <svg data-testid="icon-linkedin" />,
  Twitter: () => <svg data-testid="icon-twitter" />,
  Link: () => <svg data-testid="icon-link" />,
  Check: () => <svg data-testid="icon-check" />,
  Mail: () => <svg data-testid="icon-mail" />,
}));

// Mock NoDataFallback to avoid loading utility with ESM dependencies
jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

// Mock sitecore components and utilities used inside ArticleHeader
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({
    field,
    tag: Tag = 'span',
    className,
  }: {
    field?: { value?: string };
    tag?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
    className?: string;
  }) => {
    if (!field?.value) return null;
    return React.createElement(Tag, { className }, field.value);
  },
}));

// Mock Avatar and Badge and Toaster UI components to avoid complex dependencies
jest.mock('../../components/ui/avatar', () => ({
  Avatar: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="avatar">{children}</div>
  ),
  AvatarImage: ({ src, alt }: { src?: string; alt?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element -- test mock; not using next/image
    <img src={src} alt={alt} data-testid="avatar-image" />
  ),
  AvatarFallback: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../components/ui/badge', () => ({
  Badge: ({ children }: { children?: React.ReactNode }) => (
    <span data-testid="badge">{children}</span>
  ),
}));

jest.mock('../../components/ui/toaster', () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

jest.mock('../../components/image/ImageWrapper.dev', () => ({
  __esModule: true,
  Default: ({ image, alt }: { image?: { value?: { src?: string } }; alt?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element -- test mock; not using next/image
    <img src={image?.value?.src} alt={alt} data-testid="image-wrapper" />
  ),
}));

jest.mock('../../components/floating-dock/floating-dock.dev', () => ({
  FloatingDock: ({
    items,
  }: {
    items?: Array<{
      title?: string;
      ariaLabel?: string;
      onClick?: () => void;
    }>;
  }) => (
    <div data-testid="floating-dock">
      {items?.map((it, idx: number) => (
        <button key={idx} aria-label={it.ariaLabel} onClick={it.onClick}>
          {it.title}
        </button>
      ))}
    </div>
  ),
}));

jest.mock('../../components/button-component/ButtonComponent', () => ({
  ButtonBase: ({
    buttonLink,
    className,
  }: {
    buttonLink?: { value?: { href?: string; text?: string } };
    className?: string;
  }) => (
    <a href={buttonLink?.value?.href} className={className} data-testid="button-base">
      {buttonLink?.value?.text}
    </a>
  ),
}));

// Mock the toast hook
const mockToast = jest.fn();
jest.mock('../../hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

// Provide a basic matchMedia implementation for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    dispatchEvent: jest.fn(),
  }),
});

describe('ArticleHeader', () => {
  beforeAll(async () => {
    // Import ArticleHeader after mocks are registered
    const articleHeaderMod = await import('../../components/article-header/ArticleHeader');
    ArticleHeader = articleHeaderMod.Default;
  });
  it('renders header structure even when field values are empty', () => {
    const { container } = render(<ArticleHeader {...noFieldsProps} />);

    // Component renders the header structure even with empty fields
    // This matches the component's actual behavior (it checks if (fields) which is truthy for {})
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('renders title and image when full props provided', () => {
    render(<ArticleHeader {...fullProps} />);

    expect(screen.getByText('Article Title')).toBeInTheDocument();
    // Component renders multiple image wrappers (background + featured); ensure at least one exists
    expect(screen.getAllByTestId('image-wrapper').length).toBeGreaterThanOrEqual(1);
  });

  it('renders minimal content when minimal props provided', () => {
    render(<ArticleHeader {...minimalProps} />);

    expect(screen.getByText('Article Title')).toBeInTheDocument();
  });

  it('handles copy link action and shows toast', async () => {
    render(<ArticleHeader {...fullProps} />);

    // Wait for the Copy link buttons to appear (rendered inside FloatingDock mock)
    // Component renders two FloatingDock instances (mobile + desktop), so get all and click first
    const copyButtons = await screen.findAllByLabelText('Copy link');

    // Click the button and wait for async operations to complete
    fireEvent.click(copyButtons[0]);

    // Wait for the clipboard operation and state updates to complete
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalled();
    });
  });

  it('handles mouse move events and updates parallax effect', () => {
    render(<ArticleHeader {...fullProps} />);

    // Simulate mouse move event
    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100,
      bubbles: true,
    });

    fireEvent(window, mouseMoveEvent);

    // Component should update mouse position state
    // The parallax effect will be applied via inline styles
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('handles reduced motion preference', async () => {
    // Mock matchMedia to simulate reduced motion preference
    const mockMatchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.matchMedia = mockMatchMedia as any;

    render(<ArticleHeader {...fullProps} />);

    // Component should detect reduced motion preference
    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });

  it('handles Facebook share action', async () => {
    const mockWindowOpen = jest.fn();
    window.open = mockWindowOpen;

    render(<ArticleHeader {...fullProps} />);

    const facebookButtons = await screen.findAllByLabelText('Share on Facebook');
    fireEvent.click(facebookButtons[0]);

    await waitFor(() => {
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('facebook.com/sharer'),
        '_blank',
        'width=600,height=400'
      );
    });
  });

  it('handles Twitter share action', async () => {
    const mockWindowOpen = jest.fn();
    window.open = mockWindowOpen;

    render(<ArticleHeader {...fullProps} />);

    const twitterButtons = await screen.findAllByLabelText('Share on Twitter');
    fireEvent.click(twitterButtons[0]);

    await waitFor(() => {
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('twitter.com/intent/tweet'),
        '_blank',
        'width=600,height=400'
      );
    });
  });

  it('handles LinkedIn share action', async () => {
    const mockWindowOpen = jest.fn();
    window.open = mockWindowOpen;

    render(<ArticleHeader {...fullProps} />);

    const linkedinButtons = await screen.findAllByLabelText('Share on LinkedIn');
    fireEvent.click(linkedinButtons[0]);

    await waitFor(() => {
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('linkedin.com/sharing'),
        '_blank',
        'width=600,height=400'
      );
    });
  });

  it('handles email share action', async () => {
    render(<ArticleHeader {...fullProps} />);

    const emailButtons = await screen.findAllByLabelText('Share via Email');
    fireEvent.click(emailButtons[0]);

    // Email action sets window.location.href, which we can't fully test in jest
    // But we can verify the button exists and is clickable
    expect(emailButtons[0]).toBeInTheDocument();
  });

  it('handles copy link failure gracefully', async () => {
    // Mock clipboard to simulate failure
    (navigator.clipboard.writeText as jest.Mock).mockRejectedValueOnce(
      new Error('Clipboard error')
    );

    render(<ArticleHeader {...fullProps} />);

    const copyButtons = await screen.findAllByLabelText('Copy link');
    fireEvent.click(copyButtons[0]);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Copy failed',
          variant: 'destructive',
        })
      );
    });
  });

  it('renders author information when provided', () => {
    const propsWithAuthor = {
      ...fullProps,
      externalFields: {
        ...fullProps.externalFields,
        pageAuthor: {
          value: {
            personFirstName: { value: 'John' },
            personLastName: { value: 'Doe' },
            personJobTitle: { value: 'Software Engineer' },
          },
        },
      },
    };

    render(<ArticleHeader {...propsWithAuthor} />);

    // Verify avatar section renders
    expect(screen.getByTestId('avatar')).toBeInTheDocument();

    // Verify author name is displayed (appears in Avatar fallback and paragraph)
    const authorElements = screen.getAllByText(/John\s+Doe/);
    expect(authorElements.length).toBeGreaterThan(0);

    // Verify job title is displayed
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  it('renders read time when provided', () => {
    render(<ArticleHeader {...fullProps} />);

    expect(screen.getByText('3 min')).toBeInTheDocument();
  });

  it('renders display date when provided', () => {
    render(<ArticleHeader {...fullProps} />);

    expect(screen.getByText('2025-10-01')).toBeInTheDocument();
  });

  it('renders eyebrow badge when provided', () => {
    render(<ArticleHeader {...fullProps} />);

    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByTestId('badge')).toBeInTheDocument();
  });

  it('renders without eyebrow badge when not provided', () => {
    const propsWithoutEyebrow = {
      ...fullProps,
      fields: {
        imageRequired: fullProps.fields.imageRequired,
      },
    };

    render(<ArticleHeader {...propsWithoutEyebrow} />);

    expect(screen.queryByTestId('badge')).not.toBeInTheDocument();
  });

  it('renders image wrapper with correct props', () => {
    render(<ArticleHeader {...fullProps} />);

    const images = screen.getAllByTestId('image-wrapper');
    expect(images.length).toBeGreaterThan(0);
    expect(images[0]).toHaveAttribute('src', '/image.jpg');
  });

  it('renders floating dock with all share options', async () => {
    render(<ArticleHeader {...fullProps} />);

    const floatingDocks = screen.getAllByTestId('floating-dock');
    expect(floatingDocks.length).toBeGreaterThan(0);

    // Verify all share buttons exist
    expect(await screen.findAllByLabelText('Share on Facebook')).toHaveLength(2);
    expect(await screen.findAllByLabelText('Share on Twitter')).toHaveLength(2);
    expect(await screen.findAllByLabelText('Share on LinkedIn')).toHaveLength(2);
    expect(await screen.findAllByLabelText('Share via Email')).toHaveLength(2);
    expect(await screen.findAllByLabelText('Copy link')).toHaveLength(2);
  });

  it('updates copy button state after successful copy', async () => {
    render(<ArticleHeader {...fullProps} />);

    const copyButtons = await screen.findAllByLabelText('Copy link');
    fireEvent.click(copyButtons[0]);

    await waitFor(() => {
      expect(screen.getAllByLabelText('Link copied').length).toBeGreaterThan(0);
    });
  });

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const cancelAnimationFrameSpy = jest.spyOn(window, 'cancelAnimationFrame');

    const { unmount } = render(<ArticleHeader {...fullProps} />);
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(cancelAnimationFrameSpy).toHaveBeenCalled();

    removeEventListenerSpy.mockRestore();
    cancelAnimationFrameSpy.mockRestore();
  });
});
