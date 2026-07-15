'use client';

import { Text, Link as EditableLink } from '@sitecore-content-sdk/nextjs';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { Button } from '@/components/ui/button';
import { CardSpotlight } from '@/components/card-spotlight/card-spotlight.dev';
import type { ProductCardProps } from './product-listing.props';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { dictionaryKeys } from '@/variables/dictionary';
import { generateProductSchema } from '@/lib/structured-data/schema';
import { getBaseUrl } from '@/lib/utils';
import { StructuredData } from '@/components/structured-data/StructuredData';

const ProductListingCard = ({
  product,
  link,
  prefersReducedMotion,
  isPageEditing,
  page,
}: ProductCardProps) => {
  const t = useTranslations();
  const dictionary = {
    PRODUCTLISTING_DrivingRange: t(dictionaryKeys.PRODUCTLISTING_DrivingRange),
    PRODUCTLISTING_Price: t(dictionaryKeys.PRODUCTLISTING_Price),
    PRODUCTLISTING_SeeFullSpecs: t(dictionaryKeys.PRODUCTLISTING_SeeFullSpecs),
  };

  // Generate Product schema
  const productName = product.productName?.jsonValue?.value?.toString() || 'Product';
  const productPrice = product.productBasePrice?.jsonValue?.value?.toString();
  const productImage = product.productThumbnail?.jsonValue?.value?.src;
  const productUrl = product.url?.path;
  const productDescription = `${product.productFeatureTitle?.jsonValue?.value?.toString() || ''} ${product.productFeatureText?.jsonValue?.value?.toString() || ''}`.trim();
  const fullUrl = productUrl ? `${getBaseUrl()}${productUrl}` : undefined;

  const productSchema = generateProductSchema(
    productName,
    productDescription || undefined,
    productImage,
    fullUrl,
    productPrice
  );

  return (
    <>
      {/* Product structured data */}
      <StructuredData id="product-schema" data={productSchema} />
      
      <CardSpotlight className="h-full w-full" prefersReducedMotion={prefersReducedMotion}>
        <article
          className="@md:px-12 @md:py-12 font-heading relative z-10 flex w-full flex-col gap-8 px-6 py-10"
          data-component="ProductListingCard"
        >
        <div className="relative overflow-hidden">
          <ImageWrapper image={product.productThumbnail?.jsonValue} className="mx-auto" page={page} />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Text
              tag="h3"
              className="text-secondary-foreground text-2xl font-semibold"
              field={product.productName?.jsonValue}
            />
            {(isPageEditing || product?.productBasePrice?.jsonValue?.value) && (
              <p className="text-muted-foreground text-base font-light transition-all group-[.spotlight]:brightness-125">
                {dictionary.PRODUCTLISTING_Price}{' '}
                <Text field={product?.productBasePrice?.jsonValue} />
              </p>
            )}
          </div>

          <div className="border-muted-foreground border-t pt-4">
            <Text
              tag="h4"
              className="text-secondary-foreground font-regular text-xl mb-2"
              field={product.productFeatureTitle?.jsonValue}
            />
            <Text
              tag="p"
              className="text-muted-foreground text-sm font-light transition-all group-[.spotlight]:brightness-125"
              field={product.productFeatureText?.jsonValue}
            />
          </div>

          <div className="border-muted-foreground border-t pt-4">
            <Text
              tag="h4"
              className="text-secondary-foreground font-regular text-xl"
              field={product.productDrivingRange?.jsonValue}
            />
            <p className="text-muted-foreground text-sm font-light transition-all group-[.spotlight]:brightness-125">
              {dictionary.PRODUCTLISTING_DrivingRange}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {isPageEditing ||
              (link?.value?.href && (
                <Button className="w-full" asChild>
                  <EditableLink field={link} />
                </Button>
              ))}
            {product.url?.path && (
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href={product.url.path}>{dictionary.PRODUCTLISTING_SeeFullSpecs}</Link>
              </Button>
            )}
          </div>
        </div>
        </article>
      </CardSpotlight>
    </>
  );
};

export { ProductListingCard };
