import React from 'react';
import { render } from '@testing-library/react';
import { Default as MultiPromoTab } from '@/components/multi-promo-tabs/MultiPromoTab.dev';
import { mockMultiPromoTabItems } from './multi-promo-tabs.mock.props';

// Mock dependencies
jest.mock('@/components/button-component/ButtonComponent', () => ({
  ButtonBase: jest.fn(({ buttonLink, className, icon, isPageEditing }) => (
    <button
      data-testid="cta-button"
      className={className}
      data-href={buttonLink?.value?.href}
      data-is-editing={isPageEditing}
    >
      {buttonLink?.value?.text}
      {icon && <span data-testid="icon">{icon.value}</span>}
    </button>
  )),
}));

jest.mock('@/components/image/ImageWrapper.dev', () => ({
  Default: jest.fn(({ image, className }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-testid="image-wrapper"
      src={image?.value?.src}
      alt={image?.value?.alt}
      className={className}
    />
  )),
}));

jest.mock('framer-motion', () => {
  const motion = {
    div: ({
      children,
      className,
      onClick,
      ...props
    }: {
      children: React.ReactNode;
      className?: string;
      onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
      [key: string]: unknown;
    }) => (
      <div className={className} onClick={onClick} {...props}>
        {children}
      </div>
    ),
  };
  return { motion, m: motion, AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</> };
});

describe('MultiPromoTab', () => {
  it('renders two promo items with images and links', () => {
    const mockItem = mockMultiPromoTabItems[0];
    const { getAllByTestId } = render(<MultiPromoTab {...mockItem} />);

    const images = getAllByTestId('image-wrapper');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', '/images/alaris-ambulance-emergency.jpg');
    expect(images[1]).toHaveAttribute('src', '/images/alaris-ambulance-critical-care.jpg');

    const buttons = getAllByTestId('cta-button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('View Type I Ambulances');
    expect(buttons[1]).toHaveTextContent('View Type III Ambulances');
  });

  it('handles click events correctly in edit mode', () => {
    const mockItem = mockMultiPromoTabItems[0];
    const { container } = render(<MultiPromoTab {...mockItem} isEditMode={true} />);

    const promoItems = container.querySelectorAll('.multi-promo-tab > div');
    expect(promoItems).toHaveLength(2);

    // In edit mode, clicks should be prevented
    const buttons = container.querySelectorAll('[data-testid="cta-button"]');
    expect(buttons[0]).toHaveAttribute('data-is-editing', 'true');
  });

  it('renders correctly with external link target', () => {
    const mockItem = mockMultiPromoTabItems[1]; // This has an external link
    const { getAllByTestId } = render(<MultiPromoTab {...mockItem} />);

    const buttons = getAllByTestId('cta-button');
    expect(buttons[1]).toHaveAttribute('data-href', 'https://alaris-specs.com/rescue-vehicles');
    expect(buttons[1]).toHaveTextContent('Technical Specifications');
  });
});
