import { Field } from '@sitecore-content-sdk/nextjs';

import { ComponentProps } from '@/lib/component-props';

interface SubmissionFormParams {
  [key: string]: any; // eslint-disable-line
}

interface SubmissionFormFields {
  title: Field<string>;
}

export interface SubmissionFormProps extends ComponentProps {
  params: SubmissionFormParams;
  fields: SubmissionFormFields;
  isPageEditing?: boolean;
}
