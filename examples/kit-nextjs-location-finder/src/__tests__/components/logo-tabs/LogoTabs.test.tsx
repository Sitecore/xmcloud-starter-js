import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Default as LogoTabs } from '@/components/logo-tabs/LogoTabs';
import { mockLogoTabsProps } from './logo-tabs.mock.props';

// Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: jest.fn(({ field, tag = 'span', className }) =>
    React.createElement(tag, { className }, field?.value || '')
  ),
  Image: jest.fn(({ field, className }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.value?.src} alt={field?.value?.alt} className={className} />
  )),
}));

jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: jest.fn(({ componentName }) => (
    <div data-testid="no-data-fallback">No Data: {componentName}</div>
  )),
}));

jest.mock('@/components/logo-tabs/LogoItem', () => ({
  LogoItem: jest.fn(({ title, isActive, onClick, id, controls }) => (
    <button
      data-testid={`logo-item-${id}`}
      aria-selected={isActive}
      aria-controls={controls}
      onClick={onClick}
      role="tab"
    >
      {title?.jsonValue?.value}
    </button>
  )),
}));

jest.mock('@/components/button-component/ButtonComponent', () => ({
  ButtonBase: jest.fn(({ buttonLink, children, className, variant }) => (
    <a
      href={buttonLink?.value?.href}
      className={className}
      data-variant={variant}
      data-testid="cta-button"
    >
      {buttonLink?.value?.text || children}
    </a>
  )),
}));

jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...args) => args.filter(Boolean).join(' ')),
}));

describe('LogoTabs', () => {
  it('renders component with title and logos', () => {
    const { getByText, getByTestId } = render(<LogoTabs {...mockLogoTabsProps} />);

    expect(getByText('Our Partner Brands')).toBeInTheDocument();
    expect(getByTestId('logo-item-tab-0')).toBeInTheDocument();
    expect(getByTestId('logo-item-tab-1')).toBeInTheDocument();
    expect(getByTestId('logo-item-tab-2')).toBeInTheDocument();
  });

  it('switches tabs when clicking on logo items', () => {
    const { getByTestId, getByText } = render(<LogoTabs {...mockLogoTabsProps} />);

    // Initially first tab is active
    expect(getByText('Discover Brand A')).toBeInTheDocument();

    // Click on second logo
    const secondLogo = getByTestId('logo-item-tab-1');
    fireEvent.click(secondLogo);

    // Second tab content should be visible
    expect(getByText('Explore Brand B')).toBeInTheDocument();
  });

  it('renders NoDataFallback when fields are not provided', () => {
    const propsWithoutFields = { ...mockLogoTabsProps, fields: null as never };
    const { getByTestId } = render(<LogoTabs {...propsWithoutFields} />);

    expect(getByTestId('no-data-fallback')).toBeInTheDocument();
    expect(getByTestId('no-data-fallback')).toHaveTextContent('No Data: LogoTabs');
  });
});
