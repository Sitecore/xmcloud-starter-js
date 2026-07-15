import { Text } from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';
import { Accordion } from '@/components/ui/accordion';
import { ButtonBase as Button } from '@/components/button-component/ButtonComponent';
import { AccordionProps, AccordionItemProps } from './accordion-block.props';
import { AccordionBlockItem } from './AccordionBlockItem.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { StructuredData } from '@/components/structured-data/StructuredData';
import { generateFAQPageSchema } from '@/lib/structured-data/schema';
import { getDatasource, getFieldValue } from '@/lib/component-props';

const stripHtml = (value: string): string => {
  const htmlTagPattern = /<[^>]*>/g;
  let result = value;
  while (htmlTagPattern.test(result)) {
    result = result.replace(htmlTagPattern, '');
  }
  return result.trim();
};

const extractTextFromRichField = (field: AccordionItemProps['description'] | undefined): string => {
  const richField = getFieldValue(field);
  const value: unknown = richField?.value;
  if (!value) return '';

  if (typeof value === 'string') {
    return stripHtml(value);
  }

  if (typeof value === 'object' && value !== null) {
    if ('text' in value && typeof (value as { text: unknown }).text === 'string') {
      return stripHtml((value as { text: string }).text);
    }

    if (Array.isArray(value)) {
      return value
        .map((item: unknown) => {
          if (typeof item === 'string') return item;
          if (typeof item === 'object' && item !== null && 'text' in item) {
            return String((item as { text: unknown }).text || '');
          }
          return '';
        })
        .join(' ')
        .trim();
    }
  }

  try {
    return stripHtml(JSON.stringify(value));
  } catch {
    return '';
  }
};

export const AccordionBlockDefault: React.FC<AccordionProps> = (props) => {
  const { fields, isPageEditing, params } = props || {};

  const datasource = getDatasource(fields);
  const { heading, description, link, children } = datasource || {};
  const headingField = getFieldValue(heading);
  const descriptionField = getFieldValue(description);
  const linkField = getFieldValue(link);
  const accordionItems = children?.results ?? [];
  const accordionItemValues = [
    ...accordionItems.map((_, index) => `accordion-block-item-${index + 1}`),
  ];

  // Generate FAQPage schema if we have accordion items
  const faqSchema =
    accordionItems.length > 0
      ? generateFAQPageSchema({
          faqs: accordionItems.map((item) => ({
            question: getFieldValue(item?.heading)?.value || '',
            answer: extractTextFromRichField(item?.description),
          })),
        })
      : null;

  if (fields) {
    return (
      <>
        {faqSchema && <StructuredData id="accordion-faq-schema" data={faqSchema} />}
        <section
          data-component="AccordionBlock"
          data-class-change
          className={cn('@container bg-secondary text-secondary-foreground rounded-3xl', {
            [params.styles as string]: params?.styles,
          })}
        >
        <div className=" @md:py-16 @lg:py-20 @lg:grid-cols-[320px,1fr] @lg:gap-12 @xl:gap-16 mx-auto grid max-w-screen-xl gap-8 py-10">
          <div className="@lg:pr-0 space-y-4 px-6">
            {headingField && (
              <Text
                tag="h2"
                className="font-heading text-primary @lg:text-7xl -ml-1 text-pretty text-5xl font-normal leading-[1.25] tracking-tighter"
                field={headingField}
              />
            )}
            {descriptionField && (
              <Text
                className="font-body text-base font-normal"
                tag="p"
                field={descriptionField}
              />
            )}
            {linkField && (
              <Button buttonLink={linkField} contextTitle={headingField?.value} />
            )}
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
      </section>
      </>
    );
  }

  return <NoDataFallback componentName="Accordion Block" />;
};
