import React, { JSX } from "react";
import { hasText } from "@/lib/field-utils";
import { Field, Text } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { cn } from "@/lib/utils";
import { SitecoreFrame, gradientText } from "@/lib/demo-ui/sitecore-ui";

interface LandingStatsRouteFields {
  stat1Number?: Field<string>;
  stat1Label?: Field<string>;
  stat2Number?: Field<string>;
  stat2Label?: Field<string>;
  stat3Number?: Field<string>;
  stat3Label?: Field<string>;
}

const LandingStatsDefaultComponent = (): JSX.Element => (
  <div className="component landing-stats">
    <div className="component-content">
      <span className="is-empty-hint">LandingStats</span>
    </div>
  </div>
);

function getRouteFields(
  page: ComponentProps["page"],
): LandingStatsRouteFields | null {
  const fields = page?.layout?.sitecore?.route?.fields;
  return fields ? (fields as unknown as LandingStatsRouteFields) : null;
}

function StatTile({
  number,
  label,
  isEditing,
}: {
  number?: Field<string>;
  label?: Field<string>;
  isEditing?: boolean;
}) {
  if (!hasText(number?.value) && !hasText(label?.value) && !isEditing)
    return null;
  return hasText(number?.value) || isEditing || hasText(label?.value) ? (
    <div className="text-center" data-testid="stat-tile">
      {(hasText(number?.value) || isEditing) && (
        <Text
          field={number}
          tag="p"
          className="text-5xl font-bold tracking-tight text-gray-900 md:text-6xl"
          data-testid="stat-number"
        />
      )}
      {(hasText(label?.value) || isEditing) && (
        <Text
          field={label}
          tag="p"
          className="mt-2 text-sm font-medium uppercase tracking-wider text-gray-600"
          data-testid="stat-label"
        />
      )}
    </div>
  ) : null;
}

function visibleCount(
  fields: LandingStatsRouteFields,
  isEditing?: boolean,
): number {
  if (isEditing) return 3;
  return [
    [fields.stat1Number, fields.stat1Label],
    [fields.stat2Number, fields.stat2Label],
    [fields.stat3Number, fields.stat3Label],
  ].filter(([number, label]) => hasText(number?.value) || hasText(label?.value))
    .length;
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
  if (!routeFields) return <LandingStatsDefaultComponent />;
  const count = visibleCount(routeFields, isEditing);
  if (!count)
    return (
      <div
        className={cn("component landing-stats", styles)}
        id={RenderingIdentifier}
      />
    );

  return (
    <div
      className={cn("component landing-stats", styles)}
      id={RenderingIdentifier}
    >
      <section className="bg-white py-16 md:py-20" data-testid="landing-stats">
        <div className="mx-auto max-w-5xl px-4">
          <div className={cn("grid gap-12", columns(count))}>
            <StatTile
              number={routeFields.stat1Number}
              label={routeFields.stat1Label}
              isEditing={isEditing}
            />
            <StatTile
              number={routeFields.stat2Number}
              label={routeFields.stat2Label}
              isEditing={isEditing}
            />
            <StatTile
              number={routeFields.stat3Number}
              label={routeFields.stat3Label}
              isEditing={isEditing}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

/* ────────────────────────────────────────────
   Sitecore — big red→violet gradient numbers over sentence-case labels,
   separated by hairline column rules inside the framed content column.
   ──────────────────────────────────────────── */
function SitecoreStatTile({
  number,
  label,
  isEditing,
}: {
  number?: Field<string>;
  label?: Field<string>;
  isEditing?: boolean;
}) {
  if (!hasText(number?.value) && !hasText(label?.value) && !isEditing)
    return null;
  return (
    <div
      className="flex flex-col items-center px-6 py-10 text-center md:py-4"
      data-testid="stat-tile"
    >
      {(hasText(number?.value) || isEditing) && (
        <Text
          field={number}
          tag="p"
          className={cn(
            "m-0 pb-1 font-heading text-[56px] font-medium leading-none tracking-[-0.04em] md:text-[64px] lg:text-[72px]",
            gradientText,
          )}
          data-testid="stat-number"
        />
      )}
      {(hasText(label?.value) || isEditing) && (
        <Text
          field={label}
          tag="p"
          className="mt-4 max-w-[280px] font-body text-[17px] leading-[1.5] text-balance"
          style={{ color: "var(--brand-muted-foreground)" }}
          data-testid="stat-label"
        />
      )}
    </div>
  );
}

export const Sitecore = ({ params, page }: ComponentProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const routeFields = getRouteFields(page);
  if (!routeFields) return <LandingStatsDefaultComponent />;
  const count = visibleCount(routeFields, isEditing);
  if (!count)
    return (
      <div
        className={cn("component landing-stats", styles)}
        id={RenderingIdentifier}
      />
    );

  return (
    <div
      className={cn("component landing-stats", styles)}
      id={RenderingIdentifier}
    >
      <SitecoreFrame
        testId="landing-stats"
        style={{ background: "var(--brand-bg)" }}
      >
        <div
          className={cn(
            "grid divide-y divide-[var(--brand-border)] px-2 py-8 md:divide-x md:divide-y-0 md:px-10 md:py-20",
            columns(count),
          )}
        >
          <SitecoreStatTile
            number={routeFields.stat1Number}
            label={routeFields.stat1Label}
            isEditing={isEditing}
          />
          <SitecoreStatTile
            number={routeFields.stat2Number}
            label={routeFields.stat2Label}
            isEditing={isEditing}
          />
          <SitecoreStatTile
            number={routeFields.stat3Number}
            label={routeFields.stat3Label}
            isEditing={isEditing}
          />
        </div>
      </SitecoreFrame>
    </div>
  );
};
