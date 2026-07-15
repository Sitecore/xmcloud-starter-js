import type { Field } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';
import type { EnumValues } from '@/enumerations/generic.enum';
import type { ButtonVariants } from '@/enumerations/ButtonStyle.enum';

export type EmailSignupFormFields = {
  emailPlaceholder?: Field<string>;
  emailErrorMessage?: Field<string>;
  emailSubmitLabel?: Field<string>;
  emailSuccessMessage?: Field<string>;
  buttonVariant?: EnumValues<typeof ButtonVariants>;
};

/** Supports full Sitecore props or embedded usage with fields only. */
export type EmailSignupFormProps = Partial<OptionalComponentProps> & {
  fields?: EmailSignupFormFields;
};


