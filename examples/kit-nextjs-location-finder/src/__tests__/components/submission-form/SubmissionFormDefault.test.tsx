import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SubmissionFormDefault } from '@/components/submission-form/SubmissionFormDefault.dev';
import {
  mockSubmissionFormProps,
  mockSubmissionFormPropsContact,
} from './submission-form.mock.props';

// Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: jest.fn(({ field, tag = 'span', className }) => {
    const Tag = tag as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, { className, 'data-testid': 'text-component' }, field?.value);
  }),
}));

jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: jest.fn(({ componentName }) => (
    <div data-testid="no-data-fallback">No Data: {componentName}</div>
  )),
}));

jest.mock('@/components/forms/submitinfo/SubmitInfoForm.dev', () => ({
  Default: ({ fields }: { fields: { buttonText: { value: string } } }) => (
    <form data-testid="submit-info-form">
      <button type="submit">{fields.buttonText.value}</button>
    </form>
  ),
}));

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(() => (key: string) => key),
}));

jest.mock('@/variables/dictionary', () => ({
  dictionaryKeys: {
    SUBMITINFOFORM_FirstNameLabel: 'SUBMITINFOFORM_FirstNameLabel',
    SUBMITINFOFORM_FirstNamePlaceholder: 'SUBMITINFOFORM_FirstNamePlaceholder',
    SUBMITINFOFORM_LastNameLabel: 'SUBMITINFOFORM_LastNameLabel',
    SUBMITINFOFORM_LastNamePlaceholder: 'SUBMITINFOFORM_LastNamePlaceholder',
    SUBMITINFOFORM_ZipcodeLabel: 'SUBMITINFOFORM_ZipcodeLabel',
    SUBMITINFOFORM_ZipcodePlaceholder: 'SUBMITINFOFORM_ZipcodePlaceholder',
    SUBMITINFOFORM_EmailLabel: 'SUBMITINFOFORM_EmailLabel',
    SUBMITINFOFORM_EmailPlaceholder: 'SUBMITINFOFORM_EmailPlaceholder',
    SUBMITINFOFORM_EmailErrorMessage: 'SUBMITINFOFORM_EmailErrorMessage',
    SUBMITINFOFORM_PhoneLabel: 'SUBMITINFOFORM_PhoneLabel',
    SUBMITINFOFORM_PhonePlaceholder: 'SUBMITINFOFORM_PhonePlaceholder',
    SUBMITINFOFORM_ButtonText: 'SUBMITINFOFORM_ButtonText',
    SUBMITINFOFORM_SuccessMessage: 'SUBMITINFOFORM_SuccessMessage',
  },
}));

jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...args) => args.filter(Boolean).flat().join(' ')),
}));

describe('SubmissionFormDefault', () => {
  it('renders vehicle quote form with title', () => {
    render(<SubmissionFormDefault {...mockSubmissionFormProps} />);

    expect(screen.getByText('Request a Vehicle Quote')).toBeInTheDocument();
    expect(screen.getByTestId('submit-info-form')).toBeInTheDocument();
  });

  it('renders submit info form with button', () => {
    render(<SubmissionFormDefault {...mockSubmissionFormProps} />);

    const form = screen.getByTestId('submit-info-form');
    expect(form).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /SUBMITINFOFORM_ButtonText/i })).toBeInTheDocument();
  });

  it('applies custom position styles when provided', () => {
    const { container } = render(<SubmissionFormDefault {...mockSubmissionFormPropsContact} />);

    expect(screen.getByText('Contact Our Fleet Specialists')).toBeInTheDocument();
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('data-component', 'SubmissionForm');
  });
});
