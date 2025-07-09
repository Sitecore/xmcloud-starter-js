import { Text } from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';
import { Accordion } from '@/components/ui/accordion';
import { ButtonBase as Button } from '@/components/button-component/ButtonComponent';
import { AccordionProps, AccordionItemProps } from './accordion-block.props';
import { AccordionBlockItem } from './AccordionBlockItem.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';

export const AccordionBlockDefault: React.FC<AccordionProps> = (props) => {
  const { fields, isPageEditing } = props;

  const { heading, description, link, children } = fields?.data?.datasource ?? {};
  const accordionItems = children?.results ?? [];
  const accordionItemValues = [
    ...accordionItems.map((_, index) => `accordion-block-item-${index + 1}`),
  ];

  if (fields) {
    return (
      <div
        data-component="AccordionBlock"
        data-class-change
        className={cn('@container bg-secondary text-secondary-foreground rounded-3xl', {
          [props.params.styles]: props?.params?.styles,
        })}
      >
        <div className=" @md:py-16 @lg:py-20 @lg:grid-cols-[320px,1fr] @lg:gap-12 @xl:gap-16 mx-auto grid max-w-screen-xl gap-8 py-10">
          <div className="@lg:pr-0 space-y-4 px-6">
            {heading?.jsonValue && (
              <Text
                tag="h2"
                className="font-heading text-primary @lg:text-7xl -ml-1 text-pretty text-5xl font-normal leading-[1.25] tracking-tighter"
                field={heading.jsonValue}
              />
            )}
            {description?.jsonValue && (
              <Text
                className="font-body text-base font-normal"
                tag="p"
                field={description?.jsonValue}
              />
            )}
            {link?.jsonValue && <Button buttonLink={link.jsonValue} />}
          </div>
          <div className="w-full max-w-[787px] justify-self-end p-6">
            <Accordion
              type="multiple"
              className="w-full"
              value={isPageEditing ? accordionItemValues : undefined} //force open all accordion items
              onValueChange={isPageEditing ? () => {} : undefined} //prevent accordion item from closing
            >
              {accordionItems.map((child: AccordionItemProps, index: number) => (
                <AccordionBlockItem key={index} index={index} child={child} />
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    );
  }

  return <NoDataFallback componentName="Accordion Block" />;
};
