import { FC, useId } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import {
  FooterNavigationColumnProps,
  FooterNavigationLink,
} from '@/components/global-footer/global-footer.props';
import { Button } from '@/components/ui/button';
import { Link, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { useMatchMedia } from '@/hooks/use-match-media';
/**
 * FooterNavigationColumn component renders a navigation column in the footer.
 * It displays a header and a list of navigation links.
 */
export const Default: FC<FooterNavigationColumnProps> = (props) => {
  const { fields } = props;
  const { items, header } = fields.data?.datasource ?? {};
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;

  const accordionId = useId();
  const isMobile = useMatchMedia('(max-width: 767px)');

  if (fields) {
    return (
      <nav>
        {isMobile ? (
          <Accordion type="single" collapsible className="w-full" aria-labelledby={accordionId}>
            <AccordionItem value={`item-${header?.jsonValue?.value}`}>
              <AccordionTrigger className="text-lg font-medium" id={accordionId}>
                <Text field={header?.jsonValue} />
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 py-2">
                  {items?.results?.map((item: FooterNavigationLink, index) => (
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
        ) : (
          <ul className="mt-6 space-y-6" aria-labelledby={accordionId}>
            {(isPageEditing || header?.jsonValue?.value) && (
              <li className="text-lg font-medium" id={accordionId}>
                <Text field={header?.jsonValue} />
              </li>
            )}
            {items?.results?.map((item: FooterNavigationLink, index) => (
              <li key={`footerlinks-${index}`}>
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
        )}
      </nav>
    );
  }
  return <NoDataFallback componentName="Footer Navigation Column" />;
};
