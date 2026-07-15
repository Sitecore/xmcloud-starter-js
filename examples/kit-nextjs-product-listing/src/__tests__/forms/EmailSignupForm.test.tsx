/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock lucide-react to avoid ESM module parse issues in tests
jest.mock('lucide-react', () => ({
  CheckCircle: () => <svg data-testid="icon" />,
}));

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: { field?: any }) => <span>{field?.value ?? 'x'}</span>,
}));

// Mock form primitives used by UI components to allow simple rendering
jest.mock('@/components/ui/form', () => ({
  Form: ({ children }: any) => <div>{children}</div>,
  FormField: ({ render }: any) => render({ field: { value: '', onChange: () => {} } }),
  FormItem: ({ children }: any) => <div>{children}</div>,
  FormLabel: ({ children }: any) => <label>{children}</label>,
  FormControl: ({ children }: any) => <div>{children}</div>,
  FormMessage: () => null,
}));

jest.mock('@/components/ui/input', () => ({ Input: (props: any) => <input {...props} /> }));
jest.mock('@/components/ui/button', () => ({ Button: (props: any) => <button {...props} /> }));

import { Default as EmailSignupForm } from '@/components/forms/email/EmailSignupForm.dev';

describe('EmailSignupForm', () => {
  it('renders input and submit button', () => {
    const props = { fields: {} } as any;
    render(<EmailSignupForm {...props} />);

    const input = screen.getByPlaceholderText(/enter your email address/i);
    const btn = screen.getByRole('button');

    expect(input).toBeInTheDocument();
    expect(btn).toBeInTheDocument();
  });
});
