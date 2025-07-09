'use client';

import { Text } from '@sitecore-content-sdk/nextjs';
import type React from 'react';
import { useState } from 'react';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import type { ProductListingProps } from './product-listing.props';
import { ProductListingCard } from './ProductListingCard.dev';
import { useMatchMedia } from '@/hooks/use-match-media';
import { cn } from '@/lib/utils';

export const ProductListingThreeUp: React.FC<ProductListingProps> = (props) => {
  const { fields, isPageEditing } = props;
  const isReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const { products, title, viewAllLink } = fields.data.datasource;

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
      <div
        className={cn(
          '@container @md:px-6 mx-auto max-w-screen-xl border-b-2 border-t-2 py-12 [.border-b-2+&]:border-t-0',
          {
            [props?.params?.styles]: props?.params?.styles,
          }
        )}
        data-component="ProductListingThreeUp"
      >
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
      </div>
    );
  }

  return <NoDataFallback componentName="ProductListing" />;
};
