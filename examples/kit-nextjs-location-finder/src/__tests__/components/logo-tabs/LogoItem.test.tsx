import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { LogoItem } from '@/components/logo-tabs/LogoItem';
import { mockLogos } from './logo-tabs.mock.props';

// Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Image: jest.fn(({ field, className }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={field?.value?.src}
      alt={field?.value?.alt}
      className={className}
      data-testid="logo-image"
    />
  )),
}));

jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...args) => args.filter(Boolean).join(' ')),
}));

describe('LogoItem', () => {
  const mockOnClick = jest.fn();
  const logo = mockLogos[0];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo item with correct attributes', () => {
    const { getByRole, getByTestId } = render(
      <LogoItem {...logo} isActive={false} onClick={mockOnClick} id="tab-0" controls="panel-0" />
    );

    const button = getByRole('tab');
    expect(button).toHaveAttribute('id', 'tab-0');
    expect(button).toHaveAttribute('aria-controls', 'panel-0');
    expect(button).toHaveAttribute('aria-selected', 'false');
    expect(button).toHaveAttribute('tabIndex', '-1');
    expect(getByTestId('logo-image')).toBeInTheDocument();
  });

  it('applies active state correctly', () => {
    const { getByRole } = render(
      <LogoItem {...logo} isActive={true} onClick={mockOnClick} id="tab-0" controls="panel-0" />
    );

    const button = getByRole('tab');
    expect(button).toHaveAttribute('aria-selected', 'true');
    expect(button).toHaveAttribute('tabIndex', '0');
  });

  it('calls onClick when clicked', () => {
    const { getByRole } = render(
      <LogoItem {...logo} isActive={false} onClick={mockOnClick} id="tab-0" controls="panel-0" />
    );

    const button = getByRole('tab');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
