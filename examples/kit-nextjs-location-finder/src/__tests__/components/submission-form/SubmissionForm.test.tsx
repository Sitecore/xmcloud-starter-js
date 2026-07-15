import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockSubmissionFormProps } from './submission-form.mock.props';

// Mock child components first (used by SubmissionForm mock)
jest.mock('@/components/submission-form/SubmissionFormDefault.dev', () => ({
  SubmissionFormDefault: ({ isPageEditing }: { isPageEditing?: boolean }) => (
    <section data-testid="submission-form-default">
      SubmissionFormDefault - {isPageEditing ? 'Editing' : 'Normal'}
    </section>
  ),
}));

jest.mock('@/components/submission-form/SubmissionFormCentered.dev', () => ({
  SubmissionFormCentered: ({ isPageEditing }: { isPageEditing?: boolean }) => (
    <section data-testid="submission-form-centered">
      SubmissionFormCentered - {isPageEditing ? 'Editing' : 'Normal'}
    </section>
  ),
}));

// Mock SubmissionForm to bypass next/dynamic and render mocked children directly
jest.mock('@/components/submission-form/SubmissionForm', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest mock factory needs require
  const { SubmissionFormDefault } = require('@/components/submission-form/SubmissionFormDefault.dev');
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest mock factory needs require
  const { SubmissionFormCentered } = require('@/components/submission-form/SubmissionFormCentered.dev');
  return {
    Default: (props: Record<string, unknown>) => <SubmissionFormDefault {...props} isPageEditing={false} />,
    Centered: (props: Record<string, unknown>) => <SubmissionFormCentered {...props} isPageEditing={false} />,
  };
});

import { Default as SubmissionForm, Centered } from '@/components/submission-form/SubmissionForm';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: jest.fn(() => ({
    page: {
      mode: {
        isEditing: false,
        isPreview: false,
        isNormal: true,
      },
    },
  })),
}));

describe('SubmissionForm', () => {
  it('renders Default variant correctly', () => {
    render(<SubmissionForm {...mockSubmissionFormProps} />);
    expect(screen.getByTestId('submission-form-default')).toBeInTheDocument();
    expect(screen.getByText(/SubmissionFormDefault - Normal/)).toBeInTheDocument();
  });

  it('renders Centered variant correctly', () => {
    render(<Centered {...mockSubmissionFormProps} />);
    expect(screen.getByTestId('submission-form-centered')).toBeInTheDocument();
    expect(screen.getByText(/SubmissionFormCentered - Normal/)).toBeInTheDocument();
  });

  it('passes isPageEditing prop to child components', () => {
    const { rerender } = render(<SubmissionForm {...mockSubmissionFormProps} />);
    expect(screen.getByTestId('submission-form-default')).toBeInTheDocument();

    rerender(<Centered {...mockSubmissionFormProps} />);
    expect(screen.getByTestId('submission-form-centered')).toBeInTheDocument();
  });
});
