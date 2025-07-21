import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { IGQLImageField, IGQLLinkField, IGQLRichTextField, IGQLTextField } from 'src/types/igql';
import { Button } from 'shadcd/components/ui/button';
import { useMemo, useState, type JSX } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'shadcd/components/ui/accordion';
import ContentSdkRichText from '@/components/content-sdk-rich-text/ContentSdkRichText';

interface Fields {
  data: {
    datasource: {
      children: {
        results: QuestionFields[];
      };
      heading: IGQLTextField;
      text: IGQLRichTextField;
      heading2: IGQLTextField;
      text2: IGQLRichTextField;
      link: IGQLLinkField;
    };
  };
}

interface QuestionFields {
  id: string;
  question: IGQLTextField;
  answer: IGQLRichTextField;
  image: IGQLImageField;
}

type FAQProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type QuestionAccordionItemProps = {
  q: QuestionFields;
  type: 'simple' | 'bordered' | 'boxed';
  className?: string;
};

type QuestionItemProps = {
  q: QuestionFields;
  type: 'simple' | 'bordered' | 'centered';
  showIcon?: boolean;
};

const QuestionAccordionItem = (props: QuestionAccordionItemProps) => {
  switch (props.type) {
    case 'bordered':
      return (
        <AccordionItem
          value={props.q.id}
          className={`border-gray-300 first:border-t ${props.className}`}
        >
          <AccordionTrigger className="flex-row-reverse justify-end py-6 px-2 text-base cursor-pointer">
            <ContentSdkText field={props.q.question?.jsonValue} />
          </AccordionTrigger>
          <AccordionContent className="text-base pb-6 ps-10">
            <ContentSdkRichText field={props.q.answer?.jsonValue} />
          </AccordionContent>
        </AccordionItem>
      );
    case 'boxed':
      return (
        <AccordionItem value={props.q.id} className={`border last:border ${props.className}`}>
          <AccordionTrigger className="px-8">
            <ContentSdkText field={props.q.question?.jsonValue} />
          </AccordionTrigger>
          <AccordionContent className="px-8">
            <ContentSdkRichText field={props.q.answer?.jsonValue} />
          </AccordionContent>
        </AccordionItem>
      );
    default:
      return (
        <AccordionItem value={props.q.id} className={props.className}>
          <AccordionTrigger>
            <ContentSdkText field={props.q.question.jsonValue} />
          </AccordionTrigger>
          <AccordionContent>
            <ContentSdkRichText field={props.q.answer.jsonValue} />
          </AccordionContent>
        </AccordionItem>
      );
  }
};

const QuestionItem = (props: QuestionItemProps) => {
  switch (props.type) {
    case 'bordered':
      return (
        <div className="grid md:grid-cols-2 gap-4 border-t pt-6 pb-12">
          <h3 className="text-lg font-bold mb-4">
            <ContentSdkText field={props.q.question?.jsonValue} />
          </h3>
          <div>
            <ContentSdkRichText field={props.q.answer?.jsonValue} />
          </div>
        </div>
      );
    case 'centered':
      return (
        <div className="text-center">
          <ContentSdkImage
            field={props.q.image?.jsonValue}
            width={50}
            height={50}
            className="object-contain mx-auto mb-6"
          />

          <h3 className="text-lg font-bold mb-4">
            <ContentSdkText field={props.q.question?.jsonValue} />
          </h3>
          <div>
            <ContentSdkRichText field={props.q.answer?.jsonValue} />
          </div>
        </div>
      );
    default:
      return (
        <div>
          {props.showIcon && (
            <ContentSdkImage
              field={props.q.image?.jsonValue}
              width={50}
              height={50}
              className="object-contain mb-6"
            />
          )}
          <h3 className="text-lg font-bold mb-4">
            <ContentSdkText field={props.q.question?.jsonValue} />
          </h3>
          <div>
            <ContentSdkRichText field={props.q.answer?.jsonValue} />
          </div>
        </div>
      );
  }
};

