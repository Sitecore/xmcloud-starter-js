'use client';

import type React from 'react';

import { Text } from '@sitecore-content-sdk/nextjs';
import { Accordion } from '@/components/ui/accordion';
import { EditableButton } from '@/components/button-component/ButtonComponent';
import type { AccordionProps, AccordionItemProps } from './accordion-block.props';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { AccordionBlockItem } from './AccordionBlockItem.dev';
import { cn } from '@/lib/utils';

export const AccordionBlockTwoColumnTitleLeft: React.FC<AccordionProps> = (props) => {
  const { fields, isPageEditing } = props;

  const { heading, description, link, children } = fields?.data?.datasource ?? {};
  const accordionItems = children?.results ?? [];
  const acordionItemValues = [
    ...accordionItems.map((_, index) => `accordion-block-item-${index + 1}`),
  ];

  if (fields) {
    return (
      <div
        data-component="AccordionBlock"
        className={cn(
          '@container @md:py-16 @lg:py-20 bg-background text-foreground border-b-2 border-t-2 py-10 [.border-b-2+&]:border-t-0',
          {
            [props.params.styles]: props?.params?.styles,
          }
        )}
        data-class-change
      >
        <div
          className="@xl:px-0 mx-auto grid max-w-screen-xl gap-6 px-0 [&:not(.px-6_&):not(.px-8_&):not(.px-10_&)]:px-6"
          data-component="AccordionBlockContentWrapper"
        >
          <div className="@md:grid @md:grid-cols-[0.5fr,4fr,4fr] @md:gap-8 @lg:gap-12 @xl:gap-16">
            <div className="@md:col-start-[1] @md:col-end-[2] @md:mb-0 mb-8 flex flex-col">
              {heading?.jsonValue && (
                <Text
                  tag="h2"
                  className="@md:text-5xl @md:vertical-text max-h-[420px] text-pretty text-4xl font-light leading-[1.1] tracking-tighter antialiased"
                  field={heading.jsonValue}
                />
              )}
            </div>
            <div className="@md:col-start-[2] @md:col-end-[4] @container">
              <div className="@md:grid-cols-2 @md:gap-8 @lg:gap-12 @xl:gap-16 grid grid-cols-1 gap-8">
                <Accordion
                  type="multiple"
                  className="@md:gap-11 flex w-full flex-col items-stretch justify-start gap-8 p-0"
                  value={
                    isPageEditing
                      ? acordionItemValues.slice(0, Math.ceil(accordionItems.length / 2))
                      : undefined
                  }
                  onValueChange={isPageEditing ? () => {} : undefined}
                >
                  {accordionItems
                    .slice(0, Math.ceil(accordionItems.length / 2))
                    .map((child: AccordionItemProps, index: number) => (
                      <AccordionBlockItem key={index} index={index} child={child} />
                    ))}
                </Accordion>
                <Accordion
                  type="multiple"
                  className="@md:gap-11 @md:mt-0 mt-8 flex w-full  grid-cols-1 flex-col items-stretch justify-start gap-8 p-0"
                  value={
                    isPageEditing
                      ? acordionItemValues.slice(Math.ceil(accordionItems.length / 2))
                      : undefined
                  }
                  onValueChange={isPageEditing ? () => {} : undefined}
                >
                  {accordionItems
                    .slice(Math.ceil(accordionItems.length / 2))
                    .map((child: AccordionItemProps, index: number) => (
                      <AccordionBlockItem
                        key={index + Math.ceil(accordionItems.length / 2)}
                        index={index + Math.ceil(accordionItems.length / 2)}
                        child={child}
                      />
                    ))}
                </Accordion>
                <div className="@md:col-start-[2] @md:col-end-[3]">
                  {(isPageEditing ||
                    description?.jsonValue?.value ||
                    link?.jsonValue?.value?.href) && (
                    <div className="bg-primary @sm:flex-row @sm:text-start @md:flex-col @md:text-center @lg:flex-row @lg:text-start mt-6 flex flex-col flex-nowrap items-center gap-4 p-7 text-center">
                      <Text
                        tag="p"
                        className="text-primary-foreground font-heading text-lg font-light"
                        field={description?.jsonValue}
                      />
                      {link?.jsonValue && (
                        <EditableButton
                          variant="secondary"
                          buttonLink={link.jsonValue}
                          isPageEditing={isPageEditing}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <NoDataFallback componentName="Accordion Block" />;
};
