import { Link, Text } from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from 'lucide-react';
import { MultiPromoItemProps } from '@/components/multi-promo/multi-promo.props';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { getFieldValue } from '@/lib/component-props';
import { cn } from '@/lib/utils';

/** Brand gradients cycled across cards when no image is set. */
const CARD_GRADIENTS = [
  'bg-[linear-gradient(120deg,#0b2a5b_0%,#1d4f8f_60%,#2b6cb0_100%)]',
  'bg-[linear-gradient(120deg,#0b3b4f_0%,#14607a_60%,#1f8aa3_100%)]',
  'bg-[linear-gradient(120deg,#2a1b4f_0%,#4b2c7f_60%,#7a3fa0_100%)]',
  'bg-[linear-gradient(120deg,#1a2433_0%,#2f3e55_60%,#4a5f7d_100%)]',
];

export const Default: React.FC<MultiPromoItemProps & { index?: number }> = (props) => {
  const title = getFieldValue(props.heading);
  const description = getFieldValue(props.description);
  const image = getFieldValue(props.image);
  const link = getFieldValue(props.link);
  const hasImage = Boolean(image?.value?.src);
  const gradient = CARD_GRADIENTS[(props.index ?? 0) % CARD_GRADIENTS.length];

  return (
    <article
      className={cn(
        'relative isolate flex w-full flex-col justify-between overflow-hidden p-8 text-white shadow-[0_-8px_24px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:-translate-y-1',
        'min-h-[18rem]',
        !hasImage && gradient
      )}
    >
      {hasImage && (
        <>
          <ImageWrapper image={image} wrapperClass="absolute inset-0 -z-20" className="h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 to-black/20" aria-hidden="true" />
        </>
      )}
      <div>
        {title && (
          <Text tag="h3" field={title} className="mb-4 text-balance text-2xl font-light leading-snug" />
        )}
        {description?.value && (
          <Text tag="p" field={description} className="text-pretty text-base font-light leading-relaxed text-white/85" />
        )}
      </div>
      {link?.value?.href && (
        <Link
          field={link}
          className="mt-8 inline-flex items-center justify-between gap-4 border-t border-white/30 pt-4 text-base text-white hover:underline"
        >
          {link.value.text}
          <ArrowRight className="size-5 shrink-0" aria-hidden="true" />
        </Link>
      )}
    </article>
  );
};
