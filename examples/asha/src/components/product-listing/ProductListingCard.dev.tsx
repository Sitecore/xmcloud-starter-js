import { Text, Link as EditableLink } from '@sitecore-content-sdk/nextjs';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { Button } from '@/components/ui/button';
import { CardSpotlight } from '@/components/card-spotlight/card-spotlight.dev';
import type { ProductCardProps } from './product-listing.props';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { dictionaryKeys } from '@/variables/dictionary';

const ProductListingCard = ({
  product,
  link,
  prefersReducedMotion,
  isPageEditing,
}: ProductCardProps) => {
  const t = useTranslations();
  const dictionary = {
    PRODUCTLISTING_DrivingRange: t(dictionaryKeys.PRODUCTLISTING_DrivingRange),
    PRODUCTLISTING_Price: t(dictionaryKeys.PRODUCTLISTING_Price),
    PRODUCTLISTING_SeeFullSpecs: t(dictionaryKeys.PRODUCTLISTING_SeeFullSpecs),
  };
  return (
    <CardSpotlight className="h-full w-full" prefersReducedMotion={prefersReducedMotion}>
      <article
        className="@md:px-12 @md:py-12 font-heading relative z-10 flex w-full flex-col justify-between gap-8 px-6 py-10"
        data-component="ProductListingCard"
        itemScope
        itemType="https://schema.org/Product"
      >
        <figure className="relative overflow-hidden">
          <ImageWrapper image={product.productThumbnail.jsonValue} className="mx-auto" />
        </figure>
        <div className="space-y-4">
          <div>
            <Text
              tag="h3"
              className="text-secondary-foreground text-2xl font-semibold"
              field={product.productName?.jsonValue}
              itemProp="name"
            />
            {(isPageEditing || product?.productBasePrice?.jsonValue?.value) && (
              <p className="text-muted-foreground text-base font-light transition-all group-[.spotlight]:brightness-125">
                {dictionary.PRODUCTLISTING_Price}{' '}
                <span itemProp="offers" itemScope itemType="https://schema.org/Offer">
                  <Text field={product?.productBasePrice?.jsonValue} itemProp="price" />
                  <meta itemProp="priceCurrency" content="USD" />
                  <meta itemProp="availability" content="https://schema.org/InStock" />
                </span>
              </p>
            )}
          </div>

          <section className="border-muted-foreground border-t pt-4">
            <Text
              tag="h4"
              className="text-secondary-foreground font-regular text-2xl"
              field={product.productFeatureTitle?.jsonValue}
            />
            <Text
              tag="p"
              className="text-muted-foreground text-base font-light transition-all group-[.spotlight]:brightness-125"
              field={product.productFeatureText?.jsonValue}
            />
          </section>

          <section className="border-muted-foreground border-t pt-4">
            <Text
              tag="h4"
              className="text-secondary-foreground font-regular text-2xl"
              field={product.productDrivingRange?.jsonValue}
            />
            <p className="text-muted-foreground text-base font-light transition-all group-[.spotlight]:brightness-125">
              {dictionary.PRODUCTLISTING_DrivingRange}
            </p>
          </section>

          <nav className="space-y-2 pt-2" aria-label="Product actions">
            {isPageEditing ? (
              <Button className="w-full" asChild>
                <EditableLink field={link} />
              </Button>
            ) : (
              link?.value?.href && (
                <Button className="w-full" asChild>
                  <Link href={link.value.href}>{link.value.text}</Link>
                </Button>
              )
            )}
            {product.url?.path && (
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href={product.url.path}>{dictionary.PRODUCTLISTING_SeeFullSpecs}</Link>
              </Button>
            )}
          </nav>
        </div>
      </article>
    </CardSpotlight>
  );
};

export { ProductListingCard };
