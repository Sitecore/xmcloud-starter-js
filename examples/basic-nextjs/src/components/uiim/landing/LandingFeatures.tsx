import React, { JSX } from "react";
import { hasRichText, hasText } from "@/lib/field-utils";
import * as LucideIcons from "lucide-react";
import { Sparkles } from "lucide-react";
import {
  Field,
  RichTextField,
  Text,
  RichText as ContentSdkRichText,
} from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { cn } from "@/lib/utils";
import { SitecoreFrame, SITECORE_GRADIENT } from "@/lib/demo-ui/sitecore-ui";

interface LandingFeaturesRouteFields {
  feature1IconName?: Field<string>;
  feature1Title?: Field<string>;
  feature1Description?: RichTextField;
  feature2IconName?: Field<string>;
  feature2Title?: Field<string>;
  feature2Description?: RichTextField;
  feature3IconName?: Field<string>;
  feature3Title?: Field<string>;
  feature3Description?: RichTextField;
}

const LandingFeaturesDefaultComponent = (): JSX.Element => (
  <div className="component landing-features">
    <div className="component-content">
      <span className="is-empty-hint">LandingFeatures</span>
    </div>
  </div>
);

function getRouteFields(
  page: ComponentProps["page"],
): LandingFeaturesRouteFields | null {
  const fields = page?.layout?.sitecore?.route?.fields;
  return fields ? (fields as unknown as LandingFeaturesRouteFields) : null;
}

function FeatureCard({
  iconName,
  title,
  description,
  isEditing,
}: {
  iconName?: Field<string>;
  title?: Field<string>;
  description?: RichTextField;
  isEditing?: boolean;
}) {
  const iconKey = iconName?.value;
  const hasContent = hasText(title?.value) || hasRichText(description?.value);
  if (!hasContent && !isEditing) return null;

  const Icon =
    iconKey && (LucideIcons as Record<string, unknown>)[iconKey]
      ? (
          LucideIcons as unknown as Record<
            string,
            React.ComponentType<{ className?: string }>
          >
        )[iconKey]
      : Sparkles;

  return (
    <div
      className="flex flex-col items-start rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md"
      data-testid="feature-card"
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-gray-900 text-white">
        <Icon className="h-6 w-6" />
      </div>
      {(hasText(title?.value) || isEditing) && (
        <Text
          field={title}
          tag="h3"
          className="text-lg font-semibold text-gray-900"
          data-testid="feature-title"
        />
      )}
      {(hasRichText(description?.value) || isEditing) && (
        <div
          className="mt-2 text-sm text-gray-600"
          data-testid="feature-description"
        >
          <ContentSdkRichText field={description} />
        </div>
      )}
    </div>
  );
}

function visibleCount(
  fields: LandingFeaturesRouteFields,
  isEditing?: boolean,
): number {
  if (isEditing) return 3;
  return [
    [fields.feature1Title, fields.feature1Description],
    [fields.feature2Title, fields.feature2Description],
    [fields.feature3Title, fields.feature3Description],
  ].filter(
    ([title, description]) =>
      hasText(title?.value) || hasRichText(description?.value),
  ).length;
}

function columns(count: number): string {
  return count === 1
    ? "md:grid-cols-1"
    : count === 2
      ? "md:grid-cols-2"
      : "md:grid-cols-3";
}

