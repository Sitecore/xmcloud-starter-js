import { Field } from '@sitecore-content-sdk/nextjs';

import type { OptionalComponentProps } from '@/lib/component-props';

interface SubmissionFormParams {
  [key: string]: any; // eslint-disable-line
}

interface SubmissionFormFields {
  title: Field<string>;
}

export interface SubmissionFormProps extends OptionalComponentProps {
  params: SubmissionFormParams;
  fields: SubmissionFormFields;
  isPageEditing?: boolean;
}

