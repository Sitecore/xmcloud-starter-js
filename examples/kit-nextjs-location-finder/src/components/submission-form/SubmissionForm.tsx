'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { SubmissionFormProps } from './submission-form.props';

// Dynamically import form variants — defers react-hook-form, zod, google-libphonenumber
const SubmissionFormDefault = dynamic(
  () => import('./SubmissionFormDefault.dev').then((mod) => mod.SubmissionFormDefault),
  { ssr: false }
);
const SubmissionFormCentered = dynamic(
  () => import('./SubmissionFormCentered.dev').then((mod) => mod.SubmissionFormCentered),
  { ssr: false }
);

// Data source checks are done in the child components
// Default display of the component

export const Default: React.FC<SubmissionFormProps> = (props) => {
  const { isEditing } = props.page.mode;

  return <SubmissionFormDefault {...props} isPageEditing={isEditing} />;
};

// Variants
export const Centered: React.FC<SubmissionFormProps> = (props) => {
  const { isEditing } = props.page.mode;

  return <SubmissionFormCentered {...props} isPageEditing={isEditing} />;
};
