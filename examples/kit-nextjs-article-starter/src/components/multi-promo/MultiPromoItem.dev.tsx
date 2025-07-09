import { Link, Text } from '@sitecore-content-sdk/nextjs';
import { Button } from '@/components/ui/button';
import { MultiPromoItemProps } from '@/components/multi-promo/multi-promo.props';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
const mapToItemProps = (fields: MultiPromoItemProps) => {
  return {
    title: fields.heading.jsonValue,
    image: fields.image.jsonValue,
    link: fields.link?.jsonValue,
    isPageEditing: fields.isPageEditing,
  };
};

export const Default: React.FC<MultiPromoItemProps> = (props) => {
  const itemProps = mapToItemProps(props);
  const { title, image, link, isPageEditing } = itemProps;

  return (
    <>
      {(isPageEditing || image?.value?.src) && (
        <ImageWrapper
          image={image}
          className="aspect-[131/121] w-full rounded-3xl object-cover"
          wrapperClass="aspect-[131/121] w-full mb-7"
        />
      )}
      {(isPageEditing || title.value) && (
        <Text
          tag="h3"
          field={title}
          className="font-heading text-box-trim-both text-box-edge-asc-desc text-2xl font-medium leading-snug tracking-tighter"
        />
      )}
      {(isPageEditing || link?.value?.href) && (
        <Button
          variant="link"
          asChild
          className="text-box-trim-both text-box-edge-asc-desc mt-4 h-auto text-pretty px-0 pt-0 text-[0.875rem] font-normal last:pb-0"
        >
          <Link field={link || {}}></Link>
        </Button>
      )}
    </>
  );
};
