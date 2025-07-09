import { Text, RichText } from '@sitecore-content-sdk/nextjs';
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
}: AccordionBlockItemProps) => (
  <>
    <AccordionItem
      key={index}
      value={`${valuePrefix}-${index + 1}`}
      className="border-foreground border-b p-0"
    >
      <AccordionTrigger className="font-heading flex w-full justify-between py-4 text-left text-base font-medium">
        <Text
          field={child.heading.jsonValue}
          className="font-heading text-left text-base font-medium"
        />
      </AccordionTrigger>
      <AccordionContent>
        <div className="font-body py-4 pt-2 text-base font-medium">
          {child?.description && <RichText tag="div" field={child.description.jsonValue} />}
        </div>
      </AccordionContent>
    </AccordionItem>
  </>
);
