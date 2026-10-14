/* eslint-disable */
import { Field } from '@sitecore-content-sdk/nextjs';
import { SubmissionFormProps } from '../../components/submission-form/submission-form.props';
import { mockPage, mockPageEditing } from '../test-utils/mockPage';

// Inline utility functions
const createMockField = <T>(value: T): Field<T> => ({ value }) as unknown as Field<T>;

// Mock useSitecore contexts
export const mockUseSitecoreNormal = {
  page: { mode: { isEditing: false } },
} as unknown;

export const mockUseSitecoreEditing = {
  page: { mode: { isEditing: true } },
} as unknown;

// Default submission form props
export const defaultSubmissionFormProps: SubmissionFormProps = {
  rendering: { componentName: 'SubmissionForm' },
  params: {
    styles: 'position-left',
  },
  fields: {
    title: createMockField('Get Started with SYNC Audio'),
  },
  page: mockPage,
};

// Props for centered variant
export const submissionFormPropsCentered: SubmissionFormProps = {
  rendering: { componentName: 'SubmissionForm' },
  params: {
    styles: 'position-center custom-styling',
  },
  fields: {
    title: createMockField('Join the SYNC Community'),
  },
  page: mockPage,
};

// Props with custom position styles
export const submissionFormPropsCustomPosition: SubmissionFormProps = {
  rendering: { componentName: 'SubmissionForm' },
  params: {
    styles: 'position-right bg-primary text-white',
  },
  fields: {
    title: createMockField('Contact Our Audio Experts'),
  },
  page: mockPage,
};

// Props without position styles (should default)
export const submissionFormPropsNoPosition: SubmissionFormProps = {
  rendering: { componentName: 'SubmissionForm' },
  params: {
    styles: 'custom-background rounded-corners',
  },
  fields: {
    title: createMockField('Connect with SYNC'),
  },
  page: mockPage,
};

// Props with no styles parameter
export const submissionFormPropsNoStyles: SubmissionFormProps = {
  rendering: { componentName: 'SubmissionForm' },
  params: {},
  fields: {
    title: createMockField('Simple Form Title'),
  },
  page: mockPage,
};

// Props with empty title
export const submissionFormPropsEmptyTitle: SubmissionFormProps = {
  rendering: { componentName: 'SubmissionForm' },
  params: {
    styles: 'position-left',
  },
  fields: {
    title: createMockField(''),
  },
  page: mockPage,
};

// Props with no title field
export const submissionFormPropsNoTitle: SubmissionFormProps = {
  rendering: { componentName: 'SubmissionForm' },
  params: {
    styles: 'position-center',
  },
  fields: {} as any,
  page: mockPage,
};

// Props with no fields (should show fallback)
export const submissionFormPropsNoFields: SubmissionFormProps = {
  rendering: { componentName: 'SubmissionForm' },
  params: {
    styles: 'position-left',
  },
  fields: null as any,
  page: mockPage,
};

// Props with long title text
export const submissionFormPropsLongTitle: SubmissionFormProps = {
  rendering: { componentName: 'SubmissionForm' },
  params: {
    styles: 'position-center complex-styling with-multiple-classes',
  },
  fields: {
    title: createMockField(
      'Experience Premium Audio Excellence with SYNC Professional Equipment - Connect with Our Expert Team for Personalized Recommendations'
    ),
  },
  page: mockPage,
};

// Props with special characters
export const submissionFormPropsSpecialChars: SubmissionFormProps = {
  rendering: { componentName: 'SubmissionForm' },
  params: {
    styles: 'position-left "quoted-class" & special/chars',
  },
  fields: {
    title: createMockField('SYNC™ Àudio - Jóin Öur Prémium Cömmunity & Gët Ëxclusive Àccess'),
  },
  page: mockPage,
};

// Props for testing different positions
export const submissionFormPropsPositionLeft: SubmissionFormProps = {
  rendering: { componentName: 'SubmissionForm' },
  params: {
    styles: 'position-left bg-background',
  },
  fields: {
    title: createMockField('Left Aligned Form'),
  },
  page: mockPage,
};

export const submissionFormPropsPositionCenter: SubmissionFormProps = {
  rendering: { componentName: 'SubmissionForm' },
  params: {
    styles: 'position-center bg-secondary',
  },
  fields: {
    title: createMockField('Center Aligned Form'),
  },
  page: mockPage,
};

export const submissionFormPropsPositionRight: SubmissionFormProps = {
  rendering: { componentName: 'SubmissionForm' },
  params: {
    styles: 'position-right bg-accent',
  },
  fields: {
    title: createMockField('Right Aligned Form'),
  },
  page: mockPage,
};

// Props with undefined fields
export const submissionFormPropsUndefinedTitle: SubmissionFormProps = {
  rendering: { componentName: 'SubmissionForm' },
  params: {
    styles: 'position-left',
  },
  fields: {
    title: undefined as any,
  },
  page: mockPage,
};
