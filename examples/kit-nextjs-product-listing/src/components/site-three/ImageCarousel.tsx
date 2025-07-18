'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Image as ContentSdkImage } from '@sitecore-content-sdk/nextjs';
import { IGQLImageField } from 'types/igql';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Fields {
  data: {
    datasource: {
      imageItems: {
        results: ImageCarouselItem[];
      };
    };
  };
}

export interface ImageCarouselItem {
  id: string;
  image: IGQLImageField;
}

type ImageCarouselProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: ImageCarouselProps) => {
  const images = props.fields.data.datasource.imageItems.results;

  const [mainRef, mainApi] = useEmblaCarousel({ loop: false });
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!mainApi || !thumbApi) return;

    const updateButtons = () => {
      setSelectedIndex(mainApi.selectedScrollSnap());
      setCanScrollPrev(mainApi.canScrollPrev());
      setCanScrollNext(mainApi.canScrollNext());
      thumbApi.scrollTo(mainApi.selectedScrollSnap());
    };

    mainApi.on('select', updateButtons);
    updateButtons();

    return () => {
      mainApi?.off('select', updateButtons);
    };
  }, [mainApi, thumbApi]);

  const scrollTo = (index: number) => {
    if (!mainApi || !thumbApi) return;
    mainApi.scrollTo(index);
    thumbApi.scrollTo(index);
  };

  const carouselButtonStyles = `flex justify-center items-center absolute top-1/2 -translate-y-1/2 h-8 w-8 lg:h-10 lg:w-10 bg-primary hover:bg-primary-hover cursor-pointer disabled:pointer-events-none disabled:opacity-50`;

  return (
    <section
      className={`relative bg-cover ${props.params.styles}`}
      style={{
        backgroundImage: `linear-gradient(136deg, #ffffff14 2.61%, #ffffff26 73.95%), url(${images[0]?.image?.jsonValue?.value?.src})`,
      }}
      data-class-change
    >
      <div className="backdrop-blur-md backdrop-grayscale backdrop-brightness-30">
        <div className="container mx-auto px-4 pt-8 lg:pt-16 lg:pb-8 flex flex-col gap-4">
          <div className="relative">
            <div className="overflow-hidden" ref={mainRef}>
              <div className="flex touch-pan-y">
                {images.map((item) => (
                  <div key={item.id} className="w-full relative aspect-2/1 flex-shrink-0">
                    <ContentSdkImage
                      field={item.image.jsonValue}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => mainApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className={`-left-4 lg:-left-5 ${carouselButtonStyles}`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => mainApi?.scrollNext()}
              disabled={!canScrollNext}
              className={`-right-4 lg:-right-5 ${carouselButtonStyles}`}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div
            className="overflow-hidden w-full max-w-4xl px-4 mx-auto -translate-y-8"
            ref={thumbRef}
          >
            <div className="flex gap-2">
              {images.map((item, index) => (
                <div
                  key={item.id}
                  className={`w-[calc((100%-0.5rem*3)/3)] lg:w-[calc((100%-0.5rem*3)/4)] flex-shrink-0 cursor-pointer overflow-hidden border transition-all mt-6 ${
                    selectedIndex === index ? 'border-primary -translate-y-6' : 'border-transparent'
                  }`}
                  onClick={() => scrollTo(index)}
                >
                  <ContentSdkImage
                    field={item.image.jsonValue}
                    className="w-full h-full aspect-2/1 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
