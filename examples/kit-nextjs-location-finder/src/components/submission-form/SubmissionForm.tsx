import React from 'react';
import { useSitecoreContext } from '@sitecore-content-sdk/nextjs';
import { SubmissionFormProps } from './submission-form.props';
import { SubmissionFormDefault } from './SubmissionFormDefault.dev';
import { SubmissionFormCentered } from './SubmissionFormCentered.dev';

{
  /* 
    Jira Ticket Information:
    - Key: SCDS-161
    - Summary: Submission Form
    - URL: https://velir.atlassian.net/browse/SCDS-161
  */
}

// Data source checks are done in the child components
// Default display of the component

export const Default: React.FC<SubmissionFormProps> = (props) => {
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext?.pageEditing ?? false;

  return <SubmissionFormDefault {...props} isPageEditing={isPageEditing} />;
};

// Variants
export const Centered: React.FC<SubmissionFormProps> = (props) => {
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext?.pageEditing ?? false;

  return <SubmissionFormCentered {...props} isPageEditing={isPageEditing} />;
};
