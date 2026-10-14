'use client';

import { Text } from '@sitecore-content-sdk/nextjs';
import React, { useState, useMemo } from 'react';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import type { ProductListingProps, ProductItemProps } from './product-listing.props';
import { ProductListingCard } from './ProductListingCard.dev';
import { useMatchMedia } from '@/hooks/use-match-media';
import { cn } from '@/lib/utils';
import { generateProductSchema } from '@/lib/structured-data/schema';
import { StructuredData } from '@/components/structured-data/StructuredData';

export const ProductListingThreeUp: React.FC<ProductListingProps> = (props) => {
  const { fields, isPageEditing } = props;
  const isReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');
  const [activeCard, setActiveCard] = useState<string | null>(null);
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
          activeCard === productId ? 'scale-105 z-10' : ''
        );
      }
    };

    return (
      <section
        className={cn(
          '@container @md:px-6 mx-auto max-w-screen-xl border-b-2 border-t-2 py-12 [.border-b-2+&]:border-t-0',
          {
            [props?.params?.styles]: props?.params?.styles,
          }
        )}
        data-component="ProductListingThreeUp"
        aria-label="Product listing"
      >
        {/* JSON-LD structured data for products */}
        {productSchemas.map((schema, index) => (
          <StructuredData key={`product-schema-${index}`} id={`product-schema-${index}`} data={schema} />
        ))}
        <AnimatedSection
          direction="down"
          duration={400}
          reducedMotion={isReducedMotion}
          className="mb-12 flex flex-col items-start justify-between"
          isPageEditing={isPageEditing}
        >
          <Text
            tag="h2"
            className="w-full text-pretty text-5xl font-light tracking-tight antialiased"
            field={title?.jsonValue}
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products?.targetItems?.map((product, index) => (
            <AnimatedSection
              key={JSON.stringify(`${product.productName}-${index}`)}
              direction="up"
              delay={index * 150}
              duration={400}
              reducedMotion={isReducedMotion}
              isPageEditing={isPageEditing}
            >
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
            </AnimatedSection>
          ))}
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="ProductListing" />;
};
