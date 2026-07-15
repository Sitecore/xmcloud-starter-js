import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as RichText } from '@/components/sxa/RichText';
import { Page } from '@sitecore-content-sdk/nextjs';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  RichText: jest.fn(({ field }) => (
    <div data-testid="richtext-content" dangerouslySetInnerHTML={{ __html: field?.value }} />
  )),
}));

describe('SXA RichText', () => {
  const mockPageBase = {
    mode: {
      isEditing: false,
      isPreview: false,
      isNormal: true,
      name: 'normal' as const,
      designLibrary: { isVariantGeneration: false },
      isDesignLibrary: false,
    },
    layout: {
      sitecore: {
        context: {},
        route: null,
      },
    },
    locale: 'en',
  } as Page;

  const mockFields = {
    Text: {
      value:
        '<h2>Alaris Type I Ambulances</h2><p>Our Type I ambulances feature advanced life support systems and spacious patient compartments designed for critical care transport.</p>',
    },
  };

  it('renders rich text content with HTML', () => {
    render(
      <RichText
        params={{ RenderingIdentifier: 'richtext-1', styles: '' }}
        fields={mockFields}
        rendering={{ componentName: 'RichText', dataSource: '', uid: '123' }}
        page={mockPageBase}
      />
    );

    const content = screen.getByTestId('richtext-content');
    expect(content).toBeInTheDocument();
    expect(content.innerHTML).toContain('Alaris Type I Ambulances');
    expect(content.innerHTML).toContain('advanced life support systems');
  });

  it('applies custom styles and rendering identifier', () => {
    const { container } = render(
      <RichText
        params={{ RenderingIdentifier: 'vehicle-description', styles: 'text-lg my-4' }}
        fields={mockFields}
        rendering={{ componentName: 'RichText', dataSource: '', uid: '123' }}
        page={mockPageBase}
      />
    );

    const richTextDiv = container.querySelector('.component.rich-text');
    expect(richTextDiv).toHaveClass('text-lg', 'my-4');
    expect(richTextDiv).toHaveAttribute('id', 'vehicle-description');
  });

  it('shows empty hint when no fields are provided', () => {
    const emptyFields = null;

    render(
      <RichText
        params={{ RenderingIdentifier: 'richtext-empty', styles: '' }}
        // @ts-expect-error Testing empty fields case
        fields={emptyFields}
        rendering={{ componentName: 'RichText', dataSource: '', uid: '123' }}
        page={mockPageBase}
      />
    );

    expect(screen.getByText('Rich text')).toBeInTheDocument();
    expect(screen.getByText('Rich text')).toHaveClass('is-empty-hint');
  });
});
