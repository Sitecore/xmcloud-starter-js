'use client';

import {
  Text as ContentSdkText,
  Link as ContentSdkLink,
  Field,
  LinkField,
} from '@sitecore-content-sdk/nextjs';
import { ChevronRight } from 'lucide-react';
import { useI18n } from 'next-localization';
import { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from 'shadcd/components/ui/carousel';
import { Enum } from 'types/enum';

interface ProductFields {
  ProductName: Field<string>;
  Description: Field<string>;
  Price: Field<string>;
  Images: ProductImage[];
  Colors: Enum[];
  WarrantyLink: LinkField;
  ShippingLink: LinkField;
}

interface ProductImage {
  id: string;
  url: string;
}

type ProductPageHeaderProps = {
  params: { [key: string]: string };
  fields: ProductFields;
};

const DICTIONARY_KEYS = {
  BUTTON_LABEL: 'Add_To_Cart',
};

export const Default = (props: ProductPageHeaderProps) => {
  const [selectedColor, setSelectedColor] = useState<Enum | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    if (!selectedColor && props.fields?.Colors?.length > 0) {
      setSelectedColor(props.fields?.Colors[0]);
    }
  }, [props.fields?.Colors, selectedColor]);

  // Fall back to an empty array until the field populates
  const images = props.fields?.Images ?? [];
  const productImages = images.length === 2 ? [...images, ...images] : images;

  return (
    <section
      className={`relative flex flex-col lg:justify-end lg:items-end lg:pt-12 lg:min-h-[50rem] overflow-hidden ${props.params?.styles}`}
      data-class-change
    >
      <div className="lg:absolute inset-0 z-10 h-128 lg:h-full **:h-full">
        <Carousel opts={{ loop: true, align: 'start' }} className="relative">
          <CarouselContent fullWidth>
            {productImages.map((image) => {
              return (
                <CarouselItem
                  key={image.id}
                  className={`bg-cover bg-center ${
                    productImages.length === 1 ? 'w-full' : 'basis-[calc(100%-3.5rem)] lg:basis-1/2'
                  }`}
                  style={{ backgroundImage: `url(${image.url})` }}
                ></CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="absolute bottom-6 lg:bottom-14 left-0 !h-10 w-full lg:w-1/2 flex items-center justify-center gap-2">
            <CarouselPrevious className="static inset-0 translate-0 h-10 w-10 bg-secondary hover:bg-secondary-hover border-0 disabled:hidden" />
            <CarouselNext className="static inset-0 translate-0 h-10 w-10 bg-secondary hover:bg-secondary-hover border-0 disabled:hidden" />
          </div>
        </Carousel>
      </div>

      <div className="relative flex flex-col gap-6 p-10 lg:w-1/3 lg:max-w-md bg-white z-20">
        <h1 className="text-2xl">
          <ContentSdkText field={props.fields?.ProductName} />
        </h1>
        <p className="text-sm">
          <ContentSdkText field={props.fields?.Description} />
        </p>
        <p className="border-t border-b border-border font-(family-name:--font-accent) font-medium text-base py-6">
          <ContentSdkText field={props.fields?.Price} />
        </p>

        <div className="flex items-center gap-4">
          <div className="flex gap-3">
            {props.fields?.Colors?.map((color) => {
              const isSelected = selectedColor?.id === color?.id;
              return (
                <div
                  key={color?.id}
                  onClick={() => setSelectedColor(color)}
                  className={`relative w-9 h-9 rounded-full cursor-pointer border`}
                  style={{ borderColor: isSelected ? color?.fields?.Value?.value : '#ffffff00' }}
                >
                  <div
                    className="absolute inset-[2px] rounded-full"
                    style={{ backgroundColor: color?.fields?.Value?.value }}
                  ></div>
                </div>
              );
            })}
          </div>
          {selectedColor && (
            <span className="text-sm font-(family-name:--font-accent) font-medium">
              {selectedColor?.displayName}
            </span>
          )}
        </div>
        <button className="btn btn-primary btn-sharp cursor-pointer">
          {t(DICTIONARY_KEYS.BUTTON_LABEL) || 'Add to cart'}
        </button>
        <div className="flex flex-col items-start gap-4 border-t border-border pt-6 text-sm">
          <ContentSdkLink
            field={props.fields?.WarrantyLink}
            className="flex items-center gap-2"
            prefetch={false}
          >
            {props.fields?.WarrantyLink?.value?.text}
            <ChevronRight className="h-4 w-4" />
          </ContentSdkLink>
          <ContentSdkLink
            field={props.fields?.ShippingLink}
            className="flex items-center gap-2"
            prefetch={false}
          >
            {props.fields?.ShippingLink?.value?.text}
            <ChevronRight className="h-4 w-4" />
          </ContentSdkLink>
        </div>
      </div>
    </section>
  );
};
