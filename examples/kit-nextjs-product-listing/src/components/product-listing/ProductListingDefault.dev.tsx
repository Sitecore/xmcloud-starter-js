import { Text } from '@sitecore-content-sdk/nextjs';
import React, { useState } from 'react';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { ProductListingProps, ProductItemProps } from './product-listing.props';
import { ProductListingCard } from './ProductListingCard.dev';
import { useMatchMedia } from '@/hooks/use-match-media';
import { cn } from '@/lib/utils';
export const ProductListingDefault: React.FC<ProductListingProps> = (props) => {
  const isReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const { fields, isPageEditing } = props;
  const { products, title, viewAllLink } = fields?.data?.datasource ?? {};
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
          'transition-all duration-500 ease-in-out',
          activeCard !== null && activeCard !== productId ? 'opacity-50 scale-95 blur-[2px]' : '',
          activeCard === productId ? 'scale-105 z-10' : ''
        );
      }
    };
    products?.targetItems.splice(3);
    // Split products into two columns
    const leftColumnProducts =
      products?.targetItems?.filter((_: ProductItemProps, index: number) => index % 2 === 1) || [];
    const rightColumnProducts =
      products?.targetItems?.filter((_: ProductItemProps, index: number) => index % 2 === 0) || [];
    return (
      <div
        className={cn('@container transform-gpu border-b-2 border-t-2 [.border-b-2+&]:border-t-0', {
          [props?.params?.styles]: props?.params?.styles,
        })}
      >
        <div className="@md:px-6 @md:py-20 @lg:py-28 mx-auto max-w-screen-xl px-4 py-12">
          <AnimatedSection
            direction="down"
            duration={400}
            reducedMotion={isReducedMotion}
            className="@md:items-end @md:flex-row mb-8 flex flex-col items-start justify-between"
            isPageEditing={isPageEditing}
          >
            <div>
              <Text
                tag="h2"
                className={cn(
                  '@md:text-5xl @md:w-1/2 w-full text-pretty text-7xl font-light tracking-tight antialiased',
                  {
                    ' @md:absolute': leftColumnProducts.length >= 1, //if there is 1 product.
                  }
                )}
                field={title?.jsonValue}
              />
            </div>
          </AnimatedSection>

          <div className="@md:grid-cols-2 @md:gap-[68px] grid grid-cols-1 gap-[40px]">
            {/* Left column - offset by 50% */}
            {leftColumnProducts.length > 0 && (
              <div className="@md:mt-1/2 @md:gap-[60px] flex flex-col gap-[40px]">
                {leftColumnProducts.map((product, index) => (
                  <AnimatedSection
                    key={JSON.stringify(`${product.productName}-${index}`)}
                    direction="up"
                    delay={index * 150}
                    duration={400}
                    reducedMotion={isReducedMotion}
                    isPageEditing={isPageEditing}
                  >
                    <div
                      className={getCardClasses(`left-${index}`)}
                      onMouseEnter={() => setActiveCard(`left-${index}`)}
                      onMouseLeave={() => setActiveCard(null)}
                      onFocus={() => setActiveCard(`left-${index}`)}
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
            )}
            {/* right column */}
            {rightColumnProducts.length > 0 && (
              <div className="@md:gap-[60px] flex flex-col gap-[40px]">
                {rightColumnProducts.map((product, index) => (
                  <AnimatedSection
                    key={JSON.stringify(`${product.productName}-${index}`)}
                    direction="up"
                    delay={index * 150}
                    duration={400}
                    reducedMotion={isReducedMotion}
                    isPageEditing={isPageEditing}
                  >
                    <div
                      className={getCardClasses(`right-${index}`)}
                      onMouseEnter={() => setActiveCard(`right-${index}`)}
                      onMouseLeave={() => setActiveCard(null)}
                      onFocus={() => setActiveCard(`right-${index}`)}
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
            )}
          </div>
        </div>
      </div>
    );
  }

  return <NoDataFallback componentName="ProductListing" />;
};
