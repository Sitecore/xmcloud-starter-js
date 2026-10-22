import type { Field } from '@sitecore-content-sdk/nextjs';
import { EnumValues } from '@/enumerations/generic.enum';
import { ButtonVariants } from '@/enumerations/ButtonStyle.enum';

export interface EmailSignupFormProps {
  fields?: {
    emailPlaceholder?: Field<string>;
    emailErrorMessage?: Field<string>;
    emailSubmitLabel?: Field<string>;
    emailSuccessMessage?: Field<string>;
    buttonVariant?: EnumValues<typeof ButtonVariants>;
  };
}
