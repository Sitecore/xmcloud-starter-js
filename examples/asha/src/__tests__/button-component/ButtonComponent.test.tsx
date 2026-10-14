import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as ButtonDefault,
  ButtonBase,
  Primary,
  Secondary,
  Destructive,
  Ghost,
  LinkButton,
  Outline,
  Tertiary,
} from '../../components/button-component/ButtonComponent';
import {
  defaultButtonProps,
  buttonWithLeadingIcon,
  buttonWithoutIcon,
  buttonNoText,
  buttonInvalidHref,
  buttonNoFields,
  primaryButtonProps,
  secondaryButtonProps,
  destructiveButtonProps,
  outlineButtonProps,
  ghostButtonProps,
  linkButtonProps,
  tertiaryButtonProps,
  buttonBaseProps,
} from './ButtonComponent.mockProps';
import type { LinkField } from '@sitecore-content-sdk/nextjs';

// Mock the UI Button component
jest.mock('../../components/ui/button', () => ({
  Button: ({
    children,
    asChild,
    variant,
    size,
    className,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
    variant?: string;
    size?: string;
    className?: string;
  }) => (
    <button
      data-testid="button"
      data-variant={variant}
      data-size={size}
      data-as-child={asChild}
      className={className}
    >
      {children}
    </button>
  ),
}));

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href} data-testid="link">{children}</a>;
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock the Link component
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Link: ({
    field,
    editable,
    children,
    className,
  }: {
    field?: LinkField;
    editable?: boolean;
    children?: React.ReactNode;
    className?: string;
  }) => {
    const linkField = field as LinkField | undefined;
    if (editable && linkField?.value?.text) {
      return <span data-testid="editable-link">{linkField.value.text}</span>;
    }
    return (
      <a href={linkField?.value?.href} data-testid="link" className={className}>
        {children || linkField?.value?.text}
      </a>
    );
  },
}));

// Mock the Icon component
jest.mock('../../components/icon/Icon', () => ({
  Default: ({
    iconName,
    className,
    isAriaHidden,
  }: {
    iconName: string;
    className?: string;
    isAriaHidden?: boolean;
  }) => (
    <span
      data-testid="icon"
      data-icon-name={iconName}
      className={className}
      aria-hidden={isAriaHidden}
    >
      Icon
    </span>
  ),
}));

// Mock NoDataFallback
jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">No data for {componentName}</div>
  ),
}));

describe('ButtonComponent', () => {
  describe('Default Button', () => {
    it('renders button with link and text', () => {
      render(<ButtonDefault {...defaultButtonProps} />);

      expect(screen.getByTestId('button')).toBeInTheDocument();
      expect(screen.getByTestId('link')).toBeInTheDocument();
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('renders button with icon in trailing position', () => {
      render(<ButtonDefault {...defaultButtonProps} />);

      const icon = screen.getByTestId('icon');
      expect(icon).toBeInTheDocument();
      // Icon name comes from buttonLink.value.linktype which is 'internal'
      expect(icon).toHaveAttribute('data-icon-name', 'internal');
    });

    it('renders button with icon in leading position', () => {
      render(<ButtonDefault {...buttonWithLeadingIcon} />);

      const icon = screen.getByTestId('icon');
      expect(icon).toBeInTheDocument();
    });

    it('renders button without icon', () => {
      render(<ButtonDefault {...buttonWithoutIcon} />);

      expect(screen.getByTestId('button')).toBeInTheDocument();
      expect(screen.getByText('Click Me')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument(); // Default icon is added
    });

    it('returns null when link has no text and not in editing mode', () => {
      const { container } = render(<ButtonDefault {...buttonNoText} />);

      expect(container.firstChild).toBeNull();
    });

    it('returns null when link href is invalid and not in editing mode', () => {
      const { container } = render(<ButtonDefault {...buttonInvalidHref} />);

      expect(container.firstChild).toBeNull();
    });

    it('returns null when fields are missing', () => {
      const { container } = render(<ButtonDefault {...buttonNoFields} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Button Variants', () => {
    it('renders Primary button variant', () => {
      render(<Primary {...primaryButtonProps} />);

      const button = screen.getByTestId('button');
      expect(button).toBeInTheDocument();
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('renders Secondary button variant', () => {
      render(<Secondary {...secondaryButtonProps} />);

      const button = screen.getByTestId('button');
      expect(button).toBeInTheDocument();
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('renders Destructive button variant', () => {
      render(<Destructive {...destructiveButtonProps} />);

      const button = screen.getByTestId('button');
      expect(button).toBeInTheDocument();
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('renders Outline button variant', () => {
      render(<Outline {...outlineButtonProps} />);

      const button = screen.getByTestId('button');
      expect(button).toBeInTheDocument();
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('renders Ghost button variant', () => {
      render(<Ghost {...ghostButtonProps} />);

      const button = screen.getByTestId('button');
      expect(button).toBeInTheDocument();
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('renders Link button variant', () => {
      render(<LinkButton {...linkButtonProps} />);

      const button = screen.getByTestId('button');
      expect(button).toBeInTheDocument();
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('renders Tertiary button variant', () => {
      render(<Tertiary {...tertiaryButtonProps} />);

      const button = screen.getByTestId('button');
      expect(button).toBeInTheDocument();
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });
  });

  describe('ButtonBase', () => {
    it('renders ButtonBase with all props', () => {
      render(<ButtonBase {...buttonBaseProps} />);

      expect(screen.getByTestId('button')).toBeInTheDocument();
      expect(screen.getByTestId('link')).toBeInTheDocument();
      expect(screen.getByText('Click Me')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('returns null when link is invalid and not in editing mode', () => {
      const { container } = render(
        <ButtonBase
          {...buttonBaseProps}
          buttonLink={{
            value: { href: 'http://', text: '', linktype: 'internal' },
          }}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });
});
