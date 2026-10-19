import type { JSX } from 'react';
import type { Field, RichTextField } from '@sitecore-content-sdk/nextjs';
import { RichText as ContentSdkRichText, Text } from '@sitecore-content-sdk/nextjs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { ArticleContentProps, ArticleContentRouteFields } from './article-content.props';

const hasText = (field?: Field<string>): boolean => Boolean(field?.value);
const hasRichText = (field?: RichTextField): boolean => Boolean(field?.value);

const formatDisplayDate = (raw?: string): string => {
  if (!raw) return '';
  const sitecore = raw.match(/^(\d{4})(\d{2})(\d{2})/);
  const parsed = sitecore
    ? new Date(Date.UTC(Number(sitecore[1]), Number(sitecore[2]) - 1, Number(sitecore[3])))
    : new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(parsed);
};

const ArticleContentEmpty = (): JSX.Element => (
  <div className="component article-content">
    <div className="component-content">
      <span className="is-empty-hint">
        Article Content has no page fields to display. Add Header Title, Summary, or Content on the
        article page.
      </span>
    </div>
  </div>
);

export const Default = ({ params, page }: ArticleContentProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params || {};
  const isEditing = Boolean(page?.mode?.isEditing);
  const fields = (page?.layout?.sitecore?.route?.fields || {}) as ArticleContentRouteFields;
  const {
    Content,
    content,
    pageHeaderTitle,
    pageShortTitle,
    pageSubtitle,
    pageSummary,
    pageTitle,
    pageDisplayDate,
    pageReadTime,
  } = fields;
  const showContentField = params?.ShowContent === '1' || params?.ShowContent?.toLowerCase() === 'true';
  const bodyField = showContentField ? content ?? Content : Content;

  const headingField = hasText(pageHeaderTitle) || isEditing ? pageHeaderTitle : pageTitle;
  const hasHeading = hasText(headingField);
  const showShortTitle = hasText(pageShortTitle) || (isEditing && pageShortTitle !== undefined);
  const showSubtitle = hasText(pageSubtitle) || (isEditing && pageSubtitle !== undefined);
  const showSummary = hasText(pageSummary) || (isEditing && pageSummary !== undefined);
  const showContent = hasRichText(bodyField) || (isEditing && bodyField !== undefined);
  const showDate = hasText(pageDisplayDate) || (isEditing && pageDisplayDate !== undefined);
  const showReadTime = hasText(pageReadTime) || (isEditing && pageReadTime !== undefined);
  const showMeta = showDate || showReadTime;

  if (!hasHeading && !showShortTitle && !showSubtitle && !showSummary && !showContent && !showMeta) {
    return <ArticleContentEmpty />;
  }

  return (
    <article
      className={cn('component article-content', styles)}
      id={RenderingIdentifier || undefined}
      data-testid="article-content"
    >
      <div className="component-content mx-auto max-w-3xl px-4 py-10 @md:px-6 @md:py-14">
        {showShortTitle && (
          <Badge
            variant="secondary"
            className="font-body mb-4 text-xs font-medium tracking-wide uppercase"
          >
            <Text field={pageShortTitle} />
          </Badge>
        )}

        {(hasHeading || isEditing) && (
          <Text
            tag="h1"
            field={headingField}
            className="font-heading text-foreground text-pretty text-3xl font-normal tracking-tight @md:text-5xl"
          />
        )}

        {showSubtitle && (
          <Text
            tag="p"
            field={pageSubtitle}
            className="text-muted-foreground mt-3 text-lg tracking-tight @md:text-xl"
          />
        )}

        {showMeta && (
          <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            {showDate &&
              (isEditing ? (
                <Text field={pageDisplayDate} />
              ) : (
                <time dateTime={pageDisplayDate?.value || undefined}>
                  {formatDisplayDate(pageDisplayDate?.value)}
                </time>
              ))}
            {hasText(pageDisplayDate) && hasText(pageReadTime) && (
              <span aria-hidden="true">•</span>
            )}
            {showReadTime && <Text field={pageReadTime} />}
          </div>
        )}

        {showSummary && (
          <>
            <Separator className="my-6" />
            <Text
              tag="p"
              field={pageSummary}
              className="text-foreground text-pretty text-lg font-medium leading-relaxed tracking-tight @md:text-xl"
            />
          </>
        )}

        {showContent && (
          <div
            className={cn(
              'article-content-body mt-8 text-base leading-relaxed @md:text-lg',
              '[&_h3]:font-heading [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:font-normal',
              '[&_p]:text-foreground [&_p]:mb-4',
              '[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6',
              '[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6',
              '[&_li]:mb-2',
              '[&_strong]:font-semibold',
              '[&_a]:text-primary [&_a]:underline'
            )}
          >
            <ContentSdkRichText field={bodyField} />
          </div>
        )}
      </div>
    </article>
  );
};
