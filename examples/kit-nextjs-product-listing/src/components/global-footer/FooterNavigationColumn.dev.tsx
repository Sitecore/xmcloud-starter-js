'use client';

import { type FC, useId, useRef, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import type {
  FooterNavigationColumnProps,
  FooterNavigationLink,
} from '@/components/global-footer/global-footer.props';
import { Button } from '@/components/ui/button';
import { Link, Text } from '@sitecore-content-sdk/nextjs';

import { EditableButton } from '@/components/button-component/ButtonComponent';
import { AnimatedHoverNav } from '@/components/ui/animated-hover-nav';
import { useContainerQuery } from '@/hooks/use-container-query';
import { cn } from '@/lib/utils';

/**
 * FooterNavigationColumn component renders a navigation column in the footer.
 * It displays a header and a list of navigation links with a hover effect.
 */
export const Default: FC<FooterNavigationColumnProps> = (props) => {
  const {
    items,
    header,
    isPageEditing,
    parentRef,
    indicatorClassName = 'h-0-5 bg-secondary rounded-default bottom-0',
    alignItems = 'start',
    orientation = 'horizontal',
    listClassName = '@sm:gap-8m-0 flex list-none flex-wrap gap-4 p-0',
  } = props;

  // Generate a unique ID for the accordion
  const accordionId = useId();

  // Check if we're on mobile
  // Refs and state for hover effect
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const isMobile = useContainerQuery(parentRef, 'md', 'max');

  // Initialize item refs when items change
  useEffect(() => {
    if (items) {
      itemRefs.current = Array(items.length).fill(null);
    }
  }, [items]);

  // Render mobile accordion view
  if (isMobile && header?.jsonValue?.value) {
    return (
      <nav aria-label="Footer navigation">
        <Accordion type="single" collapsible className="w-full" aria-labelledby={accordionId}>
          <AccordionItem value={`item-${header?.jsonValue?.value}`}>
            <AccordionTrigger className="text-lg font-medium" id={accordionId}>
              <Text field={header?.jsonValue} />
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 py-2">
                {items?.map((item: FooterNavigationLink, index) => (
                  <li key={`footerlinks-${index}-accordion-item`}>
                    <Button
                      variant="link"
                      asChild
                      className="h-auto text-pretty p-0 text-base font-normal text-white"
                    >
                      <Link field={item.link?.jsonValue} />
                    </Button>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </nav>
    );
  }

  // Render desktop view with hover effect
  return (
    <nav aria-label="Footer navigation">
      <AnimatedHoverNav
        disableMobile={false}
        parentRef={parentRef}
        indicatorClassName={indicatorClassName}
        itemsAlign={(alignItems as 'start' | 'end' | 'center') || 'start'}
        orientation={orientation}
      >
        <ul
          className={cn(listClassName, {
            'items-start': alignItems === 'start',
            'items-end': alignItems === 'end',
            'items-center': alignItems === 'center',
            'flex-col': orientation === 'vertical',
            '@md:flex-row  flex-col ': orientation !== 'vertical',
          })}
        >
          {items?.map((item: FooterNavigationLink, index) => (
            <li key={index} className="relative">
              <EditableButton
                buttonLink={item.link?.jsonValue}
                isPageEditing={isPageEditing}
                variant="secondary"
                className="bg-transparent text-lg hover:bg-transparent"
              />
            </li>
          ))}
        </ul>
      </AnimatedHoverNav>
    </nav>
  );
};
