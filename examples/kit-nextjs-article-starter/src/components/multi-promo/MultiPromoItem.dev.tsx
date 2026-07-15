import { Link, Text } from '@sitecore-content-sdk/nextjs';
import { Button } from '@/components/ui/button';
import { MultiPromoItemProps } from '@/components/multi-promo/multi-promo.props';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { getFieldValue } from '@/lib/component-props';
import { getDescriptiveLinkText } from '@/utils/link-text';
const mapToItemProps = (fields: MultiPromoItemProps) => {
  return {
    title: getFieldValue(fields?.heading),
    image: getFieldValue(fields?.image),
    link: getFieldValue(fields?.link),
    isPageEditing: fields?.isPageEditing,
  };
};

export const Default: React.FC<MultiPromoItemProps> = (props) => {
  const itemProps = mapToItemProps(props || {});
  const { title, image, link, isPageEditing } = itemProps || {};

  return (
    <>
      {(isPageEditing || image?.value?.src) && (
        <ImageWrapper
          image={image}
          className="aspect-[131/121] w-full rounded-3xl object-cover"
          wrapperClass="aspect-[131/121] w-full mb-7"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 400px"
        />
      )}
      {(isPageEditing || title?.value) && (
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
          <Link
            field={
              // Enhance link with descriptive text for SEO
              !isPageEditing && link?.value?.text
                ? {
                    ...link,
                    value: {
                      ...link.value,
                      text: getDescriptiveLinkText(link, title?.value),
                    },
                  }
                : link || {}
            }
          ></Link>
        </Button>
      )}
    </>
  );
};
