'use client';

import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { useEffect, useMemo, useState, type JSX } from 'react';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from 'shadcd/components/ui/carousel';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ProductSectionProps } from './products-section.props';
import { getDatasource, getFieldValue } from '@/lib/component-props';

function useSlidesToScroll() {
  const [slidesToScroll, setSlidesToScroll] = useState(1);

  useEffect(() => {
    const getSlidesToScroll = () => {
      if (window.innerWidth < 640) {
        setSlidesToScroll(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToScroll(2);
      } else {
        setSlidesToScroll(4);
      }
    };

    getSlidesToScroll();

    window.addEventListener('resize', getSlidesToScroll);
    return () => window.removeEventListener('resize', getSlidesToScroll);
  }, []);

  return slidesToScroll;
}

export const Default = (props: ProductSectionProps): JSX.Element => {
  const datasource = useMemo(() => getDatasource(props.fields), [props.fields]);
  const id = props.params.RenderingIdentifier;

  const slidesToScroll = useSlidesToScroll();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };

    carouselApi.on('select', onSelect);
    onSelect();

    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi]);

  const productItems = useMemo(() => datasource?.children?.results ?? [], [datasource?.children?.results]);
  const sectionLinkField = useMemo(() => getFieldValue(datasource?.link), [datasource?.link]);
  const start = useMemo(() => currentSlide * slidesToScroll + 1, [currentSlide, slidesToScroll]);

  const end = useMemo(
    () => Math.min(start + slidesToScroll - 1, productItems.length),
    [productItems.length, slidesToScroll, start]
  );

  const paddedItems = useMemo(() => {
    const remainder = productItems.length % slidesToScroll;

    if (remainder === 0) {
      return productItems;
    }

    const paddingNeeded = slidesToScroll - remainder;

    const paddedItems = [...productItems, ...Array(paddingNeeded).fill(null)];
    return paddedItems;
  }, [productItems, slidesToScroll]);

  if (!datasource) {
    return <></>;
  }

  return (
    <section className={`py-24 ${props.params.styles}`} id={id ? id : undefined} data-class-change>
      <div className="container px-4 mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-medium mb-4">
            <ContentSdkText field={getFieldValue(datasource.heading)} />
          </h2>
          <div className="flex gap-8">
            <p className="text-base">
              Showing {start} through {end} of {productItems.length} items
            </p>
            {sectionLinkField && (
              <ContentSdkLink
                field={sectionLinkField}
                className="flex items-center gap-2 text-base text-primary font-medium"
                prefetch={false}
              >
                {sectionLinkField?.value?.text}
                <FontAwesomeIcon icon={faChevronRight} width={16} height={16} />
              </ContentSdkLink>
            )}
          </div>
        </div>
        <Carousel
          setApi={setCarouselApi}
          opts={{
            align: 'start',
            slidesToScroll: slidesToScroll,
          }}
          className="container relative px-12 mx-auto"
        >
          <CarouselContent className="py-4 -ml-0">
            {paddedItems.map((product, index) => (
              <CarouselItem
                key={product?.id || index}
                className="pl-2 pr-2 md:basis-1/2 lg:basis-1/4"
              >
                {!!product ? (
                  <div className="flex flex-col items-start justify-end h-full shadow-md pointer">
                    <ContentSdkImage
                      field={getFieldValue(product.productImage)}
                      className="w-full h-auto object-cover"
                    />
                    <div className="flex-1 relative pt-4 px-6">
                      <div className="inline-block text-base font-bold px-2 py-1 mb-2 bg-[#ffb900]">
                        <ContentSdkText field={getFieldValue(product.productTagLine)} />
                      </div>
                      <h3 className="mb-2 text-base font-bold text-primary underline">
                        <ContentSdkLink field={getFieldValue(product.productLink)} prefetch={false} />
                      </h3>
                      <div className="text-base mb-4">
                        <span>From</span>{' '}
                        <span
                          className={`${
                            getFieldValue(product.productDiscountedPrice)?.value
                              ? 'opacity-70 line-through'
                              : 'font-bold'
                          }`}
                        >
                          <ContentSdkText field={getFieldValue(product.productPrice)} />
                        </span>{' '}
                        <span className="font-bold">
                          <ContentSdkText field={getFieldValue(product.productDiscountedPrice)} />
                        </span>
                      </div>
                      <p className="text-base mb-4">
                        <ContentSdkText field={getFieldValue(product.productDescription)} />
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="opacity-0"></div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 border-transparent bg-transparent shadow-none" />
          <CarouselNext className="right-0 border-transparent bg-transparent shadow-none" />
        </Carousel>
      </div>
    </section>
  );
};
