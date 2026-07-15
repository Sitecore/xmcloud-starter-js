import { Link, Text } from '@sitecore-content-sdk/nextjs';
import { Button } from '@/components/ui/button';
import { MultiPromoItemProps } from '@/components/multi-promo/multi-promo.props';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { getFieldValue } from '@/lib/component-props';

const mapToItemProps = (fields: MultiPromoItemProps) => {
  return {
    title: getFieldValue(fields?.heading),
    image: getFieldValue(fields?.image),
    link: getFieldValue(fields?.link),
  };
};

export const Default: React.FC<MultiPromoItemProps> = (props) => {
  const itemProps = mapToItemProps(props || {});
  const { title, image, link } = itemProps || {};
  const { page } = props;

  return (
    <article className="multi-promo-item">
      {image && (
        <figure className="mb-7">
          <ImageWrapper
            image={image}
            className="aspect-[131/121] w-full rounded-3xl object-cover"
            wrapperClass="aspect-[131/121] w-full"
            page={page}
          />
        </figure>
      )}
      {title && (
        <Text
          tag="h3"
          field={title}
          className="font-heading text-box-trim-both text-2xl font-medium leading-snug tracking-tighter antialiased"
        />
      )}
      {link && (
        <Button
          variant="link"
          asChild
          className="text-box-trim-both mt-4 h-auto text-pretty px-0 pt-0 text-[0.875rem] font-normal last:pb-0"
        >
          <Link field={link}></Link>
        </Button>
      )}
    </article>
  );
};
