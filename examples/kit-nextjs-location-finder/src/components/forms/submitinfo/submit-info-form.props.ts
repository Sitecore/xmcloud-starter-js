import type { Field } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';
import type { EnumValues } from '@/enumerations/generic.enum';
import type { ButtonVariants } from '@/enumerations/ButtonStyle.enum';

export type SubmitInfoFormFields = {
  firstNameLabel?: Field<string>;
  firstNamePlaceholder?: Field<string>;
  lastNameLabel?: Field<string>;
  lastNamePlaceholder?: Field<string>;
  zipcodeLabel?: Field<string>;
  zipcodePlaceholder?: Field<string>;
  emailLabel?: Field<string>;
  emailPlaceholder?: Field<string>;
  emailErrorMessage?: Field<string>;
  phoneLabel?: Field<string>;
  phonePlaceholder?: Field<string>;
  buttonText?: Field<string>;
  successMessage?: Field<string>;
  buttonVariant?: EnumValues<typeof ButtonVariants>;
};

/** Supports full Sitecore props or embedded usage with fields only. */
export type SubmitInfoFormProps = Partial<OptionalComponentProps> & {
  fields?: SubmitInfoFormFields;
  className?: string;
};


