import React from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { SubmissionFormProps } from './submission-form.props';
import { SubmissionFormDefault } from './SubmissionFormDefault.dev';
import { SubmissionFormCentered } from './SubmissionFormCentered.dev';

// Data source checks are done in the child components
// Default display of the component

export const Default: React.FC<SubmissionFormProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  return <SubmissionFormDefault {...props} isPageEditing={isEditing} />;
};

// Variants
export const Centered: React.FC<SubmissionFormProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  return <SubmissionFormCentered {...props} isPageEditing={isEditing} />;
};
