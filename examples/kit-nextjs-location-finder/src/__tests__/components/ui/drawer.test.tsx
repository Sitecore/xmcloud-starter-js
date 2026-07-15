import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';

// Mock vaul
jest.mock('vaul', () => {
  const Root = ({ children }: React.PropsWithChildren) => (
    <div data-testid="drawer-root">{children as React.ReactNode}</div>
  );

  const Trigger = ({ children }: React.PropsWithChildren) => (
    <button data-testid="drawer-trigger">{children as React.ReactNode}</button>
  );

  const Portal = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );

  const Overlay = React.forwardRef<HTMLDivElement, Record<string, unknown>>(({ ...props }, ref) => (
    <div ref={ref} data-testid="drawer-overlay" {...props} />
  ));
  Overlay.displayName = 'DrawerOverlay';

  const Content = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <div ref={ref} data-testid="drawer-content" {...props}>
        {children}
      </div>
    )
  );
  Content.displayName = 'DrawerContent';

  const Title = React.forwardRef<HTMLHeadingElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <h2 ref={ref} {...props}>
        {children}
      </h2>
    )
  );
  Title.displayName = 'DrawerTitle';

  const Description = React.forwardRef<HTMLParagraphElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <p ref={ref} {...props}>
        {children}
      </p>
    )
  );
  Description.displayName = 'DrawerDescription';

  const Close = ({ children }: React.PropsWithChildren) => (
    <button>{children as React.ReactNode}</button>
  );

  return {
    Drawer: {
      Root,
      Trigger,
      Portal,
      Overlay,
      Content,
      Title,
      Description,
      Close,
    },
  };
});

describe('Drawer', () => {
  it('renders drawer with trigger', () => {
    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
      </Drawer>
    );

    expect(screen.getByTestId('drawer-trigger')).toBeInTheDocument();
  });

  it('renders drawer content', () => {
    render(
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>Drawer description</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    );

    expect(screen.getByTestId('drawer-content')).toBeInTheDocument();
    expect(screen.getByText(/drawer title/i)).toBeInTheDocument();
  });

  it('renders drawer header', () => {
    render(
      <DrawerHeader>
        <DrawerTitle>Title</DrawerTitle>
        <DrawerDescription>Description</DrawerDescription>
      </DrawerHeader>
    );

    expect(screen.getByText(/title/i)).toBeInTheDocument();
    expect(screen.getByText(/description/i)).toBeInTheDocument();
  });
});
