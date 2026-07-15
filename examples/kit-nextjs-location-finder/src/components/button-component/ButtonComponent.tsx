/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type JSX } from 'react';
import { Default as Icon } from '@/components/icon/Icon';
import { IconName } from '@/enumerations/Icon.enum';
import {
  Link,
  LinkField,
  ComponentRendering,
  Page,
} from '@sitecore-content-sdk/nextjs';
import { CompatibleLink } from '@/components/content-sdk/CompatibleLink';
import { Button } from '@/components/ui/button';
import { EnumValues } from '@/enumerations/generic.enum';
import { IconPosition } from '@/enumerations/IconPosition.enum';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { ImageField } from '@sitecore-content-sdk/nextjs';
import { ButtonVariants, ButtonSize } from '@/enumerations/ButtonStyle.enum';
import type { ButtonBaseProps, ButtonComponentProps } from './button-component.props';

export type { ButtonComponentProps, ButtonFields, ButtonBaseProps } from './button-component.props';
import { isValidEditableLink, linkIsValid } from './button-component.props';

const ButtonBase = (props: ButtonBaseProps): JSX.Element | null => {
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
        <CompatibleLink field={buttonLink} editable={true} />
      ) : (
        buttonLink?.value?.href && (
          <CompatibleLink field={buttonLink} editable={false} prefetch={false}>
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
          </CompatibleLink>
        )
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
  page?: Page;
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
    page,
  } = props || {};
  const ariaHidden = typeof isAriaHidden === 'boolean' ? isAriaHidden : true;
  if (!isPageEditing && !isValidEditableLink(buttonLink, icon)) return null;

  return (
    <Button asChild variant={variant} size={size} className={className}>
      {isPageEditing ? (
        <span className="flex">
          {iconPosition === IconPosition.LEADING ? (
            <ImageWrapper
              className={iconClassName}
              image={icon}
              aria-hidden={ariaHidden}
              page={page}
            />
          ) : null}
          <Link field={buttonLink} editable={isPageEditing} />
          {iconPosition !== IconPosition.LEADING ? (
            <ImageWrapper
              className={iconClassName}
              image={icon}
              aria-hidden={ariaHidden}
              page={page}
            />
          ) : null}
        </span>
      ) : (
        buttonLink?.value?.href && (
          <CompatibleLink
            field={buttonLink}
            editable={isPageEditing}
            className={className}
            aria-label={asIconLink ? buttonLink?.value?.text : undefined}
            prefetch={false}
          >
            {iconPosition === IconPosition.LEADING && icon?.value?.src ? (
              <ImageWrapper
                className={iconClassName}
                image={icon}
                aria-hidden={ariaHidden}
                page={page}
              />
            ) : null}
            {!asIconLink && buttonLink?.value?.text}
            {iconPosition !== IconPosition.LEADING && icon?.value?.src ? (
              <ImageWrapper
                className={iconClassName}
                image={icon}
                aria-hidden={ariaHidden}
                page={page}
              />
            ) : null}
          </CompatibleLink>
        )
      )}
    </Button>
  );
};

const Default = (props: ButtonComponentProps): JSX.Element | null => {
  const { fields, params, page } = props;
  const { buttonLink, icon, isAriaHidden = true } = fields || {};
  const {
    size,
    iconPosition = 'trailing',
    iconClassName,
    isPageEditing,
  } = params || {};
  const variant = props?.variant || ButtonVariants.DEFAULT;
  const ariaHidden = typeof isAriaHidden === 'boolean' ? isAriaHidden : true;
  const iconName = icon?.value as EnumValues<typeof IconName>;
  const isEditing = isPageEditing || page?.mode?.isEditing;
  if (!isEditing && !linkIsValid(buttonLink)) return null;

  // Only set a button icon if one is explicitly provided
  const buttonIcon: EnumValues<typeof IconName> | undefined =
    iconName ||
    (buttonLink?.value?.linktype as EnumValues<typeof IconName>) ||
    undefined;

  // Default icon size for buttons if not provided
  const iconClass = iconClassName || 'h-4 w-4';

  if (fields) {
    return (
      <Button asChild variant={variant} size={size}>
        {isEditing ? (
          <span className="inline-flex items-center gap-2">
            {iconPosition === IconPosition.LEADING && buttonIcon && (
              <Icon
                iconName={buttonIcon}
                className={iconClass}
                isAriaHidden={ariaHidden}
              />
            )}
            <CompatibleLink field={buttonLink} editable={true} />
            {iconPosition !== IconPosition.LEADING && buttonIcon && (
              <Icon
                iconName={buttonIcon}
                className={iconClass}
                isAriaHidden={ariaHidden}
              />
            )}
          </span>
        ) : (
          buttonLink?.value?.href && (
            <CompatibleLink field={buttonLink} editable={false} prefetch={false}>
              {iconPosition === IconPosition.LEADING && buttonIcon && (
                <Icon
                  iconName={buttonIcon}
                  className={iconClass}
                  isAriaHidden={ariaHidden}
                />
              )}
              {buttonLink?.value?.text}
              {iconPosition !== IconPosition.LEADING && buttonIcon && (
                <Icon
                  iconName={buttonIcon}
                  className={iconClass}
                  isAriaHidden={ariaHidden}
                />
              )}
            </CompatibleLink>
          )
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
