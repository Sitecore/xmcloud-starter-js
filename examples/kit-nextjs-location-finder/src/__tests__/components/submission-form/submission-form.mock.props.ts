import type { SubmissionFormProps } from '@/components/submission-form/submission-form.props';
import { Page } from '@sitecore-content-sdk/nextjs';

// Mock page object with all required Page properties
const mockPageBase = {
  mode: {
    isEditing: false,
    isPreview: false,
    isNormal: true,
    name: 'normal' as const,
    designLibrary: { isVariantGeneration: false },
    isDesignLibrary: false,
  },
  layout: {
    sitecore: {
      context: {},
      route: null,
    },
  },
  locale: 'en',
} as Page;

export const mockSubmissionFormProps: SubmissionFormProps = {
  rendering: {
    componentName: 'SubmissionForm',
    dataSource: 'mock-datasource',
  },
  params: {},
  fields: {
    title: {
      value: 'Request a Vehicle Quote',
    },
  },
  page: mockPageBase,
  isPageEditing: false,
};

export const mockSubmissionFormPropsDemo: SubmissionFormProps = {
  rendering: {
    componentName: 'SubmissionForm',
    dataSource: 'mock-datasource',
  },
  params: {
    styles: 'position-center',
  },
  fields: {
    title: {
      value: 'Schedule Your Vehicle Demo',
    },
  },
  page: mockPageBase,
  isPageEditing: false,
};

export const mockSubmissionFormPropsContact: SubmissionFormProps = {
  rendering: {
    componentName: 'SubmissionForm',
    dataSource: 'mock-datasource',
  },
  params: {
    styles: 'position-right',
  },
  fields: {
    title: {
      value: 'Contact Our Fleet Specialists',
    },
  },
  page: mockPageBase,
  isPageEditing: false,
};
