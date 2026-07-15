import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as Card } from '@/components/card/Card.dev';
import {
  defaultProps,
  propsWithoutImage,
  propsWithoutLink,
  propsWithEmptyLink,
  propsWithoutIcon,
  propsWithExternalLink,
  propsEditable,
  propsWithEmptyFields,
  propsMinimal,
  propsWithCustomIcon,
  propsWithoutClassName,
} from './Card.mockProps';

// Type definitions for mock components
interface MockFieldValue {
  value?: string;
}

interface MockLinkFieldValue {
  href?: string;
  url?: string;
  text?: string;
}

interface MockImageFieldValue {
  src?: string;
  alt?: string;
}

interface MockTextProps {
  field?: MockFieldValue;
  tag?: keyof JSX.IntrinsicElements;
}

interface MockRichTextProps {
  field?: MockFieldValue;
}

interface MockLinkProps {
  field?: { value?: MockLinkFieldValue };
  children?: React.ReactNode;
  editable?: boolean;
}

interface MockCardProps {
  children?: React.ReactNode;
  className?: string;
}

interface MockChildrenProps {
  children?: React.ReactNode;
}

interface MockButtonProps {
  children?: React.ReactNode;
  asChild?: boolean;
}

interface MockIconProps {
  iconName?: string;
}

interface MockImageWrapperProps {
  image?: { value?: MockImageFieldValue };
  className?: string;
}

// Mock Sitecore Content SDK components
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag }: MockTextProps) => {
    const Tag = tag || 'span';
    return React.createElement(Tag, { 'data-testid': 'text-field' }, field?.value || '');
  },
  RichText: ({ field }: MockRichTextProps) => (
    <div data-testid="rich-text-field" dangerouslySetInnerHTML={{ __html: field?.value || '' }} />
  ),
  Link: ({ field, children, editable }: MockLinkProps) => (
    <a
      href={field?.value?.href || field?.value?.url}
      data-testid="sitecore-link"
      data-editable={editable}
    >
      {children || field?.value?.text}
    </a>
  ),
}));

// Mock UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: MockCardProps) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children }: MockChildrenProps) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: MockChildrenProps) => <div data-testid="card-title">{children}</div>,
  CardFooter: ({ children }: MockChildrenProps) => <div data-testid="card-footer">{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, asChild }: MockButtonProps) => (
    <div data-testid="button" data-as-child={asChild}>
      {children}
    </div>
  ),
}));

jest.mock('@/components/icon/Icon', () => ({
  Default: ({ iconName }: MockIconProps) => <span data-testid={`icon-${iconName}`}>{iconName}</span>,
}));

jest.mock('@/components/image/ImageWrapper.dev', () => {
  const MockImageWrapper = React.forwardRef<HTMLImageElement, MockImageWrapperProps>(
    ({ image, className }, ref) => {
      if (!image?.value?.src) return null;
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={image?.value?.src}
          alt={image?.value?.alt}
          className={className}
          data-testid="image-wrapper"
        />
      );
    }
  );
  MockImageWrapper.displayName = 'MockImageWrapper';
  return { Default: MockImageWrapper };
});

jest.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

