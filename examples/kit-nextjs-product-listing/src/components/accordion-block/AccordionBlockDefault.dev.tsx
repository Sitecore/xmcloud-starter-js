import { Text } from '@sitecore-content-sdk/nextjs';
import { Accordion } from '@/components/ui/accordion';
import { EditableButton } from '@/components/button-component/ButtonComponent';
import { AccordionProps, AccordionItemProps } from './accordion-block.props';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { AccordionBlockItem } from './AccordionBlockItem.dev';
import { cn } from '@/lib/utils';
import { getDatasource, getFieldValue } from '@/lib/component-props';

export const AccordionBlockDefault: React.FC<AccordionProps> = (props) => {
  const { fields, isPageEditing } = props;

  const datasource = getDatasource(fields);
  const { heading, description, link, children } = datasource || {};
  const headingField = getFieldValue(heading);
  const descriptionField = getFieldValue(description);
  const linkField = getFieldValue(link);
  const accordionItems = (children?.results ?? []).filter(Boolean);
  const acordionItemValues = [
    ...accordionItems.map((_, index) => `accordion-block-item-${index + 1}`),
  ];
  if (datasource) {
    return (
      <section
        data-component="AccordionBlock"
        className={cn(
          '@container @md:py-16 @lg:py-20 border-b-2 border-t-2 py-10 [.border-b-2+&]:border-t-0',
          {
            [props.params.styles as string]: props?.params?.styles,
          }
        )}
        data-class-change
        aria-label="Accordion content"
      >
        <div
          className="@xl:px-0 mx-auto grid max-w-screen-xl gap-6 px-0 [&:not(.px-6_&):not(.px-8_&):not(.px-10_&)]:px-6"
          data-component="AccordionBlockContentWrapper"
        >
          <div className="@lg:mb-0 mb-8">
            {headingField && (
              <Text
                tag="h2"
                className="font-heading @md:text-6xl @lg:text-7xl max-w-screen-sm text-pretty text-5xl font-light leading-[1.1] tracking-tighter antialiased"
                field={headingField}
              />
            )}
          </div>
          <div className="@md:grid @md:grid-cols-[4fr,6fr] @md:gap-8 @lg:gap-12 @xl:gap-16">
            <div className="@md:col-start-[2] @md:col-end-[2]">
              <Accordion
                type="multiple"
                className="@md:gap-11 grid w-full gap-8 p-0"
                value={isPageEditing ? acordionItemValues : undefined} //force open all accordion items
                onValueChange={isPageEditing ? () => {} : undefined} //prevent accordion item from closing
              >
                {accordionItems.map((child: AccordionItemProps, index: number) => (
                  <AccordionBlockItem key={index} index={index} child={child} />
                ))}
              </Accordion>
            </div>
            {(isPageEditing || descriptionField?.value || linkField?.value?.href) && (
              <aside className="bg-primary @sm:flex-row @sm:text-start @md:flex-col @md:text-center @lg:flex-row @lg:text-start mt-6 flex flex-col flex-nowrap items-center gap-4 p-7 text-center" aria-label="Additional information">
                <Text
                  tag="p"
                  className="text-primary-foreground font-heading text-lg font-light"
                  field={descriptionField}
                />
                {linkField && (
                  <EditableButton
                    variant="secondary"
                    buttonLink={linkField}
                    isPageEditing={isPageEditing}
                  />
                )}
              </aside>
            )}
          </div>
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="Accordion Block" />;
};
