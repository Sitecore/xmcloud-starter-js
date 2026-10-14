import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as CardDefault } from '../../components/card/Card.dev';
import {
  defaultCardProps,
  cardPropsNoImage,
  cardPropsNoLink,
  cardPropsEditable,
  cardPropsWithClass,
  cardPropsNoIcon,
} from './Card.mockProps';
import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';

// Mock the UI Card components
jest.mock('../../components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h3 data-testid="card-title">{children}</h3>
  ),
  CardFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-footer">{children}</div>
  ),
}));

// Mock the Button component
jest.mock('../../components/ui/button', () => ({
  Button: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => (
    <button data-testid="button" data-as-child={asChild}>
      {children}
    </button>
  ),
}));

// Mock Sitecore Content SDK components
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: { field?: Field<string> }) => {
    const f = field as Field<string> | undefined;
    return f?.value ? <span data-testid="text">{f.value}</span> : null;
  },
  RichText: ({ field }: { field?: Field<string> }) => {
    const f = field as Field<string> | undefined;
    return f?.value ? (
      <div data-testid="rich-text" dangerouslySetInnerHTML={{ __html: f.value }} />
    ) : null;
  },
  Link: ({
    field,
    editable,
    children,
  }: {
    field?: LinkField;
    editable?: boolean;
    children?: React.ReactNode;
  }) => {
    const linkField = field as LinkField | undefined;
    return (
      <a href={linkField?.value?.href} data-testid="link" data-editable={editable}>
        {children}
      </a>
    );
  },
}));

// Mock Icon component
jest.mock('../../components/icon/Icon', () => ({
  Default: ({ iconName }: { iconName: string }) => (
    <span data-testid="icon" data-icon-name={iconName}>
      Icon
    </span>
  ),
}));

// Mock ImageWrapper component
jest.mock('../../components/image/ImageWrapper.dev', () => ({
  Default: ({ image, className }: { image?: ImageField; className?: string }) => {
    const img = image as ImageField | undefined;
    return img?.value?.src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        data-testid="image"
        src={img.value.src}
        alt={(img.value.alt as string) || ''}
        className={className}
      />
    ) : null;
  },
}));

// Mock cn utility
jest.mock('../../lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

describe('Card', () => {
  it('renders card with all props', () => {
    render(<CardDefault {...defaultCardProps} />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toBeInTheDocument();
    expect(screen.getByTestId('text')).toHaveTextContent('Test Card Heading');
    expect(screen.getByTestId('rich-text')).toBeInTheDocument();
    expect(screen.getByTestId('image')).toHaveAttribute('src', '/test-card-image.jpg');
    expect(screen.getByTestId('card-footer')).toBeInTheDocument();
    expect(screen.getByTestId('link')).toHaveAttribute('href', '/test-page');
  });

  it('renders card without image', () => {
    render(<CardDefault {...cardPropsNoImage} />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.queryByTestId('image')).not.toBeInTheDocument();
    expect(screen.getByTestId('text')).toHaveTextContent('Test Card Heading');
  });

  it('renders card without link', () => {
    render(<CardDefault {...cardPropsNoLink} />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.queryByTestId('card-footer')).not.toBeInTheDocument();
    expect(screen.queryByTestId('link')).not.toBeInTheDocument();
  });

  it('renders card in editable mode with icon', () => {
    render(<CardDefault {...cardPropsEditable} />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('link')).toHaveAttribute('data-editable', 'true');
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toHaveAttribute('data-icon-name', 'external');
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<CardDefault {...cardPropsWithClass} />);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-card-class');
  });

  it('uses default INTERNAL icon when no icon is specified in editable mode', () => {
    render(<CardDefault {...cardPropsNoIcon} />);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toHaveAttribute('data-icon-name', 'internal');
  });

  it('renders rich text description with HTML', () => {
    render(<CardDefault {...defaultCardProps} />);

    const richText = screen.getByTestId('rich-text');
    expect(richText.innerHTML).toContain('<strong>rich text</strong>');
  });
});
