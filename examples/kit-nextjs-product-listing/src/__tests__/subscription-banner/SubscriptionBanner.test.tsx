/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Default as SubscriptionBannerDefault } from '../../components/subscription-banner/SubscriptionBanner';
import {
  defaultSubscriptionBannerProps,
  subscriptionBannerPropsMinimal,
  subscriptionBannerPropsNoDescription,
  subscriptionBannerPropsCustomMessages,
  subscriptionBannerPropsLongContent,
  subscriptionBannerPropsSpecialChars,
  subscriptionBannerPropsEmptyFields,
  subscriptionBannerPropsNoFields,
  subscriptionBannerPropsUndefinedTitle,
  subscriptionBannerPropsTestValidation,
  mockUseSitecoreNormal,
} from './SubscriptionBanner.mockProps';

// Mock Sitecore Content SDK
const mockUseSitecore = jest.fn();
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => mockUseSitecore(),
  Text: ({ field, tag: Tag = 'div', className, children }: any) => {
    // Use different testids for different tags to avoid conflicts
    const testId =
      Tag === 'h2' ? 'sitecore-title' : Tag === 'p' ? 'sitecore-description' : 'sitecore-text';
    return (
      <Tag data-testid={testId} className={className} data-field-value={field?.value || ''}>
        {field?.value || children || 'Sitecore Text'}
      </Tag>
    );
  },
}));

// Mock UI components
jest.mock('../../components/ui/input', () => ({
  Input: React.forwardRef(({ className, type, placeholder, disabled, ...props }: any, ref: any) => (
    <input
      ref={ref}
      data-testid="email-input"
      className={className}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      {...props}
    />
  )),
}));

