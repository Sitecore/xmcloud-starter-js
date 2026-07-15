import { ButtonBase } from '@/components/button-component/ButtonComponent';
import { TopicItemProps } from './topic-listing.props';
import { ButtonVariants } from '@/enumerations/ButtonStyle.enum';
import { getFieldValue } from '@/lib/component-props';
import type { LinkField } from '@sitecore-content-sdk/nextjs';

export const TopicItem: React.FC<TopicItemProps> = ({ link, isPageEditing = false }) => {
  const linkField = getFieldValue(link);

  // Create an empty link for editing mode
  const emptyLink: LinkField = { value: { href: '#', text: 'Add link' } };

  // In editing mode, we render regardless of link value
  if (isPageEditing) {
    return (
      <ButtonBase
        buttonLink={linkField ?? emptyLink}
        variant={ButtonVariants.TOPIC}
        isPageEditing={true}
      />
    );
  }

  // In normal viewing mode, only render if we have valid link data
  if (!linkField?.value?.href) {
    return null;
  }

  return (
    <ButtonBase buttonLink={linkField} variant={ButtonVariants.TOPIC} isPageEditing={false} />
  );
};
