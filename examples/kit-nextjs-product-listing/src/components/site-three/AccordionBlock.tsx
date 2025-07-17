import {
  Link as ContentSdkLink,
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
} from '@sitecore-content-sdk/nextjs';
import { useMemo } from 'react';
import { IGQLLinkField, IGQLRichTextField, IGQLTextField } from 'types/igql';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'shadcd/components/ui/accordion';

interface Fields {
  data: {
    datasource: {
      heading: IGQLTextField;
      description: IGQLTextField;
      link: IGQLLinkField;
      children: {
        results: AccordionItemFields[];
      };
    };
  };
}

interface AccordionItemFields {
  id: string;
  heading: IGQLTextField;
  description: IGQLRichTextField;
}

type AccordionProps = {
  params: { [key: string]: string };
  fields: Fields;
};

const AccordionBlockItem = (props: AccordionItemFields) => {
  return (
    <AccordionItem value={props.id} className="border-border mb-10">
      <AccordionTrigger>
        <h5 className="text-base">
          <ContentSdkText field={props.heading?.jsonValue} />
        </h5>
      </AccordionTrigger>
      <AccordionContent>
        <ContentSdkRichText field={props.description?.jsonValue} />
      </AccordionContent>
    </AccordionItem>
  );
};

export const Default = (props: AccordionProps) => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`relative py-20 overflow-hidden ${props.params.styles}`} data-class-change>
      <span className="absolute top-1/3 -left-1/3 w-screen h-64 bg-primary opacity-50 blur-[400px] rotate-15 z-10"></span>
      <div className="relative container mx-auto px-4 z-20">
        <div className="grid lg:grid-cols-2 gap-12">
          <h2 className="text-2xl lg:text-5xl">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div>
            <Accordion type="multiple" className="w-full mb-12">
              {datasource.children.results.map((item) => (
                <AccordionBlockItem key={item.id} {...item} />
              ))}
            </Accordion>
            <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center gap-6 self-center lg:col-start-2 p-5 bg-primary">
              <h6 className="text-sm">
                <ContentSdkText field={datasource.description?.jsonValue} />
              </h6>
              <ContentSdkLink
                field={datasource.link.jsonValue}
                prefetch={false}
                className="btn btn-secondary btn-sharp"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const TwoColumn = (props: AccordionProps) => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`relative py-20 overflow-hidden ${props.params.styles}`} data-class-change>
      <span className="absolute top-1/3 -left-1/3 w-screen h-64 bg-primary opacity-50 blur-[400px] rotate-15 z-10"></span>
      <div className="relative container mx-auto px-4 z-20">
        <h2 className="text-2xl lg:text-5xl">
          <ContentSdkText field={datasource.heading?.jsonValue} />
        </h2>
        <Accordion type="multiple" className="w-full grid lg:grid-cols-2 gap-x-12 my-12">
          {datasource.children.results.map((item) => (
            <AccordionBlockItem key={item.id} {...item} />
          ))}
        </Accordion>
        <div className="grid lg:grid-cols-2 gap-x-12">
          <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center gap-6 self-center lg:col-start-2 p-5 bg-primary">
            <h6 className="text-sm">
              <ContentSdkText field={datasource.description?.jsonValue} />
            </h6>
            <ContentSdkLink
              field={datasource.link.jsonValue}
              prefetch={false}
              className="btn btn-secondary btn-sharp"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Vertical = (props: AccordionProps) => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`relative py-20 overflow-hidden ${props.params.styles}`} data-class-change>
      <span className="absolute -top-20 w-screen h-64 bg-primary opacity-50 blur-[400px] z-10"></span>
      <div className="relative container mx-auto px-4 z-20">
        <div className="flex flex-col gap-12 max-w-3xl mx-auto">
          <h2 className="text-2xl lg:text-5xl text-center">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <Accordion type="multiple" className="w-full">
            {datasource.children.results.map((item) => (
              <AccordionBlockItem key={item.id} {...item} />
            ))}
          </Accordion>
          <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center gap-6 self-center lg:col-start-2 p-5 bg-primary">
            <h6 className="text-sm">
              <ContentSdkText field={datasource.description?.jsonValue} />
            </h6>
            <ContentSdkLink
              field={datasource.link.jsonValue}
              prefetch={false}
              className="btn btn-secondary btn-sharp"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const BoxedAccordion = (props: AccordionProps) => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`bg-primary py-20 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl lg:text-5xl">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
        </div>
        <div className="flex flex-col gap-12 max-w-3xl mx-auto bg-white p-4 lg:p-12 mt-12 shadow-2xl">
          <Accordion type="multiple" className="w-full">
            {datasource.children.results.map((item) => (
              <AccordionBlockItem key={item.id} {...item} />
            ))}
          </Accordion>
          <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center gap-6 self-center lg:col-start-2 p-5 bg-primary">
            <h6 className="text-sm">
              <ContentSdkText field={datasource.description?.jsonValue} />
            </h6>
            <ContentSdkLink
              field={datasource.link.jsonValue}
              prefetch={false}
              className="btn btn-secondary btn-sharp"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const BoxedContent = (props: AccordionProps) => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`bg-gradient py-20 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto px-4">
        <div className="bg-white p-4 lg:p-12 shadow-2xl">
          <div className="flex flex-col gap-12 max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-5xl max-w-2xl">
              <ContentSdkText field={datasource.heading?.jsonValue} />
            </h2>
            <Accordion type="multiple" className="w-full">
              {datasource.children.results.map((item) => (
                <AccordionBlockItem key={item.id} {...item} />
              ))}
            </Accordion>
            <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center gap-6 self-center lg:col-start-2 p-5 bg-primary">
              <h6 className="text-sm">
                <ContentSdkText field={datasource.description?.jsonValue} />
              </h6>
              <ContentSdkLink
                field={datasource.link.jsonValue}
                prefetch={false}
                className="btn btn-secondary btn-sharp"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
