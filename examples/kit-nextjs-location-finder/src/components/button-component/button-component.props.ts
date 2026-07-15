import type { ComponentRendering, LinkField, ImageField } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';
import type { EnumValues } from '@/enumerations/generic.enum';
import type { IconName } from '@/enumerations/Icon.enum';
import type { IconPosition } from '@/enumerations/IconPosition.enum';
import type { ButtonVariants, ButtonSize } from '@/enumerations/ButtonStyle.enum';

export type ButtonFields = {
  buttonLink: LinkField;
  icon?: { value: EnumValues<typeof IconName> };
  iconClassName?: string;
  isAriaHidden?: boolean;
};

export type ButtonParams = {
  size?: EnumValues<typeof ButtonSize>;
  iconPosition?: EnumValues<typeof IconPosition>;
  iconClassName?: string;
  isPageEditing?: boolean;
  [key: string]: unknown;
};

export type ButtonComponentProps = OptionalComponentProps & {
  fields: ButtonFields;
  params?: ButtonParams;
  variant?: EnumValues<typeof ButtonVariants>;
  page?: { mode?: { isEditing?: boolean } };
};

export type ButtonRendering = { rendering: ComponentRendering };

export type ButtonBaseProps = ButtonParams &
  ButtonFields & {
    variant?: EnumValues<typeof ButtonVariants>;
    className?: string;
  };

export const linkIsValid = (link: LinkField) => {
  const href = link?.value?.href || link?.value?.url;
  return (
    !!link?.value?.text &&
    !!href &&
    href !== 'http://' &&
    href !== 'http://#' &&
    href !== '#'
  );
};

export const isValidEditableLink = (link: LinkField, icon?: ImageField) => {
  const href = link?.value?.href || link?.value?.url;
  return (
    !!link?.value?.text ||
    (icon?.value?.src &&
      !!href &&
      href !== 'http://' &&
      href !== 'http://#' &&
      href !== '#')
  );
};

