'use client';

import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { Button } from 'shadcd/components/ui/button';
import { useMemo, useState, type JSX } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'shadcd/components/ui/accordion';
import ContentSdkRichText from '@/components/content-sdk-rich-text/ContentSdkRichText';
import { generateFAQPageSchema } from '@/lib/structured-data/schema';
import { StructuredData } from '@/components/structured-data/StructuredData';
import { getDatasource, getFieldValue } from '@/lib/component-props';
import type {
  FAQProps,
  QuestionAccordionItemProps,
  QuestionItemProps,
} from './faq.props';

const normalizeFaqDatasource = (source: FAQProps['fields']) => {
  return getDatasource(source);
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
            <ContentSdkText field={getFieldValue(props.q.question)} />
          </AccordionTrigger>
          <AccordionContent className="text-base pb-6 ps-10">
            <ContentSdkRichText field={getFieldValue(props.q.answer)} />
          </AccordionContent>
        </AccordionItem>
      );
    case 'boxed':
      return (
        <AccordionItem value={props.q.id} className={`border last:border ${props.className}`}>
          <AccordionTrigger className="px-8">
            <ContentSdkText field={getFieldValue(props.q.question)} />
          </AccordionTrigger>
          <AccordionContent className="px-8">
            <ContentSdkRichText field={getFieldValue(props.q.answer)} />
          </AccordionContent>
        </AccordionItem>
      );
    default:
      return (
        <AccordionItem value={props.q.id} className={props.className}>
          <AccordionTrigger>
            <ContentSdkText field={getFieldValue(props.q.question)} />
          </AccordionTrigger>
          <AccordionContent>
            <ContentSdkRichText field={getFieldValue(props.q.answer)} />
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
            <ContentSdkText field={getFieldValue(props.q.question)} />
          </h3>
          <div>
            <ContentSdkRichText field={getFieldValue(props.q.answer)} />
          </div>
        </div>
      );
    case 'centered':
      return (
        <div className="text-center">
          <ContentSdkImage
            field={getFieldValue(props.q.image)}
            width={50}
            height={50}
            className="object-contain mx-auto mb-6"
          />

          <h3 className="text-lg font-bold mb-4">
            <ContentSdkText field={getFieldValue(props.q.question)} />
          </h3>
          <div>
            <ContentSdkRichText field={getFieldValue(props.q.answer)} />
          </div>
        </div>
      );
    default:
      return (
        <div>
          {props.showIcon && (
            <ContentSdkImage
              field={getFieldValue(props.q.image)}
              width={50}
              height={50}
              className="object-contain mb-6"
            />
          )}
          <h3 className="text-lg font-bold mb-4">
            <ContentSdkText field={getFieldValue(props.q.question)} />
          </h3>
          <div>
            <ContentSdkRichText field={getFieldValue(props.q.answer)} />
          </div>
        </div>
      );
  }
};