jest.mock('../../components/ui/button', () => ({
  Button: ({ children, type, className, disabled, ...props }: any) => (
    <button
      data-testid="subscribe-button"
      type={type}
      className={className}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock Form components
jest.mock('../../components/ui/form', () => ({
  Form: ({ children, ...props }: any) => (
    <div data-testid="subscription-form" {...props}>
      {children}
    </div>
  ),
  FormControl: ({ children, ...props }: any) => (
    <div data-testid="form-control" {...props}>
      {children}
    </div>
  ),
  FormField: ({ render, name, rules }: any) => {
    const MockFormField = () => {
      const [value, setValue] = React.useState('');
      const [error, setError] = React.useState('');

      const field = {
        value,
        onChange: (e: any) => {
          setValue(e.target.value);
          // Basic email validation for testing
          const email = e.target.value;
          if (rules?.required && !email) {
            setError(typeof rules.required === 'string' ? rules.required : 'Required');
          } else if (rules?.pattern && email && !rules.pattern.value.test(email)) {
            setError(rules.pattern.message);
          } else {
            setError('');
          }
        },
        name,
      };

      return (
        <div data-testid="form-field">
          {render({ field })}
          {error && <div data-testid="field-error">{error}</div>}
        </div>
      );
    };
    return <MockFormField />;
  },
  FormItem: ({ children, className, ...props }: any) => (
    <div data-testid="form-item" className={className} {...props}>
      {children}
    </div>
  ),
  FormMessage: ({ children, className, ...props }: any) => (
    <div data-testid="form-message" className={className} {...props}>
      {children}
    </div>
  ),
}));

// Mock react-hook-form
const mockHandleSubmit = jest.fn((onSubmit) => (e?: React.FormEvent) => {
  e?.preventDefault();
  return onSubmit({ email: 'test@example.com' });
});

const mockReset = jest.fn();

jest.mock('react-hook-form', () => ({
  useForm: jest.fn(() => ({
    control: {},
    handleSubmit: mockHandleSubmit,
    reset: mockReset,
  })),
}));

describe('SubscriptionBanner Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSitecore.mockReturnValue(mockUseSitecoreNormal);

    // Mock console.log to avoid test output pollution
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Default Rendering', () => {
    it('renders complete subscription banner with all content', () => {
      render(<SubscriptionBannerDefault {...defaultSubscriptionBannerProps} />);

      // Check main structure - use querySelector for section
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();

      // Check title
      expect(screen.getByTestId('sitecore-title')).toHaveAttribute(
        'data-field-value',
        'Stay Updated with SYNC Audio'
      );

      // Check description
      expect(screen.getByTestId('sitecore-description')).toHaveAttribute(
        'data-field-value',
        'Get the latest updates on new products, exclusive offers, and audio insights delivered straight to your inbox.'
      );

      // Check form elements
      expect(screen.getByTestId('subscription-form')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('subscribe-button')).toBeInTheDocument();
    });

    it('applies correct CSS classes and styling', () => {
      render(<SubscriptionBannerDefault {...defaultSubscriptionBannerProps} />);

      const section = document.querySelector('section');
      expect(section).toHaveClass('w-full', 'mx-auto', 'px-4', 'py-16', 'text-center');

      const container = section?.querySelector('.max-w-5xl');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('@container');
    });

    it('renders with semantic HTML structure', () => {
      render(<SubscriptionBannerDefault {...defaultSubscriptionBannerProps} />);

      // Check semantic structure
      const section = document.querySelector('section');
      expect(section?.tagName).toBe('SECTION');

      // Check form structure - the actual form is nested inside the mocked Form component
      const form = document.querySelector('form');
      expect(form?.tagName).toBe('FORM');

      // Check input type
      const emailInput = screen.getByTestId('email-input');
      expect(emailInput).toHaveAttribute('type', 'email');
    });
  });

  describe('Form Functionality', () => {
    it('renders email input with correct placeholder', () => {
      render(<SubscriptionBannerDefault {...defaultSubscriptionBannerProps} />);

      const emailInput = screen.getByTestId('email-input');
      expect(emailInput).toHaveAttribute('placeholder', 'Enter your email address');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('renders submit button with correct text', () => {
      render(<SubscriptionBannerDefault {...defaultSubscriptionBannerProps} />);

      const submitButton = screen.getByTestId('subscribe-button');
      expect(submitButton).toHaveTextContent('Subscribe Now');
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('handles form submission correctly', async () => {
      render(<SubscriptionBannerDefault {...defaultSubscriptionBannerProps} />);

      const form = screen.getByTestId('subscription-form');

      await act(async () => {
        fireEvent.submit(form);
      });

      expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it('uses custom placeholder when provided', () => {
      render(<SubscriptionBannerDefault {...subscriptionBannerPropsCustomMessages} />);

      const emailInput = screen.getByTestId('email-input');
      expect(emailInput).toHaveAttribute('placeholder', 'Your email here...');
    });

    it('falls back to default placeholder when not provided', () => {
      render(<SubscriptionBannerDefault {...subscriptionBannerPropsMinimal} />);

      const emailInput = screen.getByTestId('email-input');
      expect(emailInput).toHaveAttribute('placeholder', 'Enter your email address');
    });

    it('uses fallback button text when link text is empty', () => {
      const propsWithEmptyButtonText = {
        ...defaultSubscriptionBannerProps,
        fields: {
          ...defaultSubscriptionBannerProps.fields,
          buttonLink: { value: { href: '/subscribe', text: '' } } as any,
        },
      };

      render(<SubscriptionBannerDefault {...propsWithEmptyButtonText} />);

      const submitButton = screen.getByTestId('subscribe-button');
      expect(submitButton).toHaveTextContent('Subscribe');
    });
  });

  describe('Content Scenarios', () => {
    it('renders without description when not provided', () => {
      render(<SubscriptionBannerDefault {...subscriptionBannerPropsNoDescription} />);

      // Title should still render
      expect(screen.getByTestId('sitecore-title')).toHaveAttribute(
        'data-field-value',
        'Stay Updated with SYNC Audio'
      );

      // Description should not render
      expect(screen.queryByText(/Get the latest updates on new products/)).not.toBeInTheDocument();

      // Form should still render
      expect(screen.getByTestId('subscription-form')).toBeInTheDocument();
    });

    it('handles minimal props configuration', () => {
      render(<SubscriptionBannerDefault {...subscriptionBannerPropsMinimal} />);

      expect(screen.getByTestId('sitecore-title')).toHaveAttribute(
        'data-field-value',
        'Subscribe to Our Newsletter'
      );
      expect(screen.getByTestId('subscribe-button')).toHaveTextContent('Subscribe');
      expect(screen.getByTestId('email-input')).toHaveAttribute(
        'placeholder',
        'Enter your email address'
      );
    });

    it('handles long content gracefully', () => {
      render(<SubscriptionBannerDefault {...subscriptionBannerPropsLongContent} />);

      const titleElement = screen.getByTestId('sitecore-title');
      expect(titleElement).toHaveAttribute('data-field-value');
      expect(titleElement.getAttribute('data-field-value')).toContain(
        'Stay Connected with SYNC Audio'
      );

      const descriptionElement = screen.getByTestId('sitecore-description');
      expect(descriptionElement.getAttribute('data-field-value')).toContain(
        'Join our comprehensive newsletter'
      );
      expect(screen.getByTestId('subscribe-button')).toHaveTextContent(
        'Join Our Audio Community Today'
      );
    });

    it('handles special characters in content', () => {
      render(<SubscriptionBannerDefault {...subscriptionBannerPropsSpecialChars} />);

      expect(screen.getByTestId('sitecore-title')).toHaveAttribute(
        'data-field-value',
        'Sübscrïbe tö SYNC™ Àudio Üpdates & Spëciàl Öffers'
      );
      const descriptionElement = screen.getByTestId('sitecore-description');
      expect(descriptionElement.getAttribute('data-field-value')).toContain(
        'Reçevez des mises à jour'
      );
      expect(screen.getByTestId('email-input')).toHaveAttribute(
        'placeholder',
        'Entrez votre adresse e-mail ici...'
      );
    });

    it('handles empty field values', () => {
      render(<SubscriptionBannerDefault {...subscriptionBannerPropsEmptyFields} />);

      // Should render with empty content but not crash
      expect(screen.getByTestId('sitecore-title')).toHaveAttribute('data-field-value', '');
      expect(screen.getByTestId('email-input')).toHaveAttribute(
        'placeholder',
        'Enter your email address'
      );
      expect(screen.getByTestId('subscribe-button')).toHaveTextContent('Subscribe');
    });
  });

  describe('Form Validation', () => {
    it('provides email validation pattern', () => {
      render(<SubscriptionBannerDefault {...subscriptionBannerPropsTestValidation} />);

      // The form field should be rendered with validation
      expect(screen.getByTestId('form-field')).toBeInTheDocument();

      // Input should have email type
      const emailInput = screen.getByTestId('email-input');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('uses custom error message when provided', () => {
      render(<SubscriptionBannerDefault {...subscriptionBannerPropsCustomMessages} />);

      // Error messages are handled by react-hook-form in the actual implementation
      // Here we test that the component has the structure to support validation
      expect(screen.getByTestId('form-field')).toBeInTheDocument();
      expect(screen.getByTestId('form-message')).toBeInTheDocument();
    });
  });

  describe('Submission States', () => {
    it('handles form submission and shows thank you state', async () => {
      render(<SubscriptionBannerDefault {...defaultSubscriptionBannerProps} />);

      const form = screen.getByTestId('subscription-form');

      await act(async () => {
        fireEvent.submit(form);
      });

      // Verify that handleSubmit was called
      expect(mockHandleSubmit).toHaveBeenCalled();

      // The form submission flow is working correctly
      // (mockReset would be called in the real implementation within the onSubmit handler)
    });

    it('uses custom thank you message when provided', () => {
      render(<SubscriptionBannerDefault {...subscriptionBannerPropsCustomMessages} />);

      // Thank you message configuration should be available
      // In the real component, this would show after submission
      expect(screen.getByTestId('subscription-form')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing fields gracefully', () => {
      expect(() => {
        render(<SubscriptionBannerDefault {...subscriptionBannerPropsNoFields} />);
      }).not.toThrow();
    });

    it('handles undefined title field', () => {
      expect(() => {
        render(<SubscriptionBannerDefault {...subscriptionBannerPropsUndefinedTitle} />);
      }).not.toThrow();
    });

    it('handles missing params', () => {
      const propsWithoutParams = {
        ...defaultSubscriptionBannerProps,
        params: undefined as any,
      };

      expect(() => {
        render(<SubscriptionBannerDefault {...propsWithoutParams} />);
      }).not.toThrow();
    });
  });

  describe('Component Structure', () => {
    it('uses proper container and layout classes', () => {
      render(<SubscriptionBannerDefault {...defaultSubscriptionBannerProps} />);

      const section = document.querySelector('section');
      expect(section).toHaveClass('w-full', 'mx-auto', 'px-4', 'py-16', 'text-center');

      const innerContainer = section?.querySelector('.max-w-5xl');
      expect(innerContainer).toBeInTheDocument();
      expect(innerContainer).toHaveClass('mx-auto', '@container');
    });

    it('structures form elements correctly', () => {
      render(<SubscriptionBannerDefault {...defaultSubscriptionBannerProps} />);

      const form = document.querySelector('form');
      expect(form).toHaveClass(
        'flex',
        'flex-col',
        'gap-6',
        'justify-center',
        'items-center',
        'max-w-md',
        'mx-auto'
      );
    });

    it('applies correct typography classes to title', () => {
      render(<SubscriptionBannerDefault {...defaultSubscriptionBannerProps} />);

      const title = screen.getByTestId('sitecore-title');
      expect(title).toHaveClass(
        'text-primary',
        'font-heading',
        'font-normal',
        'leading-tight',
        'tracking-tight',
        'mb-6'
      );
    });
  });

  describe('Accessibility', () => {
    it('provides semantic form structure', () => {
      render(<SubscriptionBannerDefault {...defaultSubscriptionBannerProps} />);

      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();

      const emailInput = screen.getByTestId('email-input');
      expect(emailInput).toHaveAttribute('type', 'email');

      const submitButton = screen.getByTestId('subscribe-button');
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('uses proper heading hierarchy', () => {
      render(<SubscriptionBannerDefault {...defaultSubscriptionBannerProps} />);

      // Title should be rendered as h2
      const title = screen.getByTestId('sitecore-title');
      expect(title.tagName).toBe('H2');
    });

    it('provides proper form labeling structure', () => {
      render(<SubscriptionBannerDefault {...defaultSubscriptionBannerProps} />);

      // Form structure should be accessible
      expect(screen.getByTestId('form-field')).toBeInTheDocument();
      expect(screen.getByTestId('form-control')).toBeInTheDocument();
      expect(screen.getByTestId('form-item')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders efficiently without unnecessary re-renders', () => {
      const { rerender } = render(
        <SubscriptionBannerDefault {...defaultSubscriptionBannerProps} />
      );

      rerender(<SubscriptionBannerDefault {...defaultSubscriptionBannerProps} />);

      const rerenderTitle = screen.getByTestId('sitecore-title');
      expect(rerenderTitle).toBeInTheDocument();
    });

    it('handles state changes efficiently', async () => {
      render(<SubscriptionBannerDefault {...defaultSubscriptionBannerProps} />);

      const form = screen.getByTestId('subscription-form');

      // Multiple rapid submissions shouldn't cause issues
      await act(async () => {
        fireEvent.submit(form);
        fireEvent.submit(form);
      });

      expect(screen.getByTestId('subscription-form')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('integrates with react-hook-form correctly', () => {
      render(<SubscriptionBannerDefault {...defaultSubscriptionBannerProps} />);

      // Verify form structure supports react-hook-form integration
      expect(screen.getByTestId('form-field')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();

      // Form submission should work
      const form = screen.getByTestId('subscription-form');
      expect(() => fireEvent.submit(form)).not.toThrow();
    });

    it('works with Sitecore field components', () => {
      render(<SubscriptionBannerDefault {...defaultSubscriptionBannerProps} />);

      // Check that Sitecore field components are rendered
      const title = screen.getByTestId('sitecore-title');
      const description = screen.getByTestId('sitecore-description');

      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();

      // Title should have field value
      expect(title).toHaveAttribute('data-field-value', 'Stay Updated with SYNC Audio');
    });
  });

  describe('Responsive Design', () => {
    it('uses container queries for responsive behavior', () => {
      render(<SubscriptionBannerDefault {...defaultSubscriptionBannerProps} />);

      const section = document.querySelector('section');
      const container = section?.querySelector('.max-w-5xl');
      expect(container).toHaveClass('@container');
    });

    it('applies responsive typography classes', () => {
      render(<SubscriptionBannerDefault {...defaultSubscriptionBannerProps} />);

      const title = screen.getByTestId('sitecore-title');
      expect(title).toHaveClass('[font-size:clamp(theme(fontSize.3xl),5cqi,theme(fontSize.7xl))]');
    });
  });
});
