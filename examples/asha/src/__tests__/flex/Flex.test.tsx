/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockPage } from '../test-utils/mockPage';

// Mock utils and sitecore Placeholder used by Flex
jest.mock('@/lib/utils', () => ({
  cn: (...args: Array<string | undefined>) => args.filter(Boolean).join(' '),
}));

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Placeholder: ({ name }: { name: string }) => <div data-testid={`ph-${name}`} />,
  AppPlaceholder: ({ name }: { name: string }) => <div data-testid={`ph-${name}`} />,
  getFieldValue: (fields: any, key: string) => fields?.[key],
  withDatasourceCheck: () => (Component: React.ComponentType) => Component,
}));

// Mock component-map to avoid circular dependency
jest.mock('.sitecore/component-map', () => ({
  __esModule: true,
  default: new Map(),
}));

import { Flex, FlexItem, XMFlex, XMFlexItem } from '@/components/flex/Flex.dev';

describe('Flex', () => {
  it('renders children inside a flex container', () => {
    render(
      <Flex>
        <div data-testid="child">child</div>
      </Flex>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Flex className="custom">
        {' '}
        <div>c</div>{' '}
      </Flex>
    );

    const el = screen.getByText('c').parentElement as HTMLElement;
    expect(el.className).toContain('custom');
  });

  it('renders FlexItem with provided children and classes', () => {
    render(
      <FlexItem className="item-class">
        <span data-testid="itemchild">i</span>
      </FlexItem>
    );

    expect(screen.getByTestId('itemchild')).toBeInTheDocument();
    const parent = screen.getByTestId('itemchild').parentElement as HTMLElement;
    expect(parent.className).toContain('item-class');
  });

  it('XMFlex renders Placeholder with dynamic key', () => {
    const props = {
      params: { DynamicPlaceholderId: 'X' },
      rendering: {},
      fields: {},
      page: mockPage,
    } as any;
    render(<XMFlex {...props} />);

    expect(screen.getByTestId('ph-flex-X')).toBeInTheDocument();
  });

  it('XMFlexItem renders Placeholder for item', () => {
    const props = {
      params: { DynamicPlaceholderId: 'Y' },
      rendering: {},
      fields: {},
      page: mockPage,
    } as any;
    render(<XMFlexItem {...props} />);

    expect(screen.getByTestId('ph-flex-item-Y')).toBeInTheDocument();
  });
});
