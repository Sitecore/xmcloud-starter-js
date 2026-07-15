import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Default as AlertBanner } from '@/components/alert-banner/AlertBanner.dev';
import {
  defaultProps,
  propsWithoutLink,
  propsWithoutImage,
  propsWithEmptyLink,
  propsMinimal,
  propsWithEmptyTitle,
  propsWithEmptyDescription,
  propsWithoutFields,
  propsWithEmptyParams,
  type AlertBannerFieldsType,
} from './AlertBanner.mockProps';

// Mock the cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) => {
    return args
      .flat(2)
      .filter(Boolean)
      .map((arg) => {
        if (typeof arg === 'string') return arg;
        if (typeof arg === 'object' && arg !== null && !Array.isArray(arg)) {
          return Object.entries(arg)
            .filter(([, value]) => Boolean(value))
            .map(([key]) => key)
            .join(' ');
        }
        return '';
      })
      .filter(Boolean)
      .join(' ')
      .trim();
  },
}));

// Mock the Sitecore Content SDK components
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag, className }: { field?: { value?: string }; tag?: string; className?: string }) => {
    const Tag = (tag || 'span') as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, { className, 'data-testid': 'text-field' }, field?.value || '');
  },
}));

// Mock the Button component
jest.mock('@/components/button-component/ButtonComponent', () => ({
  ButtonBase: ({ buttonLink, variant }: { buttonLink?: { value?: { href?: string; text?: string } }; variant?: string }) => (
    <a
      href={buttonLink?.value?.href || '#'}
      data-testid="alert-button"
      data-variant={variant}
    >
      {buttonLink?.value?.text || 'Button'}
    </a>
  ),
  EditableButton: ({ buttonLink, variant }: { buttonLink?: { value?: { href?: string; text?: string } }; variant?: string }) => (
    <a
      href={buttonLink?.value?.href || '#'}
      data-testid="alert-button"
      data-variant={variant}
    >
      {buttonLink?.value?.text || 'Button'}
    </a>
  ),
}));

// Mock the UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, size, onClick, className }: { children?: React.ReactNode; variant?: string; size?: string; onClick?: () => void; className?: string }) => (
    <button
      className={className}
      data-testid="close-button"
      data-variant={variant}
      data-size={size}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/alert', () => ({
  Alert: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="alert" role="alert">
      {children}
    </div>
  ),
  AlertTitle: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="alert-title">
      {children}
    </div>
  ),
  AlertDescription: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="alert-description">
      {children}
    </div>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  X: () => <span data-testid="x-icon">X</span>,
}));

