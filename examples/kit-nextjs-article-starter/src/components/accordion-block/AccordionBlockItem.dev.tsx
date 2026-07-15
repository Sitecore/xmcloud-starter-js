import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import { getFieldValue } from '@/lib/component-props';
import type { AccordionItemProps } from './accordion-block.props';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export interface AccordionBlockItemProps {
  child: AccordionItemProps;
  index: number;
  valuePrefix?: string;
}

export const AccordionBlockItem = ({
  index,
  child,
  valuePrefix = 'accordion-block-item',
}: AccordionBlockItemProps) => {
  const headingField = getFieldValue(child?.heading);
  const descriptionField = getFieldValue(child?.description);

  return (
    <>
      <AccordionItem key={index} value={`${valuePrefix}-${index + 1}`} className="border-b">
        <AccordionTrigger className="line-height-6 hover:text-primary-hover font-heading flex flex-1 items-center justify-between py-4 text-left text-base font-medium transition-all hover:no-underline [&>svg]:ml-4 [&[data-state=open]>svg]:rotate-180">
          {headingField && <Text field={headingField} />}
        </AccordionTrigger>
        <AccordionContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm transition-all">
          <div className="font-heading grid gap-4 text-sm">
            {descriptionField && <RichText tag="div" field={descriptionField} />}
          </div>
        </AccordionContent>
      </AccordionItem>
    </>
  );
};
