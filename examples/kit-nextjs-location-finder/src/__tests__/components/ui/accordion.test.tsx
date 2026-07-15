import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

// Mock Radix UI Accordion
jest.mock('@radix-ui/react-accordion', () => {
  const Root = React.forwardRef<HTMLDivElement, React.PropsWithChildren<Record<string, unknown>>>(
    ({ children, ...props }, ref) => (
      <div ref={ref} data-testid="accordion" {...props}>
        {children as React.ReactNode}
      </div>
    )
  );
  Root.displayName = 'AccordionRoot';

  const Item = React.forwardRef<HTMLDivElement, React.PropsWithChildren<Record<string, unknown>>>(
    ({ children, ...props }, ref) => (
      <div ref={ref} data-testid="accordion-item" {...props}>
        {children as React.ReactNode}
      </div>
    )
  );
  Item.displayName = 'AccordionItem';

  const Header = React.forwardRef<
    HTMLHeadingElement,
    React.PropsWithChildren<Record<string, unknown>>
  >(({ children, ...props }, ref) => (
    <h3 ref={ref} {...props}>
      {children as React.ReactNode}
    </h3>
  ));
  Header.displayName = 'AccordionHeader';

  const Trigger = React.forwardRef<
    HTMLButtonElement,
    React.PropsWithChildren<Record<string, unknown>>
  >(({ children, ...props }, ref) => (
    <button ref={ref} data-testid="accordion-trigger" {...props}>
      {children as React.ReactNode}
    </button>
  ));
  Trigger.displayName = 'AccordionTrigger';

  const Content = React.forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<Record<string, unknown>>
  >(({ children, ...props }, ref) => (
    <div ref={ref} data-testid="accordion-content" {...props}>
      {children as React.ReactNode}
    </div>
  ));
  Content.displayName = 'AccordionContent';

  return {
    Root,
    Item,
    Header,
    Trigger,
    Content,
  };
});

// Mock lucide-react
jest.mock('lucide-react', () => ({
  ChevronDown: () => <span data-testid="chevron-icon">▼</span>,
}));

describe('Accordion', () => {
  it('renders accordion with items', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByTestId('accordion')).toBeInTheDocument();
    expect(screen.getByTestId('accordion-item')).toBeInTheDocument();
  });

  it('renders accordion trigger button', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Click me</AccordionTrigger>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByTestId('accordion-trigger');
    expect(trigger).toBeInTheDocument();
    expect(screen.getByText(/click me/i)).toBeInTheDocument();
  });

  it('renders accordion content', () => {
    render(<AccordionContent>This is the content</AccordionContent>);

    expect(screen.getByText(/this is the content/i)).toBeInTheDocument();
  });
});
