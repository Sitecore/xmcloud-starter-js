export const ButtonVariants = {
  PRIMARY: 'default',
  DEFAULT: 'default',
  DESTRUCTIVE: 'destructive',
  OUTLINE: 'outline',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
  GHOST: 'ghost',
  LINK: 'link',
  TOPIC: 'topic',
  ROUNDED_WHITE: 'rounded-white',
} as const;

export enum ButtonType {
  SOLID = 'solid',
  OUTLINE = 'outline',
}

export const ButtonSize = {
  DEFAULT: 'default',
  SM: 'sm',
  LG: 'lg',
  ICON: 'icon',
} as const;
