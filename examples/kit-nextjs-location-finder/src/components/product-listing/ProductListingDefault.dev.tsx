import { Text } from '@sitecore-content-sdk/nextjs';
import React, { useState } from 'react';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { ProductListingProps } from './product-listing.props';
import { ProductListingCard } from './ProductListingCard.dev';
import { useMatchMedia } from '@/hooks/use-match-media';
import { cn } from '@/lib/utils';

export const ProductListingDefault: React.FC<ProductListingProps> = (props) => {
  const isReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(3); // Start with 3 products visible
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

    const finalAllProducts = products?.targetItems || [];

    // Calculate how many products to show based on visibleCount
    const visibleProducts = finalAllProducts.slice(0, visibleCount);

    // Balanced layout: Right column starts at title level, balanced numbers when possible
    const totalVisible = visibleProducts.length;
    let leftCount;

    if (totalVisible <= 3) {
      // For 1-3 products: Left gets 1, Right gets the rest
      leftCount = 1;
    } else {
      // For 4+ products: Balance the numbers, extra goes to right
      leftCount = Math.floor(totalVisible / 2);
    }

    const leftColumnProducts = visibleProducts.slice(0, leftCount);
    const rightColumnProducts = visibleProducts.slice(leftCount);

    // Check if there are more products to load
    const hasMoreProducts = finalAllProducts.length > visibleCount;

    // Function to load more products
    const handleLoadMore = () => {
      setVisibleCount((prev) => Math.min(prev + 3, finalAllProducts.length));
    };
    return (
      <div
        className={cn('@container transform-gpu border-b-2 border-t-2 [.border-b-2+&]:border-t-0', {
          [props?.params?.styles]: props?.params?.styles,
        })}
      >
        <div className="@md:px-6 @md:py-20 @lg:py-28 mx-auto max-w-screen-xl px-4 py-12">
          <div className="@md:grid-cols-2 @md:gap-[68px] grid grid-cols-1 gap-[40px]">
            {/* Title positioned in top-left */}
            <div className="@md:col-span-1 @md:row-span-1">
              <AnimatedSection
                direction="down"
                duration={400}
                reducedMotion={isReducedMotion}
                className="mb-16"
                isPageEditing={isPageEditing}
              >
                <Text
                  tag="h2"
                  className="@md:text-5xl w-full text-pretty text-7xl font-light tracking-tight antialiased"
                  field={title?.jsonValue}
                />
              </AnimatedSection>
            </div>

            {/* Left column - starts below title */}
            {leftColumnProducts.length > 0 && (
              <div className="@md:col-span-1 @md:row-span-2 @md:row-start-2">
                <div className="flex flex-col gap-[60px]">
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
                          link={viewAllLink?.jsonValue}
                          prefersReducedMotion={isReducedMotion}
                          isPageEditing={isPageEditing}
                        />
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            )}

            {/* Right column - starts at title level */}
            {rightColumnProducts.length > 0 && (
              <div className="@md:col-span-1 @md:row-span-2 @md:row-start-1">
                <div className="flex flex-col gap-[60px]">
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
                          link={viewAllLink?.jsonValue}
                          prefersReducedMotion={isReducedMotion}
                          isPageEditing={isPageEditing}
                        />
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            )}

            {/* Show "Load More" section if there are more products to load */}
            {hasMoreProducts && (
              <div className="@md:col-span-2 mt-12 text-center">
                <AnimatedSection
                  direction="up"
                  duration={400}
                  reducedMotion={isReducedMotion}
                  isPageEditing={isPageEditing}
                >
                  <div className="bg-muted/50 rounded-lg p-8">
                    <Text tag="p" className="text-muted-foreground mb-4 text-lg">
                      Showing {visibleCount} of {finalAllProducts.length} models
                    </Text>
                    <button
                      onClick={handleLoadMore}
                      className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      Load More Models
                    </button>
                  </div>
                </AnimatedSection>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <NoDataFallback componentName="ProductListing" />;
};
