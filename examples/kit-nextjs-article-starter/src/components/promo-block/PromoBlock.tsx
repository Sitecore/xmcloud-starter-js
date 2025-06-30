import { Link, RichText, Text } from '@sitecore-content-sdk/nextjs';
import { Orientation } from '@/enumerations/Orientation.enum';
import { Variation } from '@/enumerations/Variation.enum';
import { ButtonType } from '@/enumerations/ButtonStyle.enum';
import { Flex } from '@/components/flex/Flex.dev';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { PromoBlockProps, PromoBlockVariationClassesProps } from './promo-block.props';
import { type JSX } from 'react';

const PromoBlock = (props: PromoBlockProps): JSX.Element => {
  const { fields, params } = props;

  const { heading, description, image, link } = fields ?? {};
  const orientation = params?.orientation ?? Orientation.IMAGE_LEFT;
  const variation = params?.variation ?? Variation.DEFAULT;

  const defaultClassesVariation: PromoBlockVariationClassesProps = {
    container: cn('row-start-1', {
      ['col-start-1 col-end-1 @2xl:col-start-7 sm:col-end-13']:
        orientation === Orientation.IMAGE_RIGHT,
      ['col-start-1 col-end-1 sm:col-start-1 sm:col-end-13 sm:@2xl:col-end-7']:
        orientation === Orientation.IMAGE_LEFT,
    }),
    image: 'aspect-video h-full w-full object-cover sm:aspect-[4/3]',
    copy: cn('px-4 pb-6 sm:px-0 sm:pb-0', {
      ['col-start-1 col-end-1 sm:col-end-13 sm:@2xl:col-end-7']:
        orientation === Orientation.IMAGE_RIGHT,
      ['col-start-1 col-end-1 sm:col-end-13 sm:@2xl:col-start-7']:
        orientation === Orientation.IMAGE_LEFT,
    }),
    row: { initial: '1' },
  };

  const variationTwoClassesVariation: PromoBlockVariationClassesProps = {
    container: cn('row-[1_/_4] z-1', {
      ['col-start-1 col-end-1 sm:col-end-13 sm:@2xl:col-start-7']:
        orientation === Orientation.IMAGE_RIGHT,
      ['col-start-1 col-end-1 sm:col-end-13 sm:@2xl:col-end-7']:
        orientation === Orientation.IMAGE_LEFT,
    }),
    image: 'aspect-video h-full w-full object-cover sm:aspect-[1920/1080]',
    copy: cn('relative p-6 bg-white z-2 row-[2_/_4]', {
      ['col-start-1 col-end-1 sm:col-end-13 sm:@2xl:col-end-9 text-right']:
        orientation === Orientation.IMAGE_RIGHT,
      ['col-start-1 col-end-1 sm:col-end-13 sm:@2xl:col-start-5']:
        orientation === Orientation.IMAGE_LEFT,
    }),
    row: { initial: '3' },
  };

  const variantChoice =
    variation !== Variation.DEFAULT ? variationTwoClassesVariation : defaultClassesVariation;
  if (fields) {
    return (
      <div
        className={cn('component promo-block grid  columns-1 gap-6 align-middle sm:columns-12', [
          `row-span-${variantChoice.row}`,
        ])}
      >
        <Flex direction="column" justify="center" gap="4" className={variantChoice.copy}>
          <h3>
            <Text field={heading} />
          </h3>
          <RichText field={description} />
          <Flex
            gap="2"
            className={cn({
              'justify-end':
                orientation === Orientation.IMAGE_RIGHT && variation === Variation.VERSION_TWO,
            })}
          >
            {link && (
              <Button asChild>
                <Link field={link} />
              </Button>
            )}
          </Flex>
        </Flex>
        <div className={variantChoice.container}>
          <ImageWrapper image={image} className={variantChoice.image} />
        </div>
      </div>
    );
  }
  return <NoDataFallback componentName="Promo Block" />;
};

const TextLink = (props: PromoBlockProps): JSX.Element => {
  props.params.variation = Variation.VERSION_TWO;
  props.params.buttonType = ButtonType.OUTLINE;
  return <PromoBlock {...props} />;
};

const ButtonLink = (props: PromoBlockProps): JSX.Element => {
  return <PromoBlock {...props} />;
};

const Default = ButtonLink;

export { Default, ButtonLink, TextLink };
