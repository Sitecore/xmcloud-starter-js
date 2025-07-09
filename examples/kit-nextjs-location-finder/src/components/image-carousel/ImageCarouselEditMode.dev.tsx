'use client';

import { Text } from '@sitecore-content-sdk/nextjs';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import type { ImageCarouselProps } from './image-carousel.props';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { EditableButton } from '@/components/button-component/ButtonComponent';
import { cn } from '@/lib/utils';
export const ImageCarouselEditMode = (
  props: ImageCarouselProps & { componentName: string; showBackgroundText?: boolean }
) => {
  const { fields, isPageEditing, componentName, showBackgroundText = true } = props;
  const { title, imageItems } = fields.data.datasource;
  const { results: slides } = imageItems;
  const containerClasses =
    '@container bg-primary group text-primary-foreground relative flex w-full flex-col items-center justify-center py-[99px]';

  if (fields) {
    return (
      <div
        className={cn(containerClasses, { [props?.params?.styles]: props?.params?.styles })}
        data-component="ImageCarouselEditMode"
        data-class-change
      >
        <div className="mb-8 w-full space-y-4 text-center">
          <Text
            tag="h2"
            field={title.jsonValue}
            className="font-heading @md:text-5xl mx-auto max-w-[760px] text-pretty text-3xl font-light leading-none tracking-normal antialiased group-[.position-center]:text-center group-[.position-right]:text-right"
          />
        </div>
        <div className="mx-auto max-w-screen-xl space-y-6">
          <h3 className="border-primary-foreground/20 border-b pb-2 text-xl font-medium">
            Carousel Items:
          </h3>

          {slides.map((slide, index) => (
            <div key={index} className="overflow-hidden border-0 bg-transparent">
              <div className="p-0">
                <div className="flex flex-col items-stretch gap-4 p-4 md:flex-row">
                  {/* Image on the left */}
                  <div className="flex-shrink-0 md:w-1/3">
                    <ImageWrapper
                      image={slide.image?.jsonValue}
                      className="relative z-0 h-auto w-full overflow-hidden rounded-md"
                    />
                  </div>

                  {/* Background text in the middle */}
                  {showBackgroundText && (
                    <div className="flex flex-col items-center justify-center md:w-1/3">
                      <div className="text-center">
                        <p className="text-primary-foreground/60 mb-2 text-sm">Background Text:</p>
                        <Text
                          tag="p"
                          field={slide?.backgroundText?.jsonValue}
                          className="bg-light-gradient text-fill-transparent bg-clip-text text-9xl font-bold leading-none text-transparent"
                        />
                      </div>
                    </div>
                  )}
                  {/* Link button on the right */}
                  <div className="flex flex-col items-center justify-center md:w-1/3">
                    <div className="text-center">
                      <p className="text-primary-foreground/60 mb-2 text-sm">Link:</p>
                      {slide?.link?.jsonValue && (
                        <EditableButton
                          variant="secondary"
                          buttonLink={slide.link.jsonValue}
                          isPageEditing={isPageEditing}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return <NoDataFallback componentName={componentName} />;
};
