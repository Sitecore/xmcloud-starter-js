"use client";

import React, { JSX, useState } from "react";
import { hasRichText, hasText } from "@/lib/field-utils";
import { ChevronDown, CircleMinus, CirclePlus } from "lucide-react";
import {
  Field,
  RichTextField,
  Text,
  RichText as ContentSdkRichText,
} from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { cn } from "@/lib/utils";
import { SitecoreFrame } from "@/lib/demo-ui/sitecore-ui";

interface LandingFAQRouteFields {
  faq1Question?: Field<string>;
  faq1Answer?: RichTextField;
  faq2Question?: Field<string>;
  faq2Answer?: RichTextField;
  faq3Question?: Field<string>;
  faq3Answer?: RichTextField;
  faq4Question?: Field<string>;
  faq4Answer?: RichTextField;
  faq5Question?: Field<string>;
  faq5Answer?: RichTextField;
}

const LandingFAQDefaultComponent = (): JSX.Element => (
  <div className="component landing-faq">
    <div className="component-content">
      <span className="is-empty-hint">LandingFAQ</span>
    </div>
  </div>
);

function getRouteFields(
  page: ComponentProps["page"],
): LandingFAQRouteFields | null {
  const fields = page?.layout?.sitecore?.route?.fields;
  return fields ? (fields as unknown as LandingFAQRouteFields) : null;
}

