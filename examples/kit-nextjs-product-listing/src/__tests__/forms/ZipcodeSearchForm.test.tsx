/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as ZipcodeSearchForm } from '@/components/forms/zipcode/ZipcodeSearchForm.dev';

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

describe('ZipcodeSearchForm', () => {
  it('renders zipcode input and submit button', () => {
    const onSubmit = jest.fn();
    render(<ZipcodeSearchForm onSubmit={onSubmit} defaultZipcode="" />);

    const input = screen.getByPlaceholderText(/enter your zip code/i);
    const btn = screen.getByRole('button');

    expect(input).toBeInTheDocument();
    expect(btn).toBeInTheDocument();
  });
});
