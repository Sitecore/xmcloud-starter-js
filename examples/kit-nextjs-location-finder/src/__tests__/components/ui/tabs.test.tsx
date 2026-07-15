import React from 'react';
import { render, screen } from '@testing-library/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Mock Radix UI Tabs
jest.mock('@radix-ui/react-tabs', () => ({
  Root: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid="tabs-root" {...props}>
      {children}
    </div>
  ),
  List: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid="tabs-list" {...props}>
      {children}
    </div>
  ),
  Trigger: ({
    children,
    value,
    ...props
  }: React.PropsWithChildren<Record<string, unknown> & { value?: string }>) => (
    <button data-testid={`tab-trigger-${value}`} {...props}>
      {children}
    </button>
  ),
  Content: ({
    children,
    value,
    ...props
  }: React.PropsWithChildren<Record<string, unknown> & { value?: string }>) => (
    <div data-testid={`tab-content-${value}`} {...props}>
      {children}
    </div>
  ),
}));

describe('Tabs', () => {
  it('renders tabs with triggers and content', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    expect(screen.getByTestId('tabs-root')).toBeInTheDocument();
    expect(screen.getByTestId('tabs-list')).toBeInTheDocument();
    expect(screen.getByText(/tab 1/i)).toBeInTheDocument();
    expect(screen.getByText(/tab 2/i)).toBeInTheDocument();
  });

  it('renders tab triggers with correct values', () => {
    render(
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
    );

    expect(screen.getByTestId('tab-trigger-account')).toBeInTheDocument();
    expect(screen.getByTestId('tab-trigger-password')).toBeInTheDocument();
  });

  it('renders tab content', () => {
    render(<TabsContent value="settings">Settings content</TabsContent>);

    expect(screen.getByText(/settings content/i)).toBeInTheDocument();
  });
});