// Mock NoDataFallback
jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName?: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('AlertBanner Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render alert banner with all fields', () => {
      render(<AlertBanner {...defaultProps} />);

      expect(screen.getByTestId('alert')).toBeInTheDocument();
      expect(screen.getByText('Important Announcement')).toBeInTheDocument();
      expect(screen.getByText('Please read this important message carefully')).toBeInTheDocument();
      expect(screen.getByTestId('alert-button')).toBeInTheDocument();
      expect(screen.getByTestId('close-button')).toBeInTheDocument();
    });

    it('should render title in AlertTitle component', () => {
      render(<AlertBanner {...defaultProps} />);

      const alertTitle = screen.getByTestId('alert-title');
      expect(alertTitle).toContainElement(screen.getByText('Important Announcement'));
    });

    it('should render description in AlertDescription component', () => {
      render(<AlertBanner {...defaultProps} />);

      const alertDescription = screen.getByTestId('alert-description');
      expect(alertDescription).toContainElement(
        screen.getByText('Please read this important message carefully')
      );
    });

    it('should render close button with X icon', () => {
      render(<AlertBanner {...defaultProps} />);

      const closeButton = screen.getByTestId('close-button');
      expect(closeButton).toContainElement(screen.getByTestId('x-icon'));
    });

    it('should render link button when link is provided', () => {
      render(<AlertBanner {...defaultProps} />);

      const button = screen.getByTestId('alert-button');
      expect(button).toHaveAttribute('href', '/learn-more');
      expect(button).toHaveTextContent('Learn More');
    });
  });

  describe('Optional fields handling', () => {
    it('should render without link field', () => {
      render(<AlertBanner {...propsWithoutLink} />);

      expect(screen.getByText('Important Announcement')).toBeInTheDocument();
      expect(screen.getByText('Please read this important message carefully')).toBeInTheDocument();
      expect(screen.queryByTestId('alert-button')).not.toBeInTheDocument();
      expect(screen.getByTestId('close-button')).toBeInTheDocument();
    });

    it('should render without image field', () => {
      render(<AlertBanner {...propsWithoutImage} />);

      expect(screen.getByText('Important Announcement')).toBeInTheDocument();
      expect(screen.getByTestId('alert-button')).toBeInTheDocument();
    });

    it('should not render link button when link href is empty', () => {
      render(<AlertBanner {...propsWithEmptyLink} />);

      expect(screen.queryByTestId('alert-button')).not.toBeInTheDocument();
    });

    it('should render with only required fields', () => {
      render(<AlertBanner {...propsMinimal} />);

      expect(screen.getByText('Important Announcement')).toBeInTheDocument();
      expect(screen.getByText('Please read this important message carefully')).toBeInTheDocument();
      expect(screen.queryByTestId('alert-button')).not.toBeInTheDocument();
      expect(screen.getByTestId('close-button')).toBeInTheDocument();
    });
  });

  describe('Close functionality', () => {
    it('should hide alert when close button is clicked', () => {
      render(<AlertBanner {...defaultProps} />);

      const alert = screen.getByTestId('alert');
      expect(alert).not.toHaveClass('hidden');

      const closeButton = screen.getByTestId('close-button');
      fireEvent.click(closeButton);

      expect(alert).toHaveClass('hidden');
    });

    it('should toggle hidden class on close button click', () => {
      const { container } = render(<AlertBanner {...defaultProps} />);

      const alert = container.querySelector('[data-testid="alert"]');
      expect(alert).not.toHaveClass('hidden');

      const closeButton = screen.getByTestId('close-button');
      fireEvent.click(closeButton);

      expect(alert).toHaveClass('hidden');
    });

    it('should maintain hidden state after multiple clicks', () => {
      render(<AlertBanner {...defaultProps} />);

      const alert = screen.getByTestId('alert');
      const closeButton = screen.getByTestId('close-button');

      fireEvent.click(closeButton);
      expect(alert).toHaveClass('hidden');

      // Click again should keep it hidden (state is true)
      fireEvent.click(closeButton);
      expect(alert).toHaveClass('hidden');
    });
  });

  describe('Component structure', () => {
    it('should render correct DOM structure', () => {
      const { container } = render(<AlertBanner {...defaultProps} />);

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('relative', 'border-none');

      const mainContainer = container.querySelector('.mx-auto.flex');
      expect(mainContainer).toBeInTheDocument();
      expect(mainContainer).toHaveClass('w-full', 'max-w-screen-xl');
    });

    it('should apply correct title classes', () => {
      render(<AlertBanner {...defaultProps} />);

      const alertTitle = screen.getByTestId('alert-title');
      expect(alertTitle).toHaveClass('text-base', 'font-semibold', 'leading-none', 'tracking-tight');
    });

    it('should apply correct description classes', () => {
      render(<AlertBanner {...defaultProps} />);

      const alertDescription = screen.getByTestId('alert-description');
      expect(alertDescription).toHaveClass('text-muted-foreground', 'text-sm');
    });

    it('should render title with correct Text component classes', () => {
      render(<AlertBanner {...defaultProps} />);

      const titleText = screen.getByText('Important Announcement');
      expect(titleText).toHaveClass('font-heading', 'text-lg', 'font-semibold');
    });

    it('should render description as p tag', () => {
      render(<AlertBanner {...defaultProps} />);

      const descriptionText = screen.getByText('Please read this important message carefully');
      expect(descriptionText.tagName).toBe('P');
    });

    it('should apply correct close button attributes', () => {
      render(<AlertBanner {...defaultProps} />);

      const closeButton = screen.getByTestId('close-button');
      expect(closeButton).toHaveAttribute('data-variant', 'default');
      expect(closeButton).toHaveAttribute('data-size', 'icon');
    });
  });

  describe('Button component integration', () => {
    it('should pass correct props to ButtonBase component', () => {
      render(<AlertBanner {...defaultProps} />);

      const button = screen.getByTestId('alert-button');
      expect(button).toHaveAttribute('href', '/learn-more');
      expect(button).toHaveAttribute('data-variant', 'default');
    });

    it('should conditionally render ButtonBase based on link href', () => {
      const { rerender } = render(<AlertBanner {...defaultProps} />);
      expect(screen.getByTestId('alert-button')).toBeInTheDocument();

      rerender(<AlertBanner {...propsWithEmptyLink} />);
      expect(screen.queryByTestId('alert-button')).not.toBeInTheDocument();
    });
  });

  describe('Edge cases and fallbacks', () => {
    it('should render NoDataFallback when fields is null', () => {
      render(<AlertBanner {...(propsWithoutFields as unknown as Parameters<typeof AlertBanner>[0])} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByText('Alert Banner')).toBeInTheDocument();
    });

    it('should render NoDataFallback when fields is undefined', () => {
      const propsWithUndefinedFields = {
        ...defaultProps,
        fields: undefined as AlertBannerFieldsType | undefined,
      };

      render(<AlertBanner {...propsWithUndefinedFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByText('Alert Banner')).toBeInTheDocument();
    });

    it('should handle empty title value', () => {
      render(<AlertBanner {...propsWithEmptyTitle} />);

      const titleElements = screen.getAllByTestId('text-field');
      const titleText = titleElements.find((el) => el.textContent === '');
      expect(titleText).toBeInTheDocument();
    });

    it('should handle empty description value', () => {
      render(<AlertBanner {...propsWithEmptyDescription} />);

      expect(screen.getByText('Important Announcement')).toBeInTheDocument();
      expect(screen.getByTestId('alert-description')).toBeInTheDocument();
    });

    it('should handle empty params', () => {
      render(<AlertBanner {...propsWithEmptyParams} />);

      expect(screen.getByTestId('alert')).toBeInTheDocument();
      expect(screen.getByText('Important Announcement')).toBeInTheDocument();
    });
  });

  describe('Layout and responsiveness', () => {
    it('should apply responsive padding classes', () => {
      const { container } = render(<AlertBanner {...defaultProps} />);

      const mainContainer = container.querySelector('.mx-auto.flex');
      expect(mainContainer).toHaveClass('py-1', 'xl:px-8');
    });

    it('should render content in correct flex layout', () => {
      const { container } = render(<AlertBanner {...defaultProps} />);

      const mainContainer = container.querySelector('.mx-auto.flex');
      expect(mainContainer).toHaveClass('items-center', 'justify-between', 'gap-4');
    });

    it('should render buttons container with correct classes', () => {
      const { container } = render(<AlertBanner {...defaultProps} />);

      const buttonsContainer = container.querySelector('.flex.items-center.gap-2');
      expect(buttonsContainer).toBeInTheDocument();
      expect(buttonsContainer).toContainElement(screen.getByTestId('alert-button'));
      expect(buttonsContainer).toContainElement(screen.getByTestId('close-button'));
    });

    it('should apply spacing classes to content container', () => {
      const { container } = render(<AlertBanner {...defaultProps} />);

      const contentContainer = container.querySelector('.space-y-1');
      expect(contentContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have role="alert" on alert element', () => {
      render(<AlertBanner {...defaultProps} />);

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('should render close button as clickable element', () => {
      render(<AlertBanner {...defaultProps} />);

      const closeButton = screen.getByTestId('close-button');
      expect(closeButton.tagName).toBe('BUTTON');
    });

    it('should have proper semantic structure', () => {
      render(<AlertBanner {...defaultProps} />);

      expect(screen.getByTestId('alert-title')).toBeInTheDocument();
      expect(screen.getByTestId('alert-description')).toBeInTheDocument();
    });
  });

  describe('State management', () => {
    it('should initialize with isHidden state as false', () => {
      render(<AlertBanner {...defaultProps} />);

      const alert = screen.getByTestId('alert');
      expect(alert).not.toHaveClass('hidden');
    });

    it('should update isHidden state when close button is clicked', () => {
      render(<AlertBanner {...defaultProps} />);

      const alert = screen.getByTestId('alert');
      const closeButton = screen.getByTestId('close-button');

      expect(alert).not.toHaveClass('hidden');

      fireEvent.click(closeButton);

      expect(alert).toHaveClass('hidden');
    });
  });
});