export const Default = (props: FAQProps): JSX.Element => {
  const datasource = useMemo(() => normalizeFaqDatasource(props.fields), [props.fields]);

  if (!datasource) {
    return <></>;
  }

  // Generate JSON-LD structured data for FAQPage
  const faqSchema = useMemo(() => {
    const faqs: Array<{ question: string; answer: string }> = datasource.children.results.map((q) => ({
      question: String(getFieldValue(q.question)?.value || ''),
      answer: String(getFieldValue(q.answer)?.value || ''),
    }));
    return generateFAQPageSchema(faqs);
  }, [datasource.children.results]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      {/* JSON-LD structured data for FAQPage */}
      {faqSchema && <StructuredData id="faq-schema-default" data={faqSchema} />}
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-6">
              <ContentSdkText field={getFieldValue(datasource.heading)} />
            </h2>
            <div className="text-lg">
              <ContentSdkRichText field={getFieldValue(datasource.text)} />
            </div>
          </div>
          <Accordion type="multiple" className="w-full my-20">
            {datasource.children.results.map((q) => (
              <QuestionAccordionItem key={q.id} q={q} type="bordered" />
            ))}
          </Accordion>
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">
              <ContentSdkText field={getFieldValue(datasource.heading2)} />
            </h3>
            <div className="text-lg">
              <ContentSdkRichText field={getFieldValue(datasource.text2)} />
            </div>
            <Button asChild={true} className="mt-8">
              <ContentSdkLink field={getFieldValue(datasource.link)!} prefetch={false} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const FAQ1 = (props: FAQProps): JSX.Element => {
  const datasource = useMemo(() => normalizeFaqDatasource(props.fields), [props.fields]);
  if (!datasource) {
    return <></>;
  }
  const itemIds = datasource.children.results.map((q) => q.id);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const expandAll = () => setOpenItems(itemIds);
  const collapseAll = () => setOpenItems([]);

  // Generate JSON-LD structured data for FAQPage
  const faqSchema = useMemo(() => {
    const faqs: Array<{ question: string; answer: string }> = datasource.children.results.map((q) => ({
      question: String(getFieldValue(q.question)?.value || ''),
      answer: String(getFieldValue(q.answer)?.value || ''),
    }));
    return generateFAQPageSchema(faqs);
  }, [datasource.children.results]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      {/* JSON-LD structured data for FAQPage */}
      {faqSchema && <StructuredData id="faq-schema-1" data={faqSchema} />}
      <div className="container mx-auto">
        <div>
          <h2 className="text-3xl font-semibold mb-6">
            <ContentSdkText field={getFieldValue(datasource.heading)} />
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
  const datasource = useMemo(() => normalizeFaqDatasource(props.fields), [props.fields]);

  if (!datasource) {
    return <></>;
  }

  // Generate JSON-LD structured data for FAQPage
  const faqSchema = useMemo(() => {
    const faqs: Array<{ question: string; answer: string }> = datasource.children.results.map((q) => ({
      question: String(getFieldValue(q.question)?.value || ''),
      answer: String(getFieldValue(q.answer)?.value || ''),
    }));
    return generateFAQPageSchema(faqs);
  }, [datasource.children.results]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      {/* JSON-LD structured data for FAQPage */}
      {faqSchema && <StructuredData id="faq-schema-2" data={faqSchema} />}
      <div className="container mx-auto">
        <div className="grid gap-x-20 gap-y-12 md:grid-cols-2">
          <div>
            <h2 className="text-5xl font-bold mb-6">
              <ContentSdkText field={getFieldValue(datasource.heading)} />
            </h2>
            <div className="text-lg">
              <ContentSdkRichText field={getFieldValue(datasource.text)} />
            </div>
            <Button asChild={true} className="mt-8">
              <ContentSdkLink field={getFieldValue(datasource.link)!} prefetch={false} />
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
  const datasource = useMemo(() => normalizeFaqDatasource(props.fields), [props.fields]);

  if (!datasource) {
    return <></>;
  }

  // Generate JSON-LD structured data for FAQPage
  const faqSchema = useMemo(() => {
    const faqs: Array<{ question: string; answer: string }> = datasource.children.results.map((q) => ({
      question: String(getFieldValue(q.question)?.value || ''),
      answer: String(getFieldValue(q.answer)?.value || ''),
    }));
    return generateFAQPageSchema(faqs);
  }, [datasource.children.results]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      {/* JSON-LD structured data for FAQPage */}
      {faqSchema && <StructuredData id="faq-schema-3" data={faqSchema} />}
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={getFieldValue(datasource.heading)} />
          </h2>
          <div className="text-lg">
            <ContentSdkRichText field={getFieldValue(datasource.text)} />
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
            <ContentSdkText field={getFieldValue(datasource.heading2)} />
          </h3>
          <div className="text-lg">
            <ContentSdkRichText field={getFieldValue(datasource.text2)} />
          </div>
          <Button asChild={true} className="mt-8">
            <ContentSdkLink field={getFieldValue(datasource.link)!} prefetch={false} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export const FAQ4 = (props: FAQProps): JSX.Element => {
  const datasource = useMemo(() => normalizeFaqDatasource(props.fields), [props.fields]);

  if (!datasource) {
    return <></>;
  }

  // Generate JSON-LD structured data for FAQPage
  const faqSchema = useMemo(() => {
    const faqs: Array<{ question: string; answer: string }> = datasource.children.results.map((q) => ({
      question: String(getFieldValue(q.question)?.value || ''),
      answer: String(getFieldValue(q.answer)?.value || ''),
    }));
    return generateFAQPageSchema(faqs);
  }, [datasource.children.results]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      {/* JSON-LD structured data for FAQPage */}
      {faqSchema && <StructuredData id="faq-schema-4" data={faqSchema} />}
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-6">
              <ContentSdkText field={getFieldValue(datasource.heading)} />
            </h2>
            <div className="text-lg">
              <ContentSdkRichText field={getFieldValue(datasource.text)} />
            </div>
          </div>
          <div className="grid gap-12 my-20">
            {datasource.children.results.map((q) => (
              <QuestionItem key={q.id} q={q} type="simple" />
            ))}
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">
              <ContentSdkText field={getFieldValue(datasource.heading2)} />
            </h3>
            <div className="text-lg">
              <ContentSdkRichText field={getFieldValue(datasource.text2)} />
            </div>
            <Button asChild={true} className="mt-8">
              <ContentSdkLink field={getFieldValue(datasource.link)!} prefetch={false} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const FAQ5 = (props: FAQProps): JSX.Element => {
  const datasource = useMemo(() => normalizeFaqDatasource(props.fields), [props.fields]);

  if (!datasource) {
    return <></>;
  }

  // Generate JSON-LD structured data for FAQPage
  const faqSchema = useMemo(() => {
    const faqs: Array<{ question: string; answer: string }> = datasource.children.results.map((q) => ({
      question: String(getFieldValue(q.question)?.value || ''),
      answer: String(getFieldValue(q.answer)?.value || ''),
    }));
    return generateFAQPageSchema(faqs);
  }, [datasource.children.results]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      {/* JSON-LD structured data for FAQPage */}
      {faqSchema && <StructuredData id="faq-schema-5" data={faqSchema} />}
      <div className="container mx-auto">
        <div className="grid gap-x-20 gap-y-12 md:grid-cols-2">
          <div>
            <h2 className="text-5xl font-bold mb-6">
              <ContentSdkText field={getFieldValue(datasource.heading)} />
            </h2>
            <div className="text-lg">
              <ContentSdkRichText field={getFieldValue(datasource.text)} />
            </div>
            <Button asChild={true} className="mt-8">
              <ContentSdkLink field={getFieldValue(datasource.link)!} prefetch={false} />
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
  const datasource = useMemo(() => normalizeFaqDatasource(props.fields), [props.fields]);

  if (!datasource) {
    return <></>;
  }

  // Generate JSON-LD structured data for FAQPage
  const faqSchema = useMemo(() => {
    const faqs: Array<{ question: string; answer: string }> = datasource.children.results.map((q) => ({
      question: String(getFieldValue(q.question)?.value || ''),
      answer: String(getFieldValue(q.answer)?.value || ''),
    }));
    return generateFAQPageSchema(faqs);
  }, [datasource.children.results]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      {/* JSON-LD structured data for FAQPage */}
      {faqSchema && <StructuredData id="faq-schema-6" data={faqSchema} />}
      <div className="container mx-auto">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={getFieldValue(datasource.heading)} />
          </h2>
          <div className="text-lg">
            <ContentSdkRichText field={getFieldValue(datasource.text)} />
          </div>
        </div>
        <div className="my-20">
          {datasource.children.results.map((q) => (
            <QuestionItem key={q.id} q={q} type="bordered" />
          ))}
        </div>
        <div className="max-w-3xl">
          <h3 className="text-3xl font-bold mb-4">
            <ContentSdkText field={getFieldValue(datasource.heading2)} />
          </h3>
          <div className="text-lg">
            <ContentSdkRichText field={getFieldValue(datasource.text2)} />
          </div>
          <Button asChild={true} className="mt-8">
            <ContentSdkLink field={getFieldValue(datasource.link)!} prefetch={false} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export const FAQ7 = (props: FAQProps): JSX.Element => {
  const datasource = useMemo(() => normalizeFaqDatasource(props.fields), [props.fields]);

  if (!datasource) {
    return <></>;
  }

  // Generate JSON-LD structured data for FAQPage
  const faqSchema = useMemo(() => {
    const faqs: Array<{ question: string; answer: string }> = datasource.children.results.map((q) => ({
      question: String(getFieldValue(q.question)?.value || ''),
      answer: String(getFieldValue(q.answer)?.value || ''),
    }));
    return generateFAQPageSchema(faqs);
  }, [datasource.children.results]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      {/* JSON-LD structured data for FAQPage */}
      {faqSchema && <StructuredData id="faq-schema-7" data={faqSchema} />}
      <div className="container mx-auto">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={getFieldValue(datasource.heading)} />
          </h2>
          <div className="text-lg">
            <ContentSdkRichText field={getFieldValue(datasource.text)} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-16 my-20">
          {datasource.children.results.map((q) => (
            <QuestionItem key={q.id} q={q} type="simple" showIcon />
          ))}
        </div>
        <div className="max-w-3xl">
          <h3 className="text-3xl font-bold mb-4">
            <ContentSdkText field={getFieldValue(datasource.heading2)} />
          </h3>
          <div className="text-lg">
            <ContentSdkRichText field={getFieldValue(datasource.text2)} />
          </div>
          <Button asChild={true} className="mt-8">
            <ContentSdkLink field={getFieldValue(datasource.link)!} prefetch={false} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export const FAQ8 = (props: FAQProps): JSX.Element => {
  const datasource = useMemo(() => normalizeFaqDatasource(props.fields), [props.fields]);

  if (!datasource) {
    return <></>;
  }

  // Generate JSON-LD structured data for FAQPage
  const faqSchema = useMemo(() => {
    const faqs: Array<{ question: string; answer: string }> = datasource.children.results.map((q) => ({
      question: String(getFieldValue(q.question)?.value || ''),
      answer: String(getFieldValue(q.answer)?.value || ''),
    }));
    return generateFAQPageSchema(faqs);
  }, [datasource.children.results]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      {/* JSON-LD structured data for FAQPage */}
      {faqSchema && <StructuredData id="faq-schema-8" data={faqSchema} />}
      <div className="container mx-auto">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={getFieldValue(datasource.heading)} />
          </h2>
          <div className="text-lg">
            <ContentSdkRichText field={getFieldValue(datasource.text)} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16 my-20">
          {datasource.children.results.map((q) => (
            <QuestionItem key={q.id} q={q} type="centered" />
          ))}
        </div>
        <div className="max-w-3xl">
          <h3 className="text-3xl font-bold mb-4">
            <ContentSdkText field={getFieldValue(datasource.heading2)} />
          </h3>
          <div className="text-lg">
            <ContentSdkRichText field={getFieldValue(datasource.text2)} />
          </div>
          <Button asChild={true} className="mt-8">
            <ContentSdkLink field={getFieldValue(datasource.link)!} prefetch={false} />
          </Button>
        </div>
      </div>
    </section>
  );
};