function FAQItem({
  index,
  question,
  answer,
  isOpen,
  onToggle,
  isEditing,
}: {
  index: number;
  question?: Field<string>;
  answer?: RichTextField;
  isOpen: boolean;
  onToggle: () => void;
  isEditing?: boolean;
}) {
  if (!isEditing && (!hasText(question?.value) || !hasRichText(answer?.value)))
    return null;
  return (
    <div className="border-b border-gray-200" data-testid={`faq-item-${index}`}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={isOpen}
      >
        {(hasText(question?.value) || isEditing) && (
          <Text
            field={question}
            tag="span"
            className="text-base font-semibold text-gray-900 md:text-lg"
            data-testid="faq-question"
          />
        )}
        <ChevronDown
          className={cn(
            "h-5 w-5 flex-shrink-0 text-gray-500 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>
      {isOpen && (hasRichText(answer?.value) || isEditing) && (
        <div
          className="pb-5 pr-10 text-sm text-gray-600 md:text-base"
          data-testid="faq-answer"
        >
          <ContentSdkRichText field={answer} />
        </div>
      )}
    </div>
  );
}

function hasFAQ(fields: LandingFAQRouteFields): boolean {
  return [
    [fields.faq1Question, fields.faq1Answer],
    [fields.faq2Question, fields.faq2Answer],
    [fields.faq3Question, fields.faq3Answer],
    [fields.faq4Question, fields.faq4Answer],
    [fields.faq5Question, fields.faq5Answer],
  ].some(
    ([question, answer]) =>
      hasText(question?.value) && hasRichText(answer?.value),
  );
}

export const Default = ({ params, page }: ComponentProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const routeFields = getRouteFields(page);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!routeFields) return <LandingFAQDefaultComponent />;
  if (!isEditing && !hasFAQ(routeFields))
    return (
      <div
        className={cn("component landing-faq", styles)}
        id={RenderingIdentifier}
      />
    );

  const items = [
    { question: routeFields.faq1Question, answer: routeFields.faq1Answer },
    { question: routeFields.faq2Question, answer: routeFields.faq2Answer },
    { question: routeFields.faq3Question, answer: routeFields.faq3Answer },
    { question: routeFields.faq4Question, answer: routeFields.faq4Answer },
    { question: routeFields.faq5Question, answer: routeFields.faq5Answer },
  ];

  return (
    <div
      className={cn("component landing-faq", styles)}
      id={RenderingIdentifier}
    >
      <section className="bg-white py-16 md:py-24" data-testid="landing-faq">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Frequently asked questions
          </h2>
          <div className="border-t border-gray-200">
            {items.map((item, i) => (
              <FAQItem
                key={i}
                index={i + 1}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                isEditing={isEditing}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

/* ────────────────────────────────────────────
   Sitecore — sitecore.com FAQ: stacked white cards with a soft shadow on a
   lavender band; ⊕/⊖ icons, open card gets a violet border + violet question,
   answers expand with a height transition. In the editor every answer is open
   so authors can edit them in place.
   ──────────────────────────────────────────── */
function SitecoreFAQItem({
  index,
  question,
  answer,
  isOpen,
  onToggle,
  isEditing,
  idPrefix,
}: {
  index: number;
  question?: Field<string>;
  answer?: RichTextField;
  isOpen: boolean;
  onToggle: () => void;
  isEditing?: boolean;
  idPrefix: string;
}) {
  if (!isEditing && (!hasText(question?.value) || !hasRichText(answer?.value)))
    return null;
  const open = isOpen || !!isEditing;
  const panelId = `${idPrefix}-faq-panel-${index}`;
  const Icon = open ? CircleMinus : CirclePlus;

  return (
    <div
      className={cn(
        "rounded-[6px] border bg-white shadow-[0_1px_4px_rgba(16,24,40,0.06)] transition-colors",
        open
          ? "border-[var(--brand-accent)]"
          : "border-transparent hover:border-[var(--brand-border)]",
      )}
      data-testid={`faq-item-${index}`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left md:px-7"
        aria-expanded={open}
        aria-controls={panelId}
      >
        {(hasText(question?.value) || isEditing) && (
          <Text
            field={question}
            tag="span"
            className="font-body text-[18px] leading-[1.4] transition-colors md:text-[20px]"
            style={{ color: open ? "var(--brand-accent)" : "var(--brand-fg)" }}
            data-testid="faq-question"
          />
        )}
        <Icon
          aria-hidden="true"
          strokeWidth={1.25}
          className="h-6 w-6 shrink-0 transition-colors"
          style={{
            color: open
              ? "var(--brand-accent)"
              : "var(--brand-muted-foreground)",
          }}
        />
      </button>
      {(hasRichText(answer?.value) || isEditing) && (
        <div
          id={panelId}
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-out",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
          inert={!open}
        >
          <div className="overflow-hidden">
            <div
              className="px-6 pb-6 pr-12 font-body text-[17px] leading-[1.65] md:px-7 md:pr-20 [&_a]:text-[var(--brand-accent)] [&_a]:underline-offset-2 hover:[&_a]:underline [&_p]:m-0 [&_p+p]:mt-3"
              style={{ color: "var(--brand-fg)" }}
              data-testid="faq-answer"
            >
              <ContentSdkRichText field={answer} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const Sitecore = ({ params, page }: ComponentProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const routeFields = getRouteFields(page);
  const [openIndex, setOpenIndex] = useState<number | null>(-1);

  if (!routeFields) return <LandingFAQDefaultComponent />;
  if (!isEditing && !hasFAQ(routeFields))
    return (
      <div
        className={cn("component landing-faq", styles)}
        id={RenderingIdentifier}
      />
    );

  const items = [
    { question: routeFields.faq1Question, answer: routeFields.faq1Answer },
    { question: routeFields.faq2Question, answer: routeFields.faq2Answer },
    { question: routeFields.faq3Question, answer: routeFields.faq3Answer },
    { question: routeFields.faq4Question, answer: routeFields.faq4Answer },
    { question: routeFields.faq5Question, answer: routeFields.faq5Answer },
  ];
  const idPrefix = RenderingIdentifier || "landing";
  const firstPopulated = items.findIndex(
    (item) => hasText(item.question?.value) && hasRichText(item.answer?.value),
  );
  const activeIndex = openIndex === -1 ? firstPopulated : openIndex;

  return (
    <div
      className={cn("component landing-faq", styles)}
      id={RenderingIdentifier}
    >
      <SitecoreFrame
        testId="landing-faq"
        style={{ background: "var(--brand-muted)" }}
      >
        <div className="mx-auto flex max-w-[1010px] flex-col gap-3.5 px-0 py-16 md:px-10 md:py-24">
          {items.map((item, i) => (
            <SitecoreFAQItem
              key={i}
              index={i + 1}
              question={item.question}
              answer={item.answer}
              isOpen={activeIndex === i}
              onToggle={() => setOpenIndex(activeIndex === i ? null : i)}
              isEditing={isEditing}
              idPrefix={idPrefix}
            />
          ))}
        </div>
      </SitecoreFrame>
    </div>
  );
};
