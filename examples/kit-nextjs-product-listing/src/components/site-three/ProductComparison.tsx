'use client';

import {
  Text as ContentSdkText,
  NextImage as ContentSdkImage,
  Field,
  ImageField,
} from '@sitecore-content-sdk/nextjs';
import { useI18n } from 'next-localization';
import Link from 'next/link';
import React from 'react';
import { useMemo } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from 'shadcd/components/ui/carousel';
import { Enum } from 'types/enum';

interface Fields {
  Title: Field<string>;
  id: string;
  url: string;
  Products: ProductFields[];
}

interface ProductFields {
  id: string;
  url: string;
  fields: {
    ProductName: Field<string>;
    Price: Field<string>;
    ProductImage: ImageField;
    AmpPower: Field<string>;
    Specifications: Enum[];
  };
}

type ProductComparisonProps = {
  params: { [key: string]: string };
  fields: Fields;
};

const DICTIONARY_KEYS = {
  BUTTON_LABEL: 'Buy_Now',
};

const transformProductData = (products: ProductFields[]) => {
  const specMeta = new Map();

  products.forEach((product: ProductFields) => {
    product.fields.Specifications.forEach((spec) => {
      const name = spec.name;
      const displayName = spec.displayName;
      const order = parseInt(spec.fields.Value.value);

      if (!specMeta.has(name) || specMeta.get(name).order > order) {
        specMeta.set(name, { displayName, order });
      }
    });
  });

  const orderedSpecKeys = Array.from(specMeta.entries())
    .sort((a, b) => a[1].order - b[1].order)
    .map(([name]) => name);

  return products.map((product) => {
    const { ProductName, Price, ProductImage, AmpPower, Specifications } = product.fields;

    const specMap: Record<string, string> = {};
    Specifications.forEach((spec) => {
      specMap[spec.name] = spec.name || spec.displayName;
    });

    const orderedSpecs = orderedSpecKeys.map((specName) => {
      return specMap[specName] || '-';
    });

    return {
      id: product.id,
      image: ProductImage,
      name: ProductName,
      price: Price,
      ampPower: AmpPower,
      specs: orderedSpecs,
      url: product.url,
    };
  });
};

export const Default = (props: ProductComparisonProps) => {
  const { t } = useI18n();

  const formattedProducts = useMemo(
    () => transformProductData(props.fields.Products),
    [props.fields.Products]
  );

  return (
    <section className={`relative ${props.params?.styles}`} data-class-change>
      <div className="container mx-auto px-4">
        <h2 className="max-w-3xl mx-auto text-center text-2xl lg:text-5xl uppercase mb-16">
          <ContentSdkText field={props.fields?.Title} />
        </h2>

        <Carousel opts={{ loop: true }} className="relative text-center">
          <CarouselContent className="-ml-10">
            {formattedProducts.map((product) => {
              const basis = formattedProducts.length < 3 ? formattedProducts.length : 3;
              return (
                <CarouselItem key={product.id} className={`basis-full lg:basis-1/${basis} pl-10`}>
                  <div className="grid gap-4">
                    <div className="px-10">
                      <ContentSdkImage
                        field={product.image}
                        className="aspect-square w-full h-full object-contain max-w-2xs mx-auto"
                      />
                    </div>
                    <h5 className="text-xl lg:text-2xl mt-8 mb-3">
                      <ContentSdkText field={product.name} />
                    </h5>
                    <p className="text-xl lg:text-2xl">
                      <ContentSdkText field={product.price} />
                    </p>
                    {props.params.showButton && (
                      <Link href={product.url} className="btn btn-primary mt-3 justify-self-center">
                        {t(DICTIONARY_KEYS.BUTTON_LABEL) || 'Buy Now'}
                      </Link>
                    )}
                    <hr className="border-border my-10"></hr>
                    <p className="text-lg lg:text-xl font-medium">
                      <ContentSdkText field={product.ampPower} />
                    </p>
                    {product.specs.map((spec) => (
                      <p key={`${product.id}${spec}`} className="text-sm lg:text-base">
                        {spec}
                      </p>
                    ))}
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="disabled:hidden left-0 h-10 w-10 bg-secondary hover:bg-secondary-hover border-0" />
          <CarouselNext className="disabled:hidden right-0 h-10 w-10 bg-secondary hover:bg-secondary-hover border-0" />
        </Carousel>
      </div>
    </section>
  );
};
