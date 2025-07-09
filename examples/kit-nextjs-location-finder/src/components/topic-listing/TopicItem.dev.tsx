import { ButtonBase } from '@/components/button-component/ButtonComponent';
import { TopicItemProps } from './topic-listing.props';
import { ButtonVariants } from '@/enumerations/ButtonStyle.enum';
import { IconPosition } from '@/enumerations/IconPosition.enum';

export const TopicItem: React.FC<TopicItemProps> = ({ link, icon }) => {
  if (!link?.jsonValue) return null;

  return (
    <ButtonBase
      buttonLink={link.jsonValue}
      icon={{ value: icon?.jsonValue.value }}
      variant={ButtonVariants.TOPIC}
      iconPosition={IconPosition.LEADING}
      iconClassName="h-4 w-4 shrink-0"
    />
  );
};
