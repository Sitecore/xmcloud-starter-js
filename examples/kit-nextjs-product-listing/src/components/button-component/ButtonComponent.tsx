/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type JSX } from 'react';
import { Default as Icon } from '@/components/icon/Icon';
import { IconName } from '@/enumerations/Icon.enum';
import { Link, LinkField, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { Button } from '@/components/ui/button';
import { EnumValues } from '@/enumerations/generic.enum';
import { IconPosition } from '@/enumerations/IconPosition.enum';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { ImageField } from '@sitecore-content-sdk/nextjs';
import { ButtonVariants, ButtonSize } from '@/enumerations/ButtonStyle.enum';
/**
 * Model used for Sitecore Component integration
 */

export type ButtonFields = {
  fields: {
    buttonLink: LinkField;
    icon?: { value: EnumValues<typeof IconName> };
    iconClassName?: string;
    isAriaHidden?: boolean;
  };
  variant?: EnumValues<typeof ButtonVariants>;
  params: {
    size?: EnumValues<typeof ButtonSize>;
    iconPosition?: EnumValues<typeof IconPosition>;
    iconClassName?: string;
    isPageEditing?: boolean;
  };
};

export type ButtonRendering = { rendering: ComponentRendering };
const linkIsValid = (link: LinkField) => {
  return (
    !!link?.value?.text &&
    (!!link?.value?.href || !!link?.value?.url) &&
    link?.value?.href !== 'http://'
  );
};
const isValidEditableLink = (link: LinkField, icon?: ImageField) => {
  return (
    !!link?.value?.text ||
    (icon?.value?.src &&
      (!!link?.value?.href || !!link?.value?.url) &&
      link?.value?.href !== 'http://')
  );
};

export type ButtonComponentProps = ComponentProps & ButtonFields;
const ButtonBase = (
  props: ButtonFields['params'] &
    ButtonFields['fields'] & { variant?: EnumValues<typeof ButtonVariants> } & {
      className?: string;
    }
): JSX.Element | null => {
  const {
    buttonLink,
    icon,
    variant,
    size,
    iconPosition = 'trailing',
    iconClassName,
    isAriaHidden = true,
    className = '',
    isPageEditing,
  } = props || {};
  const ariaHidden = typeof isAriaHidden === 'boolean' ? isAriaHidden : true;
  const iconName = icon?.value as EnumValues<typeof IconName>;
  if (!isPageEditing && !linkIsValid(buttonLink)) return null;

  return (
    <Button asChild variant={variant} size={size} className={className}>
      {isPageEditing ? (
        <Link field={buttonLink} editable={true} />
      ) : (
        <Link field={buttonLink} editable={isPageEditing}>
          {iconPosition === IconPosition.LEADING && icon ? (
            <Icon
              iconName={iconName ? iconName : IconName.ARROW_LEFT}
              className={iconClassName}
              isAriaHidden={ariaHidden}
            />
          ) : null}
          {buttonLink?.value?.text}
          {iconPosition !== IconPosition.LEADING && icon ? (
            <Icon
              iconName={iconName ? iconName : IconName.ARROW_LEFT}
              className={iconClassName}
              isAriaHidden={ariaHidden}
            />
          ) : null}
        </Link>
      )}
    </Button>
  );
};

const EditableButton = (props: {
  buttonLink: LinkField;
  icon?: ImageField;
  iconClassName?: string;
  iconPosition?: EnumValues<typeof IconPosition>;
  isAriaHidden?: boolean;
  variant?: EnumValues<typeof ButtonVariants>;
  className?: string;
  isPageEditing?: boolean;
  size?: EnumValues<typeof ButtonSize>;
  //if asIconLink is set the text will not show up in the link but as an aria label
  asIconLink?: boolean;
  [key: string]: any;
}): JSX.Element | null => {
  const {
    buttonLink,
    icon,
    variant,
    size,
    iconPosition = 'trailing',
    iconClassName = 'h-6 w-6 object-contain',
    isAriaHidden = true,
    className,
    isPageEditing = false,
    asIconLink = false,
  } = props || {};
  const ariaHidden = typeof isAriaHidden === 'boolean' ? isAriaHidden : true;
  if (!isPageEditing && !isValidEditableLink(buttonLink, icon)) return null;

  return (
    <Button asChild variant={variant} size={size} className={className}>
      {isPageEditing ? (
        <span className="flex">
          {iconPosition === IconPosition.LEADING ? (
            <ImageWrapper className={iconClassName} image={icon} aria-hidden={ariaHidden} />
          ) : null}
          <Link field={buttonLink} editable={isPageEditing} />
          {iconPosition !== IconPosition.LEADING ? (
            <ImageWrapper className={iconClassName} image={icon} aria-hidden={ariaHidden} />
          ) : null}
        </span>
      ) : (
        <Link
          className={className}
          field={buttonLink}
          editable={isPageEditing}
          aria-label={asIconLink ? buttonLink?.value?.text : undefined}
        >
          {iconPosition === IconPosition.LEADING && icon?.value?.src ? (
            <ImageWrapper className={iconClassName} image={icon} aria-hidden={ariaHidden} />
          ) : null}
          {!asIconLink && buttonLink?.value?.text}
          {iconPosition !== IconPosition.LEADING && icon?.value?.src ? (
            <ImageWrapper className={iconClassName} image={icon} aria-hidden={ariaHidden} />
          ) : null}
        </Link>
      )}
    </Button>
  );
};

const Default = (props: ButtonComponentProps): JSX.Element | null => {
  const { fields, params } = props;
  const { buttonLink, icon, isAriaHidden = true } = fields || {};
  const { size, iconPosition = 'trailing', iconClassName, isPageEditing } = params || {};
  const { variant } = props || ButtonVariants.DEFAULT;
  const ariaHidden = typeof isAriaHidden === 'boolean' ? isAriaHidden : true;
  const iconName = icon?.value as EnumValues<typeof IconName>;
  if (!isPageEditing && !linkIsValid(buttonLink)) return null;

  const buttonIcon: EnumValues<typeof IconName> =
    (buttonLink?.value?.linktype as EnumValues<typeof IconName>) ||
    iconName ||
    (iconPosition === IconPosition.LEADING ? IconName.ARROW_LEFT : IconName.ARROW_RIGHT);
  if (fields) {
    return (
      <Button asChild variant={variant} size={size}>
        {isPageEditing ? (
          <Link field={buttonLink} editable={true} />
        ) : (
          <Link editable={isPageEditing} field={buttonLink}>
            {iconPosition === IconPosition.LEADING && (
              <Icon iconName={buttonIcon} className={iconClassName} isAriaHidden={ariaHidden} />
            )}
            {buttonLink?.value?.text}
            {iconPosition !== IconPosition.LEADING && (
              <Icon iconName={buttonIcon} className={iconClassName} isAriaHidden={ariaHidden} />
            )}
          </Link>
        )}
      </Button>
    );
  }

  return <NoDataFallback componentName="Button" />;
};

const Primary = (props: ButtonComponentProps): JSX.Element | null => {
  return <Default {...props} variant={ButtonVariants.PRIMARY} />;
};

const Destructive = (props: ButtonComponentProps): JSX.Element | null => {
  return <Default {...props} variant={ButtonVariants.DESTRUCTIVE} />;
};

const Ghost = (props: ButtonComponentProps): JSX.Element | null => {
  return <Default {...props} variant={ButtonVariants.GHOST} />;
};

const LinkButton = (props: ButtonComponentProps): JSX.Element | null => {
  return <Default {...props} variant={ButtonVariants.LINK} />;
};

const Outline = (props: ButtonComponentProps): JSX.Element | null => {
  return <Default {...props} variant={ButtonVariants.OUTLINE} />;
};

const Secondary = (props: ButtonComponentProps): JSX.Element | null => {
  return <Default {...props} variant={ButtonVariants.SECONDARY} />;
};

const Tertiary = (props: ButtonComponentProps): JSX.Element | null => {
  return <Default {...props} variant={ButtonVariants.TERTIARY} />;
};

export {
  Default,
  ButtonBase,
  EditableButton,
  Primary,
  Destructive,
  Ghost,
  LinkButton,
  Outline,
  Secondary,
  Tertiary,
};
