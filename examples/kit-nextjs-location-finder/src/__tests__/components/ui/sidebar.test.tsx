import React from 'react';
import { render, screen } from '@testing-library/react';
import { Sidebar, SidebarProvider, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';

// Mock hooks
jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

describe('Sidebar', () => {
  it('renders sidebar', () => {
    render(
      <SidebarProvider>
        <Sidebar>Content</Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText(/content/i)).toBeInTheDocument();
  });

  it('renders sidebar header', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>Header Content</SidebarHeader>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText(/header content/i)).toBeInTheDocument();
  });

  it('renders sidebar footer', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarFooter>Footer Content</SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText(/footer content/i)).toBeInTheDocument();
  });
});
