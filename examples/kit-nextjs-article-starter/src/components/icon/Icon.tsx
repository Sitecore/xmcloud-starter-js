import { useEffect, useState } from 'react';
import { IconName } from '@/enumerations/Icon.enum';
import { EnumValues } from '@/enumerations/generic.enum';

export type SvgProps = React.HTMLAttributes<SVGElement> & {
  className?: string;
  isAriaHidden?: boolean;
  altText?: string;
};

export type IconProps = SvgProps & {
  // iconName: typeof IconName ;
  iconName: EnumValues<typeof IconName>;
};

/**
 * Shared default props between SVG icons
 */
export const defaultSvgProps = {};

export const sharedAttributes = (props: SvgProps): Record<string, unknown> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isAriaHidden = true, altText, ...rest } = props;

  // attributes where a blank value would not affect user experience can be defined here as default
  const attributes: Record<string, unknown> = {
    ...rest,
  };

  // attributes where a blank value would affect user experience should be conditional (e.g. aria-label="" means something!)
  if (isAriaHidden) attributes['aria-hidden'] = isAriaHidden;
  if (altText) attributes['aria-label'] = altText;

  return attributes;
};

//map enums to filenames
const iconMap: { [key: string]: string } = {
  [IconName.FACEBOOK]: 'FacebookIcon',
  [IconName.INSTAGRAM]: 'InstagramIcon',
  [IconName.YOUTUBE]: 'YoutubeIcon',
  [IconName.TWITTER]: 'TwitterIcon',
  [IconName.LINKEDIN]: 'LinkedInIcon',
  [IconName.EMAIL]: 'EmailIcon',
  [IconName.INTERNAL]: 'InternalIcon',
  [IconName.EXTERNAL]: 'ExternalIcon',
  [IconName.FILE]: 'FileIcon',
  [IconName.MEDIA]: 'FileIcon',
  [IconName.ARROW_LEFT]: 'arrow-left',
  [IconName.ARROW_RIGHT]: 'arrow-right',
  [IconName.PLAY]: 'play',
  [IconName.ARROW_UP_RIGHT]: 'arrow-up-right',
  [IconName.DIVERSITY]: 'diversity',
  [IconName.COMMUNITIES]: 'communities',
  [IconName.CROSS_ARROWS]: 'cross-arrows',
  [IconName.SIGNAL]: 'signal',
};

const loadIcon = async (path: string) => {
  const m = await import(`./svg/${path}.dev.tsx`);
  return m.default;
};

export const Default: React.FC<IconProps> = (props) => {
  const { iconName, isAriaHidden = true, ...rest } = props;
  const [IconType, setIconType] = useState<React.ComponentType<SvgProps> | null>(null);

  useEffect(() => {
    const iconType = iconMap[iconName];
    if (iconType) {
      loadIcon(iconType).then((icon) => setIconType(() => icon));
    }
  }, [iconName]);
  if (!IconType) return null;
  return <IconType {...rest} isAriaHidden={isAriaHidden} />;
};
