import type React from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { Accordion } from '@/components/ui/accordion';
import { EditableButton } from '@/components/button-component/ButtonComponent';
import type { AccordionProps, AccordionItemProps } from './accordion-block.props';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { cn } from '@/lib/utils';
import { AccordionBlockItem } from './AccordionBlockItem.dev';
export const Accordion5050TitleAbove: React.FC<AccordionProps> = (props) => {
  const { fields, isPageEditing } = props;

  const { heading, description, link, children } = fields?.data?.datasource ?? {};
  const accordionItems = children?.results ?? [];

  // Split accordion items into two columns
  const leftColumnItems = accordionItems.slice(0, Math.ceil(accordionItems.length / 2));
  const rightColumnItems = accordionItems.slice(Math.ceil(accordionItems.length / 2));

  // Create arrays of values for defaultValue
  const leftColumnValues = leftColumnItems.map((_, index) => `left-item-${index + 1}`);
  const rightColumnValues = rightColumnItems.map((_, index) => `right-item-${index + 1}`);

  if (fields) {
    return (
      <div
        data-component="Accordion5050TitleAbove"
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
          <div className="@md:grid @md:grid-cols-2 @md:gap-8 @lg:gap-12 @xl:gap-16 items-end">
            <div>
              {heading?.jsonValue && (
                <Text
                  tag="h2"
                  className="font-heading @md:text-6xl @lg:text-7xl mb-8 max-w-screen-sm text-pretty text-5xl font-light leading-[1.1] tracking-tighter antialiased"
                  field={heading.jsonValue}
                />
              )}
            </div>
            {(isPageEditing || description?.jsonValue?.value || link?.jsonValue?.value?.href) && (
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

          <div className="@md:grid @md:grid-cols-2 @md:gap-8 @lg:gap-12 @xl:gap-16 mt-8">
            <div>
              <Accordion
                type="multiple"
                className="@md:gap-11 grid w-full gap-8 p-0"
                value={isPageEditing ? leftColumnValues : undefined} // force open all accordion items
                onValueChange={isPageEditing ? () => {} : undefined} // prevent accordion item from closing
              >
                {leftColumnItems.map((child: AccordionItemProps, index: number) => (
                  <AccordionBlockItem
                    key={`left-${index}`}
                    index={index}
                    child={child}
                    valuePrefix={`left-item`}
                  />
                ))}
              </Accordion>
            </div>
            <div>
              <Accordion
                type="multiple"
                className="@md:gap-11 grid w-full gap-8 p-0"
                value={isPageEditing ? rightColumnValues : undefined} // force open all accordion items
                onValueChange={isPageEditing ? () => {} : undefined} // prevent accordion item from closing
              >
                {rightColumnItems.map((child: AccordionItemProps, index: number) => (
                  <AccordionBlockItem
                    key={`right-${index}`}
                    index={index}
                    child={child}
                    valuePrefix={`right-item`}
                  />
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <NoDataFallback componentName="Accordion 50/50 Title Above" />;
};