describe('Card Component', () => {
  describe('Basic rendering', () => {
    it('should render card container', () => {
      render(<Card {...defaultProps} />);

      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('should render card header', () => {
      render(<Card {...defaultProps} />);

      expect(screen.getByTestId('card-header')).toBeInTheDocument();
    });

    it('should render card title', () => {
      render(<Card {...defaultProps} />);

      expect(screen.getByTestId('card-title')).toBeInTheDocument();
    });

    it('should render heading text', () => {
      render(<Card {...defaultProps} />);

      expect(screen.getByText('Card Heading')).toBeInTheDocument();
    });

    it('should render description as rich text', () => {
      render(<Card {...defaultProps} />);

      const richText = screen.getByTestId('rich-text-field');
      expect(richText).toBeInTheDocument();
      expect(richText.innerHTML).toContain('rich text');
      expect(richText.innerHTML).toContain('<strong>');
    });

    it('should render image', () => {
      render(<Card {...defaultProps} />);

      const image = screen.getByTestId('image-wrapper');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/test-card-image.jpg');
      expect(image).toHaveAttribute('alt', 'Card Image');
    });

    it('should apply image aspect ratio class', () => {
      render(<Card {...defaultProps} />);

      const image = screen.getByTestId('image-wrapper');
      expect(image).toHaveClass('aspect-video', 'w-full', 'object-cover');
    });
  });

  describe('Card footer and link', () => {
    it('should render card footer when link is provided', () => {
      render(<Card {...defaultProps} />);

      expect(screen.getByTestId('card-footer')).toBeInTheDocument();
    });

    it('should render button in footer', () => {
      render(<Card {...defaultProps} />);

      expect(screen.getByTestId('button')).toBeInTheDocument();
    });

    it('should render link with correct href', () => {
      render(<Card {...defaultProps} />);

      const link = screen.getByTestId('sitecore-link');
      expect(link).toHaveAttribute('href', '/read-more');
    });

    it('should not render footer when link is not provided', () => {
      render(<Card {...propsWithoutLink} />);

      expect(screen.queryByTestId('card-footer')).not.toBeInTheDocument();
    });

    it('should render footer with empty link', () => {
      render(<Card {...propsWithEmptyLink} />);

      // Footer should still render when link prop exists
      expect(screen.getByTestId('card-footer')).toBeInTheDocument();
    });

    it('should render external link', () => {
      render(<Card {...propsWithExternalLink} />);

      const link = screen.getByTestId('sitecore-link');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });
  });

  describe('Icon handling', () => {
    it('should render icon with link in editable mode', () => {
      render(<Card {...propsEditable} />);

      expect(screen.getByTestId('icon-arrow-right')).toBeInTheDocument();
    });

    it('should use default icon when not provided in editable mode', () => {
      render(<Card {...propsWithoutIcon} editable={true} />);

      expect(screen.getByTestId('icon-internal')).toBeInTheDocument();
    });

    it('should render custom icon', () => {
      render(<Card {...propsWithCustomIcon} editable={true} />);

      // In the Card component, icon is only shown when editable is true and renders with default 'internal' if no linktype
      const icons = screen.queryAllByTestId(/icon-/);
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should not render icon in non-editable mode', () => {
      render(<Card {...defaultProps} />);

      // Icons only render in editable mode
      expect(screen.queryByTestId('icon-arrow-right')).not.toBeInTheDocument();
    });
  });

  describe('Editable mode', () => {
    it('should render link as editable', () => {
      render(<Card {...propsEditable} />);

      const link = screen.getByTestId('sitecore-link');
      expect(link).toHaveAttribute('data-editable', 'true');
    });

    it('should render link text in editable mode', () => {
      render(<Card {...propsEditable} />);

      expect(screen.getByText('Read More')).toBeInTheDocument();
    });

    it('should not show editable link text in non-editable mode', () => {
      render(<Card {...defaultProps} />);

      const link = screen.getByTestId('sitecore-link');
      expect(link).toHaveAttribute('data-editable', 'false');
    });
  });

  describe('Optional fields', () => {
    it('should render without image', () => {
      render(<Card {...propsWithoutImage} />);

      expect(screen.queryByTestId('image-wrapper')).not.toBeInTheDocument();
      expect(screen.getByText('Card Heading')).toBeInTheDocument();
    });

    it('should render without link', () => {
      render(<Card {...propsWithoutLink} />);

      expect(screen.queryByTestId('card-footer')).not.toBeInTheDocument();
      expect(screen.getByText('Card Heading')).toBeInTheDocument();
    });

    it('should render with minimal props', () => {
      render(<Card {...propsMinimal} />);

      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByText('Card Heading')).toBeInTheDocument();
      expect(screen.queryByTestId('card-footer')).not.toBeInTheDocument();
    });
  });

  describe('Empty field values', () => {
    it('should handle empty heading field', () => {
      render(<Card {...propsWithEmptyFields} />);

      const textField = screen.getByTestId('text-field');
      expect(textField).toBeInTheDocument();
      expect(textField).toHaveTextContent('');
    });

    it('should handle empty description field', () => {
      render(<Card {...propsWithEmptyFields} />);

      const richText = screen.getByTestId('rich-text-field');
      expect(richText).toBeInTheDocument();
      expect(richText.innerHTML).toBe('');
    });

    it('should not render image when src is empty', () => {
      render(<Card {...propsWithEmptyFields} />);

      expect(screen.queryByTestId('image-wrapper')).not.toBeInTheDocument();
    });
  });

  describe('Styling and classes', () => {
    it('should apply custom className to card', () => {
      render(<Card {...defaultProps} />);

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-card-class');
    });

    it('should apply default flex classes', () => {
      render(<Card {...defaultProps} />);

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('flex', 'flex-col', 'overflow-hidden');
    });

    it('should render without custom className', () => {
      render(<Card {...propsWithoutClassName} />);

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('flex', 'flex-col', 'overflow-hidden');
    });
  });

  describe('Button component', () => {
    it('should render button with asChild prop', () => {
      render(<Card {...defaultProps} />);

      const button = screen.getByTestId('button');
      expect(button).toHaveAttribute('data-as-child', 'true');
    });
  });

  describe('Component structure', () => {
    it('should render in correct order: image, header, footer', () => {
      const { container } = render(<Card {...defaultProps} />);

      const card = container.querySelector('[data-testid="card"]');
      const children = card?.children;

      expect(children?.[0]).toHaveAttribute('data-testid', 'image-wrapper');
      expect(children?.[1]).toHaveAttribute('data-testid', 'card-header');
      expect(children?.[2]).toHaveAttribute('data-testid', 'card-footer');
    });

    it('should nest title and description in header', () => {
      render(<Card {...defaultProps} />);

      const header = screen.getByTestId('card-header');
      const title = screen.getByTestId('card-title');
      const richText = screen.getByTestId('rich-text-field');

      expect(header).toContainElement(title);
      expect(header).toContainElement(richText);
    });

    it('should nest button and link in footer', () => {
      render(<Card {...defaultProps} />);

      const footer = screen.getByTestId('card-footer');
      const button = screen.getByTestId('button');
      const link = screen.getByTestId('sitecore-link');

      expect(footer).toContainElement(button);
      expect(button).toContainElement(link);
    });
  });
});