export const Default = ({ params, page }: ComponentProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const routeFields = getRouteFields(page);
  if (!routeFields) return <LandingFeaturesDefaultComponent />;
  const count = visibleCount(routeFields, isEditing);
  if (!count)
    return (
      <div
        className={cn("component landing-features", styles)}
        id={RenderingIdentifier}
      />
    );

  return (
    <div
      className={cn("component landing-features", styles)}
      id={RenderingIdentifier}
    >
      <section
        className="bg-gray-50 py-16 md:py-24"
        data-testid="landing-features"
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className={cn("grid gap-6", columns(count))}>
            <FeatureCard
              iconName={routeFields.feature1IconName}
              title={routeFields.feature1Title}
              description={routeFields.feature1Description}
              isEditing={isEditing}
            />
            <FeatureCard
              iconName={routeFields.feature2IconName}
              title={routeFields.feature2Title}
              description={routeFields.feature2Description}
              isEditing={isEditing}
            />
            <FeatureCard
              iconName={routeFields.feature3IconName}
              title={routeFields.feature3Title}
              description={routeFields.feature3Description}
              isEditing={isEditing}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

/* ────────────────────────────────────────────
   Sitecore — sitecore.com card grid: white 9px-radius cards with a hairline
   shadow on a lavender band; gradient icon tile, medium-weight title, and a
   gradient top edge that reveals on hover.
   ──────────────────────────────────────────── */
function SitecoreFeatureCard({
  iconName,
  title,
  description,
  isEditing,
}: {
  iconName?: Field<string>;
  title?: Field<string>;
  description?: RichTextField;
  isEditing?: boolean;
}) {
  const iconKey = iconName?.value;
  const hasContent = hasText(title?.value) || hasRichText(description?.value);
  if (!hasContent && !isEditing) return null;
  const Icon =
    iconKey && (LucideIcons as Record<string, unknown>)[iconKey]
      ? (
          LucideIcons as unknown as Record<
            string,
            React.ComponentType<{ className?: string }>
          >
        )[iconKey]
      : Sparkles;

  return (
    <div
      className="group relative flex flex-col items-start overflow-hidden rounded-[var(--brand-card-radius,9px)] bg-white p-8 shadow-[0_1px_3px_rgba(16,24,40,0.08),0_1px_2px_rgba(16,24,40,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(9,3,66,0.3)] md:p-9"
      data-testid="feature-card"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
        style={{ background: SITECORE_GRADIENT }}
      />
      <div
        className="mb-7 inline-flex h-12 w-12 items-center justify-center rounded-[10px] text-white shadow-[0_8px_20px_-8px_rgba(134,41,255,0.6)]"
        style={{ background: SITECORE_GRADIENT }}
      >
        <Icon className="h-6 w-6" />
      </div>
      {(hasText(title?.value) || isEditing) && (
        <Text
          field={title}
          tag="h3"
          className="font-heading text-[22px] font-medium leading-[1.25] tracking-[-0.01em] md:text-[24px]"
          style={{ color: "var(--brand-fg)" }}
          data-testid="feature-title"
        />
      )}
      {(hasRichText(description?.value) || isEditing) && (
        <div
          className="mt-3 font-body text-[17px] leading-[1.6] [&_p]:m-0"
          style={{ color: "var(--brand-muted-foreground)" }}
          data-testid="feature-description"
        >
          <ContentSdkRichText field={description} />
        </div>
      )}
    </div>
  );
}

export const Sitecore = ({ params, page }: ComponentProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const routeFields = getRouteFields(page);
  if (!routeFields) return <LandingFeaturesDefaultComponent />;
  const count = visibleCount(routeFields, isEditing);
  if (!count)
    return (
      <div
        className={cn("component landing-features", styles)}
        id={RenderingIdentifier}
      />
    );

  return (
    <div
      className={cn("component landing-features", styles)}
      id={RenderingIdentifier}
    >
      <SitecoreFrame
        testId="landing-features"
        style={{ background: "var(--brand-muted)" }}
      >
        <div
          className={cn(
            "grid gap-6 px-2 py-16 md:px-10 md:py-24",
            columns(count),
          )}
        >
          <SitecoreFeatureCard
            iconName={routeFields.feature1IconName}
            title={routeFields.feature1Title}
            description={routeFields.feature1Description}
            isEditing={isEditing}
          />
          <SitecoreFeatureCard
            iconName={routeFields.feature2IconName}
            title={routeFields.feature2Title}
            description={routeFields.feature2Description}
            isEditing={isEditing}
          />
          <SitecoreFeatureCard
            iconName={routeFields.feature3IconName}
            title={routeFields.feature3Title}
            description={routeFields.feature3Description}
            isEditing={isEditing}
          />
        </div>
      </SitecoreFrame>
    </div>
  );
};
