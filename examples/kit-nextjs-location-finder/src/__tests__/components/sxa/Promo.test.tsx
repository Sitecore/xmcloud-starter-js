import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as Promo, CenteredCard } from '@/components/sxa/Promo';
import { baseSitecoreProps } from '@/__tests__/test-utils/component-props';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: jest.fn(() => ({
    page: {
      mode: {
        isEditing: false,
        isPreview: false,
        isNormal: true,
      },
    },
  })),
  NextImage: jest.fn(({ field, className }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-testid="promo-image"
      src={field?.value?.src}
      alt={field?.value?.alt}
      className={className}
    />
  )),
  RichText: jest.fn(({ field, tag = 'div', className }) => {
    const Tag = tag as keyof JSX.IntrinsicElements;
    return React.createElement(
      Tag,
      { className, 'data-testid': 'richtext-field' },
      field?.value || ''
    );
  }),
  Link: jest.fn(({ field, children }) => (
    <a href={field?.value?.href} data-testid="promo-link">
      {field?.value?.text || children}
    </a>
  )),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <button data-testid="button" className={className}>
      {children}
    </button>
  ),
}));

describe('SXA Promo', () => {
  const mockFields = {
    PromoIcon: {
      value: {
        src: '/images/alaris-ambulance-promo.jpg',
        alt: 'Alaris Type III Ambulance',
      },
    },
    PromoText: {
      value: '<strong>Type III Ambulance</strong>',
    },
    PromoText2: {
      value: 'Extended storage capacity for critical equipment',
    },
    PromoText3: {
      value: 'Featured Vehicle',
    },
    PromoLink: {
      value: {
        href: '/vehicles/ambulances/type-3',
        text: 'Learn More',
      },
    },
  };

  it('renders promo with vehicle image and content', () => {
    render(<Promo {...baseSitecoreProps} params={{ styles: '', RenderingIdentifier: 'promo-1' }} fields={mockFields} />);

    expect(screen.getByTestId('promo-image')).toHaveAttribute(
      'src',
      '/images/alaris-ambulance-promo.jpg'
    );
    expect(screen.getAllByTestId('richtext-field')[0]).toHaveTextContent('Featured Vehicle');
    expect(screen.getByTestId('promo-link')).toHaveAttribute('href', '/vehicles/ambulances/type-3');
  });

  it('applies custom styles and renders button', () => {
    const { container } = render(
      <Promo
        {...baseSitecoreProps}
        params={{ styles: 'shadow-xl', RenderingIdentifier: 'vehicle-promo' }}
        fields={mockFields}
      />
    );

    const promoDiv = container.querySelector('.component.promo');
    expect(promoDiv).toHaveClass('shadow-xl');
    expect(screen.getByTestId('button')).toBeInTheDocument();
  });

  it('renders CenteredCard variant with centered content', () => {
    render(
      <CenteredCard
        {...baseSitecoreProps}
        params={{ styles: 'text-center', RenderingIdentifier: 'promo-centered' }}
        fields={mockFields}
      />
    );

    expect(screen.getByTestId('promo-image')).toBeInTheDocument();
    expect(screen.getByTestId('promo-link')).toHaveTextContent('Learn More');
    const richTextElements = screen.getAllByTestId('richtext-field');
    expect(richTextElements.length).toBeGreaterThan(0);
  });
});
