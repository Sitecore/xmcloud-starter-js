import type React from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import type { AccordionProps } from './accordion-block.props';
import { AccordionBlockDefault } from './AccordionBlockDefault.dev';

// Data source checks are done in the child components

// Default display of the component
export const Default: React.FC<AccordionProps> = (props) => {
  const { sitecoreProvider } = useSitecore();
  const isPageEditing = sitecoreProvider?.pageEditing ?? false;

  return <AccordionBlockDefault {...props} isPageEditing={isPageEditing} />;
};

// Variants TBD
