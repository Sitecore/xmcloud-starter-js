import React from 'react';
import { render } from '@testing-library/react';
import { Default as MultiPromoTabs } from '@/components/multi-promo-tabs/MultiPromoTabs';
import { mockMultiPromoTabsProps } from './multi-promo-tabs.mock.props';

// Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: jest.fn(() => ({
    page: {
      mode: {
        isEditing: false,
      },
    },
  })),
  Text: jest.fn(({ field, tag = 'span', className, htmlFor }) => {
    const Tag = tag as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, { className, htmlFor }, field?.value || '');
  }),
}));

jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: jest.fn(({ componentName }) => (
    <div data-testid="no-data-fallback">No Data: {componentName}</div>
  )),
}));

jest.mock('@/components/multi-promo-tabs/MultiPromoTab.dev', () => ({
  Default: jest.fn(({ title, isEditMode }) => (
    <div data-testid="promo-tab-content">
      {title?.jsonValue?.value} - Edit Mode: {isEditMode ? 'true' : 'false'}
    </div>
  )),
}));

jest.mock('framer-motion', () => {
  const motion = {
    div: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
      <div {...props}>{children}</div>
    ),
  };
  return {
    motion,
    m: motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({
    children,
    onValueChange,
  }: {
    children: React.ReactNode;
    onValueChange?: (value: string) => void;
  }) => (
    <div data-testid="tabs" data-onvaluechange={!!onValueChange}>
      {children}
    </div>
  ),
  TabsList: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tabs-list">{children}</div>
  ),
  TabsTrigger: ({
    children,
    onClick,
    value,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    value: string;
  }) => (
    <button data-testid={`tab-trigger-${value}`} onClick={onClick}>
      {children}
    </button>
  ),
  TabsContent: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-testid={`tab-content-${value}`}>{children}</div>
  ),
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, defaultValue }: { children: React.ReactNode; defaultValue?: string }) => (
    <div data-testid="select" data-default={defaultValue}>
      {children}
    </div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-testid={`select-item-${value}`}>{children}</div>
  ),
  SelectTrigger: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <div data-testid="select-trigger" id={id}>
      {children}
    </div>
  ),
  SelectValue: () => <div data-testid="select-value" />,
}));

describe('MultiPromoTabs', () => {
  it('renders component with title and tab items', () => {
    const { getByText, getByTestId } = render(<MultiPromoTabs {...mockMultiPromoTabsProps} />);

    expect(getByText('Explore our emergency vehicles')).toBeInTheDocument();
    expect(getByTestId('tabs')).toBeInTheDocument();
    expect(getByTestId('tab-content-0')).toBeInTheDocument();
  });

  it('renders select dropdown for mobile with label', () => {
    const { getByText, getByTestId } = render(<MultiPromoTabs {...mockMultiPromoTabsProps} />);

    expect(getByText('Select a vehicle type')).toBeInTheDocument();
    expect(getByTestId('select')).toBeInTheDocument();
    expect(getByTestId('select-item-0')).toHaveTextContent('Ambulances');
    expect(getByTestId('select-item-1')).toHaveTextContent('Fire & Rescue');
    expect(getByTestId('select-item-2')).toHaveTextContent('Mobile Command');
  });

  it('renders NoDataFallback when fields are not provided', () => {
    const propsWithoutFields = { ...mockMultiPromoTabsProps, fields: null as never };
    const { getByTestId } = render(<MultiPromoTabs {...propsWithoutFields} />);

    expect(getByTestId('no-data-fallback')).toBeInTheDocument();
    expect(getByTestId('no-data-fallback')).toHaveTextContent('No Data: Tabbed Multi-Promo');
  });
});
