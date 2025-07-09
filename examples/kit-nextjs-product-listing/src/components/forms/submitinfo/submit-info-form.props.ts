import type { Field } from '@sitecore-content-sdk/nextjs';
import { EnumValues } from '@/enumerations/generic.enum';
import { ButtonVariants } from '@/enumerations/ButtonStyle.enum';

export interface SubmitInfoFormProps {
  fields?: {
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
  className?: string;
}
