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

  const { title, viewAllLink, products } = fields?.data?.datasource ?? {};

  const sitecoreProducts = products?.targetItems || [];

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

    const finalAllProducts = sitecoreProducts;

    // Limit to 3 products
    const visibleProducts = finalAllProducts.slice(0, 3);

    // Layout: Left gets 1, Right gets the rest (max 3 products total)
    const leftCount = 1;

    const leftColumnProducts = visibleProducts.slice(0, leftCount);
    const rightColumnProducts = visibleProducts.slice(leftCount);
    return (
      <div
        className={cn('@container transform-gpu border-b-2 border-t-2 [.border-b-2+&]:border-t-0', {
          [props?.params?.styles]: props?.params?.styles,
        })}
      >
        {isPageEditing && (
          <div
            className="fixed top-4 left-4 right-4 z-50 bg-white border border-gray-200 text-gray-800 px-6 py-4 rounded-xl shadow-xl backdrop-blur-sm"
            role="alert"
          >
            <div className="max-w-screen-xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <strong className="font-semibold text-gray-900">Editor Note:</strong>
                  <span className="block sm:inline text-gray-700">
                    {' '}
                    Only the first 3 selected products will be displayed.
                  </span>
                </div>
              </div>
              <button
                className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                onClick={() => {}}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
        <div className="@md:px-6 @md:py-20 @lg:py-28 mx-auto max-w-screen-xl px-4 py-12">
          <div className="@md:grid-cols-2 @md:gap-[68px] grid grid-cols-1 gap-[40px]">
            <div className="@md:col-span-1">
              <AnimatedSection
                direction="down"
                duration={400}
                reducedMotion={isReducedMotion}
                className="mb-16"
                isPageEditing={isPageEditing}
              >
                <Text
                  tag="h2"
                  className="@md:text-6xl @lg:text-7xl w-full text-pretty text-8xl font-light tracking-tight antialiased"
                  field={title?.jsonValue}
                />
              </AnimatedSection>

              {leftColumnProducts.length > 0 && (
                <div className="flex flex-col gap-[60px]">
                  {leftColumnProducts.map((product: ProductItemProps, index: number) => (
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
              )}
            </div>

            {rightColumnProducts.length > 0 && (
              <div className="@md:col-span-1 @md:pt-16">
                <div className="flex flex-col gap-[60px]">
                  {rightColumnProducts.map((product: ProductItemProps, index: number) => (
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
          </div>
        </div>
      </div>
    );
  }

  return <NoDataFallback componentName="ProductListing" />;
};
