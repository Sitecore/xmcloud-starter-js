import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

// Mock react-resizable-panels
jest.mock('react-resizable-panels', () => ({
  PanelGroup: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid="resizable-panel-group" {...props}>
      {children}
    </div>
  ),
  Panel: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid="resizable-panel" {...props}>
      {children}
    </div>
  ),
  PanelResizeHandle: ({ ...props }: Record<string, unknown>) => (
    <div data-testid="resizable-handle" {...props} />
  ),
}));

describe('Resizable', () => {
  it('renders resizable panel group', () => {
    render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>Panel 1</ResizablePanel>
      </ResizablePanelGroup>
    );

    expect(screen.getByTestId('resizable-panel-group')).toBeInTheDocument();
  });

  it('renders resizable panels', () => {
    render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>Left</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Right</ResizablePanel>
      </ResizablePanelGroup>
    );

    expect(screen.getAllByTestId('resizable-panel')).toHaveLength(2);
  });

  it('renders resizable handle', () => {
    render(<ResizableHandle />);

    expect(screen.getByTestId('resizable-handle')).toBeInTheDocument();
  });
});
