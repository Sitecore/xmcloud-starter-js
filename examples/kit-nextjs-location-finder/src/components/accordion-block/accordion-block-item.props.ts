import type { AccordionItemProps } from './accordion-block.props';

export type AccordionBlockItemProps = {
  child: AccordionItemProps;
  index: number;
  valuePrefix?: string;
};
