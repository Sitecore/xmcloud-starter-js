import type React from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import type { AccordionProps } from './accordion-block.props';
import { AccordionBlockDefault } from './AccordionBlockDefault.dev';

// Data source checks are done in the child components

// Default display of the component
export const Default: React.FC<AccordionProps> = (props) => {
  const { pageContext } = useSitecore();
  const isPageEditing = pageContext?.pageEditing ?? false;

  return <AccordionBlockDefault {...props} isPageEditing={isPageEditing} />;
};

// Variants TBD
