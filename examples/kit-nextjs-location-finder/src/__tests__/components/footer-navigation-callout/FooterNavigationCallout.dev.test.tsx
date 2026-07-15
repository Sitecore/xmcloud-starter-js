import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as FooterNavigationCallout } from '@/components/footer-navigation-callout/FooterNavigationCallout.dev';

// 🧪 Mock Sitecore SDK components
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag: Tag = 'div', ...props }: { field?: { value?: string }; tag?: string }) => (
    // @ts-expect-error: React.createElement handles dynamic tags safely
    <Tag {...props}>{field?.value}</Tag>
  ),

  Link: ({ field }: { field?: { value?: { href?: string; text?: string } } }) => (
    <a href={field?.value?.href}>{field?.value?.text}</a>
  ),
}));

// 🧪 Mock Button component
jest.mock('@/components/button-component/ButtonComponent', () => ({
  ButtonBase: ({ buttonLink }: { buttonLink?: { value?: { href?: string; text?: string } } }) => (
    <a href={buttonLink?.value?.href} role="link">
      {buttonLink?.value?.text}
    </a>
  ),
}));

describe('FooterNavigationCallout Component', () => {
  const mockProps = {
    fields: {
      title: { value: 'Footer Title' },
      description: { value: 'Footer Description' },
      linkOptional: { value: { href: '/footer-link', text: 'Learn More' } },
    },
  };

  it('renders title and description correctly', () => {
    render(<FooterNavigationCallout {...mockProps} />);
    expect(screen.getByText('Footer Title')).toBeInTheDocument();
    expect(screen.getByText('Footer Description')).toBeInTheDocument();
  });

  it('renders button with link when linkOptional is provided', () => {
    render(<FooterNavigationCallout {...mockProps} />);
    expect(screen.getByRole('link', { name: /learn more/i })).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/footer-link');
  });

  it('does not render button when linkOptional is missing', () => {
    const { title, description } = mockProps.fields;
    const restFields = { title, description };
    render(<FooterNavigationCallout fields={restFields} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
