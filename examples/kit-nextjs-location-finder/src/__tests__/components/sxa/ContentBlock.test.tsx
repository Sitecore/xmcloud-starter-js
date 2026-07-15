import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContentBlock from '@/components/sxa/ContentBlock';
import { Page } from '@sitecore-content-sdk/nextjs';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: jest.fn(({ field, tag = 'span', className }) => {
    const Tag = tag as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, { className, 'data-testid': 'heading-text' }, field?.value);
  }),
  RichText: jest.fn(({ field, className }) => (
    <div
      className={className}
      data-testid="richtext-content"
      dangerouslySetInnerHTML={{ __html: field?.value }}
    />
  )),
  withDatasourceCheck: () => (Component: React.ComponentType) => Component,
}));

describe('SXA ContentBlock', () => {
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
    heading: {
      value: 'Alaris Advanced Life Support Ambulances',
    },
    content: {
      value:
        '<p>Our Type I and Type III ambulances are engineered with cutting-edge medical equipment and spacious patient compartments. Each vehicle is designed to provide optimal care during critical transport situations.</p><ul><li>Advanced cardiac monitoring systems</li><li>Climate-controlled medical storage</li><li>Spacious patient compartment</li></ul>',
    },
  };

  it('renders content block with heading and rich text', () => {
    render(
      <ContentBlock
        fields={mockFields}
        rendering={{ componentName: 'ContentBlock', dataSource: '', uid: '123' }}
        params={{}}
        page={mockPageBase}
      />
    );

    expect(screen.getByTestId('heading-text')).toHaveTextContent(
      'Alaris Advanced Life Support Ambulances'
    );
    const content = screen.getByTestId('richtext-content');
    expect(content).toBeInTheDocument();
    expect(content.innerHTML).toContain('Type I and Type III ambulances');
  });

  it('renders rich text with HTML content', () => {
    render(
      <ContentBlock
        fields={mockFields}
        rendering={{ componentName: 'ContentBlock', dataSource: '', uid: '123' }}
        params={{}}
        page={mockPageBase}
      />
    );

    const content = screen.getByTestId('richtext-content');
    expect(content.innerHTML).toContain('<ul>');
    expect(content.innerHTML).toContain('Advanced cardiac monitoring systems');
    expect(content.innerHTML).toContain('Climate-controlled medical storage');
  });

  it('applies correct CSS classes', () => {
    const { container } = render(
      <ContentBlock
        fields={mockFields}
        rendering={{ componentName: 'ContentBlock', dataSource: '', uid: '123' }}
        params={{}}
        page={mockPageBase}
      />
    );

    expect(container.querySelector('.contentBlock')).toBeInTheDocument();
    expect(screen.getByTestId('heading-text')).toHaveClass('contentTitle');
    expect(screen.getByTestId('richtext-content')).toHaveClass('contentDescription');
  });
});