export const Default = (props: FAQProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-6">
              <ContentSdkText field={datasource.heading?.jsonValue} />
            </h2>
            <div className="text-lg">
              <ContentSdkRichText field={datasource.text?.jsonValue} />
            </div>
          </div>
          <Accordion type="multiple" className="w-full my-20">
            {datasource.children.results.map((q) => (
              <QuestionAccordionItem key={q.id} q={q} type="bordered" />
            ))}
          </Accordion>
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">
              <ContentSdkText field={datasource.heading2?.jsonValue} />
            </h3>
            <div className="text-lg">
              <ContentSdkRichText field={datasource.text2?.jsonValue} />
            </div>
            <Button asChild={true} className="mt-8">
              <ContentSdkLink field={datasource.link.jsonValue} prefetch={false} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const FAQ1 = (props: FAQProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);
  const itemIds = datasource.children.results.map((q) => q.id);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const expandAll = () => setOpenItems(itemIds);
  const collapseAll = () => setOpenItems([]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div>
          <h2 className="text-3xl font-semibold mb-6">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>

          {/* Expand / Collapse Buttons */}
          <div className="flex gap-4 mb-6 text-base font-semibold">
            <button
              onClick={expandAll}
              disabled={openItems.length === itemIds.length}
              className={`px-2 ${
                openItems.length === itemIds.length
                  ? 'opacity-40 cursor-not-allowed'
                  : 'text-primary underline cursor-pointer'
              }`}
            >
              Expand All
            </button>
            |
            <button
              onClick={collapseAll}
              disabled={openItems.length === 0}
              className={`px-2 ${
                openItems.length === 0
                  ? 'opacity-40 cursor-not-allowed'
                  : 'text-primary underline cursor-pointer'
              }`}
            >
              Collapse All
            </button>
          </div>

          <Accordion
            type="multiple"
            value={openItems}
            onValueChange={(value) => setOpenItems(value)}
            className="w-full"
          >
            {datasource.children.results.map((q) => (
              <QuestionAccordionItem key={q.id} q={q} type="bordered" />
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export const FAQ2 = (props: FAQProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="grid gap-x-20 gap-y-12 md:grid-cols-2">
          <div>
            <h2 className="text-5xl font-bold mb-6">
              <ContentSdkText field={datasource.heading?.jsonValue} />
            </h2>
            <div className="text-lg">
              <ContentSdkRichText field={datasource.text?.jsonValue} />
            </div>
            <Button asChild={true} className="mt-8">
              <ContentSdkLink field={datasource.link.jsonValue} prefetch={false} />
            </Button>
          </div>
          <div>
            <Accordion type="multiple" className="w-full grid gap-4">
              {datasource.children.results.map((q) => (
                <QuestionAccordionItem key={q.id} q={q} type="boxed" />
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export const FAQ3 = (props: FAQProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div className="text-lg">
            <ContentSdkRichText field={datasource.text?.jsonValue} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 items-start my-20">
          <Accordion type="multiple" className="w-full grid gap-4">
            {datasource.children.results
              .filter((_, index) => index % 2 === 0)
              .map((q) => (
                <QuestionAccordionItem key={q.id} q={q} type="boxed" />
              ))}
          </Accordion>
          <Accordion type="multiple" className="w-full grid gap-4">
            {datasource.children.results
              .filter((_, index) => index % 2 !== 0)
              .map((q) => (
                <QuestionAccordionItem key={q.id} q={q} type="boxed" />
              ))}
          </Accordion>
        </div>
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">
            <ContentSdkText field={datasource.heading2?.jsonValue} />
          </h3>
          <div className="text-lg">
            <ContentSdkRichText field={datasource.text2?.jsonValue} />
          </div>
          <Button asChild={true} className="mt-8">
            <ContentSdkLink field={datasource.link.jsonValue} prefetch={false} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export const FAQ4 = (props: FAQProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-6">
              <ContentSdkText field={datasource.heading?.jsonValue} />
            </h2>
            <div className="text-lg">
              <ContentSdkRichText field={datasource.text?.jsonValue} />
            </div>
          </div>
          <div className="grid gap-12 my-20">
            {datasource.children.results.map((q) => (
              <QuestionItem key={q.id} q={q} type="simple" />
            ))}
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">
              <ContentSdkText field={datasource.heading2?.jsonValue} />
            </h3>
            <div className="text-lg">
              <ContentSdkRichText field={datasource.text2?.jsonValue} />
            </div>
            <Button asChild={true} className="mt-8">
              <ContentSdkLink field={datasource.link.jsonValue} prefetch={false} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const FAQ5 = (props: FAQProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="grid gap-x-20 gap-y-12 md:grid-cols-2">
          <div>
            <h2 className="text-5xl font-bold mb-6">
              <ContentSdkText field={datasource.heading?.jsonValue} />
            </h2>
            <div className="text-lg">
              <ContentSdkRichText field={datasource.text?.jsonValue} />
            </div>
            <Button asChild={true} className="mt-8">
              <ContentSdkLink field={datasource.link.jsonValue} prefetch={false} />
            </Button>
          </div>
          <div>
            <div className="grid gap-12">
              {datasource.children.results.map((q) => (
                <QuestionItem key={q.id} q={q} type="simple" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const FAQ6 = (props: FAQProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div className="text-lg">
            <ContentSdkRichText field={datasource.text?.jsonValue} />
          </div>
        </div>
        <div className="my-20">
          {datasource.children.results.map((q) => (
            <QuestionItem key={q.id} q={q} type="bordered" />
          ))}
        </div>
        <div className="max-w-3xl">
          <h3 className="text-3xl font-bold mb-4">
            <ContentSdkText field={datasource.heading2?.jsonValue} />
          </h3>
          <div className="text-lg">
            <ContentSdkRichText field={datasource.text2?.jsonValue} />
          </div>
          <Button asChild={true} className="mt-8">
            <ContentSdkLink field={datasource.link.jsonValue} prefetch={false} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export const FAQ7 = (props: FAQProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div className="text-lg">
            <ContentSdkRichText field={datasource.text?.jsonValue} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-16 my-20">
          {datasource.children.results.map((q) => (
            <QuestionItem key={q.id} q={q} type="simple" showIcon />
          ))}
        </div>
        <div className="max-w-3xl">
          <h3 className="text-3xl font-bold mb-4">
            <ContentSdkText field={datasource.heading2?.jsonValue} />
          </h3>
          <div className="text-lg">
            <ContentSdkRichText field={datasource.text2?.jsonValue} />
          </div>
          <Button asChild={true} className="mt-8">
            <ContentSdkLink field={datasource.link.jsonValue} prefetch={false} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export const FAQ8 = (props: FAQProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div className="text-lg">
            <ContentSdkRichText field={datasource.text?.jsonValue} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16 my-20">
          {datasource.children.results.map((q) => (
            <QuestionItem key={q.id} q={q} type="centered" />
          ))}
        </div>
        <div className="max-w-3xl">
          <h3 className="text-3xl font-bold mb-4">
            <ContentSdkText field={datasource.heading2?.jsonValue} />
          </h3>
          <div className="text-lg">
            <ContentSdkRichText field={datasource.text2?.jsonValue} />
          </div>
          <Button asChild={true} className="mt-8">
            <ContentSdkLink field={datasource.link.jsonValue} prefetch={false} />
          </Button>
        </div>
      </div>
    </section>
  );
};
