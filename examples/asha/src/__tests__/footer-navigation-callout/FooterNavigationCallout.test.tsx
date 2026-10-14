/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: { field?: any }) => <span data-testid="text">{field?.value ?? 'x'}</span>,
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h3>{children}</h3>,
}));

jest.mock('@/components/button-component/ButtonComponent', () => ({
  ButtonBase: ({ buttonLink }: any) => (
    <a data-testid="button-link" href={buttonLink?.url ?? '#'}>
      link
    </a>
  ),
}));

import { Default as FooterNavigationCallout } from '@/components/footer-navigation-callout/FooterNavigationCallout.dev';

describe('FooterNavigationCallout', () => {
  it('renders title, description and link when provided', () => {
    const props = {
      fields: {
        title: { value: 'Callout Title' },
        description: { value: 'Callout description' },
        linkOptional: { url: '/more', text: 'More' },
      },
    } as any;

    render(<FooterNavigationCallout {...props} />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText('Callout Title')).toBeInTheDocument();
    expect(screen.getByText('Callout description')).toBeInTheDocument();
    expect(screen.getByTestId('button-link')).toHaveAttribute('href', '/more');
  });
});
