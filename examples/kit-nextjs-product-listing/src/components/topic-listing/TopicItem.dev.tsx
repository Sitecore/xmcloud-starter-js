import { ButtonBase } from '@/components/button-component/ButtonComponent';
import { TopicItemProps } from './topic-listing.props';
import { ButtonVariants } from '@/enumerations/ButtonStyle.enum';
import { IconPosition } from '@/enumerations/IconPosition.enum';
import { getFieldValue } from '@/lib/component-props';

export const TopicItem: React.FC<TopicItemProps> = ({ link, icon }) => {
  const linkField = getFieldValue(link);
  const iconField = getFieldValue(icon);
  const iconValue = iconField?.value;

  if (!linkField || !iconValue) return null;

  return (
    <ButtonBase
      buttonLink={linkField}
      icon={{ value: iconValue }}
      variant={ButtonVariants.TOPIC}
      iconPosition={IconPosition.LEADING}
      iconClassName="h-4 w-4 shrink-0"
    />
  );
};
