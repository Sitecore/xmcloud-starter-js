import { IconProps } from '@/components/icon/Icon';
import { IconName } from '@/enumerations/Icon.enum';

// Mock icon props for different icon types
export const mockFacebookIconProps: IconProps = {
  iconName: IconName.FACEBOOK,
  className: 'icon-facebook',
  isAriaHidden: true,
};

export const mockInstagramIconProps: IconProps = {
  iconName: IconName.INSTAGRAM,
  className: 'icon-instagram',
  isAriaHidden: false,
  altText: 'Instagram Icon',
};

export const mockYoutubeIconProps: IconProps = {
  iconName: IconName.YOUTUBE,
  className: 'icon-youtube',
};

export const mockTwitterIconProps: IconProps = {
  iconName: IconName.TWITTER,
  className: 'icon-twitter',
};

export const mockLinkedInIconProps: IconProps = {
  iconName: IconName.LINKEDIN,
  className: 'icon-linkedin',
};

export const mockEmailIconProps: IconProps = {
  iconName: IconName.EMAIL,
  className: 'icon-email',
};

export const mockInternalIconProps: IconProps = {
  iconName: IconName.INTERNAL,
  className: 'icon-internal',
};

export const mockExternalIconProps: IconProps = {
  iconName: IconName.EXTERNAL,
  className: 'icon-external',
};

export const mockFileIconProps: IconProps = {
  iconName: IconName.FILE,
  className: 'icon-file',
};

export const mockMediaIconProps: IconProps = {
  iconName: IconName.MEDIA,
  className: 'icon-media',
};

export const mockArrowLeftIconProps: IconProps = {
  iconName: IconName.ARROW_LEFT,
  className: 'icon-arrow-left',
};

export const mockArrowRightIconProps: IconProps = {
  iconName: IconName.ARROW_RIGHT,
  className: 'icon-arrow-right',
};

export const mockPlayIconProps: IconProps = {
  iconName: IconName.PLAY,
  className: 'icon-play',
};

export const mockArrowUpRightIconProps: IconProps = {
  iconName: IconName.ARROW_UP_RIGHT,
  className: 'icon-arrow-up-right',
};

export const mockDiversityIconProps: IconProps = {
  iconName: IconName.DIVERSITY,
  className: 'icon-diversity',
};

export const mockCommunitiesIconProps: IconProps = {
  iconName: IconName.COMMUNITIES,
  className: 'icon-communities',
};

export const mockCrossArrowsIconProps: IconProps = {
  iconName: IconName.CROSS_ARROWS,
  className: 'icon-cross-arrows',
};

export const mockSignalIconProps: IconProps = {
  iconName: IconName.SIGNAL,
  className: 'icon-signal',
};

export const mockIconWithAltText: IconProps = {
  iconName: IconName.FACEBOOK,
  isAriaHidden: false,
  altText: 'Follow us on Facebook',
};

export const mockIconWithoutClassName: IconProps = {
  iconName: IconName.TWITTER,
  isAriaHidden: true,
};

// IconProps extends React.HTMLAttributes<SVGElement>, so data attributes are allowed
export const mockIconWithCustomAttributes: IconProps = {
  iconName: IconName.EMAIL,
  className: 'custom-icon-class',
  isAriaHidden: false,
  altText: 'Email us',
  'data-custom': 'custom-value',
} as IconProps;

