import { ButtonBase } from '@/components/button-component/ButtonComponent';
import { TopicItemProps } from './topic-listing.props';
import { ButtonVariants } from '@/enumerations/ButtonStyle.enum';
import { useSitecore, LinkField } from '@sitecore-content-sdk/nextjs';

export const TopicItem: React.FC<TopicItemProps> = ({ link }) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;

  // Create an empty link for editing mode
  const emptyLink: LinkField = { value: { href: '#', text: 'Add link' } };

  // In editing mode, we render regardless of link value
  if (isPageEditing) {
    return (
      <ButtonBase
        buttonLink={link?.jsonValue ?? emptyLink}
        variant={ButtonVariants.TOPIC}
        isPageEditing={true}
      />
    );
  }

  // In normal viewing mode, only render if we have valid link data
  if (!link?.jsonValue?.value?.href) {
    return null;
  }

  return (
    <ButtonBase buttonLink={link.jsonValue} variant={ButtonVariants.TOPIC} isPageEditing={false} />
  );
};
