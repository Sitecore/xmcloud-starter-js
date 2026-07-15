/* eslint-disable */
import React from 'react';

// Mock change-case functions used by NoDataFallback (ESM module causes Jest parse errors)
jest.mock('change-case', () => ({
  kebabCase: (s: string) => String(s).replace(/\s+/g, '-').toLowerCase(),
  capitalCase: (s: string) => String(s).replace(/(^|\s)\S/g, (t: string) => t.toUpperCase()),
}));
import { render, screen } from '@testing-library/react';

// Mock sitecore content sdk components used in CtaBanner
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag = 'div' }: { field?: any; tag?: string }) => {
    const Tag = tag as any;
    return <Tag data-testid="text">{field?.value ?? 'fallback'}</Tag>;
  },
  Link: ({ field }: { field?: any }) => (
    <a data-testid="link" href={field?.url ?? '#'}>
      {field?.text ?? 'link'}
    </a>
  ),
  useSitecore: () => ({ page: { mode: { isEditing: false } } }),
}));

// Mock internal AnimatedSection and Button
jest.mock('@/components/animated-section/AnimatedSection.dev', () => ({
  Default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animated">{children}</div>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <button data-testid="button" className={className as string}>
      {children}
    </button>
  ),
}));

import { Default as CtaBanner } from '@/components/cta-banner/CtaBanner';

describe('CtaBanner', () => {
  it('renders title and description when fields provided', () => {
    const props = {
      fields: {
        titleRequired: { value: 'CTA Title' },
        descriptionOptional: { value: 'CTA description' },
        linkOptional: { url: '/buy', text: 'Buy now' },
      },
      params: {},
      rendering: {
        componentName: 'CtaBanner',
        params: {},
      },
      page: {
        mode: {
          isEditing: false,
          isNormal: true,
          isPreview: false,
        },
      },
    } as any;

    render(<CtaBanner {...props} />);

    const texts = screen.getAllByTestId('text');
    expect(texts[0]).toHaveTextContent('CTA Title');
    expect(texts[1]).toHaveTextContent('CTA description');
    expect(screen.getByTestId('link')).toHaveAttribute('href', '/buy');
  });

  it('renders NoDataFallback when no fields exist', () => {
    // No fields -> NoDataFallback rendered
    const props = {
      fields: undefined,
      params: {},
      rendering: {
        componentName: 'CtaBanner',
        params: {},
      },
      page: {
        mode: {
          isEditing: false,
          isNormal: true,
          isPreview: false,
        },
      },
    } as any;
    render(<CtaBanner {...props} />);

    expect(screen.getByText(/CTA Banner/i)).toBeInTheDocument();
  });
});
