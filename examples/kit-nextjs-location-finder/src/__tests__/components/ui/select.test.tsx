import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

// Mock Radix UI Select with complete structure
jest.mock('@radix-ui/react-select', () => {
  const Root = ({ children }: React.PropsWithChildren) => (
    <div data-testid="select-root">{children as React.ReactNode}</div>
  );

  const Trigger = React.forwardRef<HTMLButtonElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <button ref={ref} data-testid="select-trigger" {...props}>
        {children}
      </button>
    )
  );
  Trigger.displayName = 'SelectTrigger';

  const Value = ({ placeholder }: { placeholder?: string }) => (
    <span data-testid="select-value">{placeholder}</span>
  );
  Value.displayName = 'SelectValue';

  const Icon = ({ children }: React.PropsWithChildren) => (
    <span>{children as React.ReactNode}</span>
  );
  Icon.displayName = 'SelectIcon';

  const Portal = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );
  Portal.displayName = 'SelectPortal';

  const Content = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
    ({ children, ...props }, ref) => (
      <div ref={ref} data-testid="select-content" {...props}>
        {children}
      </div>
    )
  );
  Content.displayName = 'SelectContent';

  const Viewport = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );
  Viewport.displayName = 'SelectViewport';

  const Item = React.forwardRef<HTMLDivElement, React.PropsWithChildren<{ value?: string }>>(
    ({ children, value, ...props }, ref) => (
      <div ref={ref} data-testid={`select-item-${value}`} {...props}>
        {children}
      </div>
    )
  );
  Item.displayName = 'SelectItem';

  const ItemText = ({ children }: React.PropsWithChildren) => (
    <span>{children as React.ReactNode}</span>
  );
  ItemText.displayName = 'SelectItemText';

  const ItemIndicator = ({ children }: React.PropsWithChildren) => (
    <span>{children as React.ReactNode}</span>
  );
  ItemIndicator.displayName = 'SelectItemIndicator';

  const ScrollUpButton = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );
  ScrollUpButton.displayName = 'SelectScrollUpButton';

  const ScrollDownButton = ({ children }: React.PropsWithChildren) => (
    <div>{children as React.ReactNode}</div>
  );
  ScrollDownButton.displayName = 'SelectScrollDownButton';

  const Label = ({ children }: React.PropsWithChildren) => <div>{children as React.ReactNode}</div>;
  Label.displayName = 'SelectLabel';

  const Separator = React.forwardRef<HTMLDivElement>((_props, ref) => (
    <div ref={ref} data-testid="select-separator" />
  ));
  Separator.displayName = 'SelectSeparator';

  return {
    Root,
    Trigger,
    Value,
    Icon,
    Portal,
    Content,
    Viewport,
    Item,
    ItemText,
    ItemIndicator,
    ScrollUpButton,
    ScrollDownButton,
    Label,
    Separator,
  };
});

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Check: () => <span>✓</span>,
  ChevronDown: () => <span>▼</span>,
  ChevronUp: () => <span>▲</span>,
}));

describe('Select', () => {
  it('renders select with trigger', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
      </Select>
    );

    expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('select-value')).toBeInTheDocument();
  });

  it('renders select content with items', () => {
    render(
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </SelectContent>
    );

    expect(screen.getByTestId('select-content')).toBeInTheDocument();
    expect(screen.getByTestId('select-item-option1')).toBeInTheDocument();
  });

  it('renders select value with placeholder', () => {
    render(<SelectValue placeholder="Choose..." />);

    expect(screen.getByText(/choose/i)).toBeInTheDocument();
  });
});
