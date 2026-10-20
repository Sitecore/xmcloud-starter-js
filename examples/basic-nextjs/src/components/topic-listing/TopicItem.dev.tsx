import { Link } from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from 'lucide-react';
import { TopicItemProps } from './topic-listing.props';
import { getFieldValue } from '@/lib/component-props';

/** One topic as a full-width link row with a trailing arrow; the icon field is optional. */
export const TopicItem: React.FC<TopicItemProps> = ({ link }) => {
  const linkField = getFieldValue(link);

  if (!linkField?.value?.href) return null;

  return (
    <Link
      field={linkField}
      className="group flex items-center justify-between gap-6 border-t border-white/35 py-6 text-xl font-light text-white"
    >
      <span className="group-hover:underline">{linkField.value.text}</span>
      <ArrowRight className="size-6 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  );
};
