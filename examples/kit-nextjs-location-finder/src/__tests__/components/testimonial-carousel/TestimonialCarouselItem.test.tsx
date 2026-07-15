import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as TestimonialCarouselItem } from '@/components/testimonial-carousel/TestimonialCarouselItem';
import { mockSingleTestimonialItem } from './testimonial-carousel.mock.props';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: jest.fn(({ field, tag = 'span', className }) => {
    const Tag = tag as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, { className, 'data-testid': 'text-field' }, field?.value);
  }),
}));

describe('TestimonialCarouselItem', () => {
  it('renders testimonial with attribution and quote', () => {
    render(<TestimonialCarouselItem {...mockSingleTestimonialItem} />);

    const textFields = screen.getAllByTestId('text-field');
    expect(textFields).toHaveLength(2);

    expect(textFields[0]).toHaveTextContent('Fire Chief, Chicago Fire Department');
    expect(textFields[1]).toHaveTextContent(
      'Our Alaris fire trucks are built to handle the most demanding situations'
    );
  });

  it('renders quote icon svg', () => {
    const { container } = render(<TestimonialCarouselItem {...mockSingleTestimonialItem} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders testimonial quote without attribution', () => {
    const itemWithoutAttribution = {
      testimonialAttribution: undefined,
      testimonialQuote: {
        jsonValue: {
          value: 'Outstanding emergency vehicle performance and reliability.',
        },
      },
    };

    render(<TestimonialCarouselItem {...itemWithoutAttribution} />);

    const textFields = screen.getAllByTestId('text-field');
    expect(textFields).toHaveLength(1);
    expect(textFields[0]).toHaveTextContent('Outstanding emergency vehicle performance');
  });
});
