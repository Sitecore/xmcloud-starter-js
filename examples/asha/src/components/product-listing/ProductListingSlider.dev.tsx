'use client';

import { Text } from '@sitecore-content-sdk/nextjs';
import React, { useState, useMemo } from 'react';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { ProductListingProps, ProductItemProps } from './product-listing.props';
import { ProductListingCard } from './ProductListingCard.dev';
import { useMatchMedia } from '@/hooks/use-match-media';
import { cn } from '@/lib/utils';
import {
  SlideCarousel,
  SlideCarouselItemWrap,
} from '@/components/slide-carousel/SlideCarousel.dev';
import { generateProductSchema } from '@/lib/structured-data/schema';
import { StructuredData } from '@/components/structured-data/StructuredData';

export const ProductListingSlider: React.FC<ProductListingProps> = (props) => {
  const isReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const { fields, isPageEditing } = props;
  const { products, title, viewAllLink } = fields?.data?.datasource ?? {};

  // Generate JSON-LD structured data for products (must be at top level)
  const productSchemas = useMemo(() => {
    if (!products?.targetItems) return [];
    return products.targetItems.map((product: ProductItemProps) => {
      const productName = product.productName?.jsonValue?.value || '';
      const productImage = product.productThumbnail?.jsonValue?.value?.src || '';
      const productPrice = product.productBasePrice?.jsonValue?.value || '';
      const productUrl = product.url?.path || '';
      const productDescription = product.productFeatureText?.jsonValue?.value || '';

      return generateProductSchema({
        name: productName,
        image: productImage,
        description: productDescription,
        price: productPrice,
        priceCurrency: 'USD',
        url: productUrl || undefined,
      });
    });
  }, [products?.targetItems]);

  if (fields) {
    const getCardClasses = (productId: string) => {
      if (isReducedMotion) {
        // Reduced motion version - no scaling, blur, or complex animations
        return cn(
          'transition-opacity duration-150',
          activeCard !== null && activeCard !== productId ? 'opacity-60' : '',
          activeCard === productId ? 'z-10' : ''
        );
      } else {
        // Full motion version
        return cn(
          'transition-all duration-500 ease-in-out h-full',
          activeCard !== null && activeCard !== productId ? 'opacity-50 scale-95 blur-[2px]' : '',
          activeCard === productId ? 'scale-102 z-10' : ''
        );
      }
    };

    return (
      <section
        className={cn('@container transform-gpu border-b-2 border-t-2 [.border-b-2+&]:border-t-0', {
          [props?.params?.styles]: props?.params?.styles,
        })}
        aria-label="Product listing"
      >
        {/* JSON-LD structured data for products */}
        {productSchemas.map((schema, index) => (
          <StructuredData key={`product-schema-${index}`} id={`product-schema-${index}`} data={schema} />
        ))}
        <div className="@md:py-20 @lg:py-28 py-12 ">
          <div className="@xl:px-0 @md:pb-0 mx-auto max-w-screen-xl px-0 pb-10 [&:not(.px-6_&):not(.px-8_&):not(.px-10_&)]:px-6">
            <AnimatedSection
              direction="down"
              duration={400}
              reducedMotion={isReducedMotion}
              className=" "
              isPageEditing={isPageEditing}
            >
              <div>
                <Text tag="h2" className={cn('@md:w-1/2 w-full')} field={title?.jsonValue} />
              </div>
            </AnimatedSection>
          </div>
          <SlideCarousel>
            {products?.targetItems.map((product, index) => (
              <SlideCarouselItemWrap key={index} className="max-w-[546px]">
                <div
                  className={getCardClasses(`product-${index}`)}
                  onMouseEnter={() => setActiveCard(`product-${index}`)}
                  onMouseLeave={() => setActiveCard(null)}
                  onFocus={() => setActiveCard(`product-${index}`)}
                  onBlur={() => setActiveCard(null)}
                >
                  <ProductListingCard
                    product={product}
                    link={viewAllLink.jsonValue}
                    prefersReducedMotion={isReducedMotion}
                    isPageEditing={isPageEditing}
                  />
                </div>
              </SlideCarouselItemWrap>
            ))}
          </SlideCarousel>
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="ProductListing" />;
};
