import React from 'react';
import { render } from '@testing-library/react';
import { Default as MultiPromo } from '@/components/multi-promo/MultiPromo';
import { mockMultiPromoProps } from './multi-promo.mock.props';

// Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: jest.fn(({ field, tag = 'span', className }) =>
    React.createElement(tag, { className }, field?.value || '')
  ),
  RichText: jest.fn(({ field, className }) => (
    <div className={className} dangerouslySetInnerHTML={{ __html: field?.value || '' }} />
  )),
}));

jest.mock('radash', () => ({
  debounce: jest.fn((fn) => {
    const debouncedFn = fn;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (debouncedFn as any).cancel = jest.fn();
    return debouncedFn;
  }),
}));

jest.mock('@/components/ui/carousel', () => ({
  Carousel: jest.fn(({ children, setApi, className }) => {
    React.useEffect(() => {
      if (setApi) {
        const mockApi = {
          on: jest.fn(),
          scrollNext: jest.fn(),
          scrollPrev: jest.fn(),
          selectedScrollSnap: jest.fn(() => 0),
          rootNode: jest.fn(() => ({
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
          })),
        };
        setApi(mockApi);
      }
    }, [setApi]);
    return (
      <div data-testid="carousel" className={className}>
        {children}
      </div>
    );
  }),
  CarouselContent: jest.fn(({ children, className }) => (
    <div data-testid="carousel-content" className={className}>
      {children}
    </div>
  )),
  CarouselItem: jest.fn(({ children, className }) => (
    <div data-testid="carousel-item" className={className}>
      {children}
    </div>
  )),
}));

jest.mock('@/components/multi-promo/MultiPromoItem.dev', () => ({
  Default: jest.fn(({ heading }) => (
    <div data-testid="multi-promo-item">{heading?.jsonValue?.value}</div>
  )),
}));

jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: jest.fn(({ componentName }) => (
    <div data-testid="no-data-fallback">No Data: {componentName}</div>
  )),
}));

jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...args) => args.filter(Boolean).join(' ')),
}));

describe('MultiPromo', () => {
  it('renders component with title and description', () => {
    const { getByText } = render(<MultiPromo {...mockMultiPromoProps} />);

    expect(getByText('Explore Our Collection')).toBeInTheDocument();
    expect(getByText(/Discover our curated selection/)).toBeInTheDocument();
  });

  it('renders carousel with promo items', () => {
    const { getByTestId, getAllByTestId } = render(<MultiPromo {...mockMultiPromoProps} />);

    expect(getByTestId('carousel')).toBeInTheDocument();
    expect(getByTestId('carousel-content')).toBeInTheDocument();

    const carouselItems = getAllByTestId('carousel-item');
    expect(carouselItems).toHaveLength(4);
  });

  it('renders NoDataFallback when fields are not provided', () => {
    const propsWithoutFields = { ...mockMultiPromoProps, fields: null as never };
    const { getByTestId } = render(<MultiPromo {...propsWithoutFields} />);

    expect(getByTestId('no-data-fallback')).toBeInTheDocument();
    expect(getByTestId('no-data-fallback')).toHaveTextContent('No Data: Multi Promo');
  });
});
