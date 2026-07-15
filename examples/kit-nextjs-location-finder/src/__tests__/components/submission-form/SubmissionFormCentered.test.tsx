import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SubmissionFormCentered } from '@/components/submission-form/SubmissionFormCentered.dev';
import { mockSubmissionFormPropsDemo } from './submission-form.mock.props';

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

describe('SubmissionFormCentered', () => {
  it('renders centered layout with vehicle demo title', () => {
    render(<SubmissionFormCentered {...mockSubmissionFormPropsDemo} />);

    expect(screen.getByText('Schedule Your Vehicle Demo')).toBeInTheDocument();
    expect(screen.getByTestId('submit-info-form')).toBeInTheDocument();
  });

  it('renders submit info form in centered layout', () => {
    render(<SubmissionFormCentered {...mockSubmissionFormPropsDemo} />);

    const form = screen.getByTestId('submit-info-form');
    expect(form).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /SUBMITINFOFORM_ButtonText/i })).toBeInTheDocument();
  });

  it('renders NoDataFallback when fields are not provided', () => {
    const propsWithoutFields = { ...mockSubmissionFormPropsDemo, fields: null as never };
    render(<SubmissionFormCentered {...propsWithoutFields} />);

    expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    expect(screen.getByText('No Data: SubmissionForm')).toBeInTheDocument();
  });
});
