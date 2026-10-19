'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  Text as ContentSdkText,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  type LinkField,
} from '@sitecore-content-sdk/nextjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { getDatasource, getFieldValue } from '@/lib/component-props';
import { cn } from '@/lib/utils';
import type { MultiPromoProps, PromoItemProps, SimplePromoFields } from './multi-promo.props';

const TEXT_JUSTIFIED_CLASS = 'text-justified';

const isTextJustifiedFromParams = (params?: { [key: string]: string }): boolean => {
  const alignment = params?.TextAlignment?.trim();
  if (alignment === 'Text Justified') {
    return true;
  }
  if (alignment === 'Text Centered') {
    return false;
  }

  return Boolean(
    params?.styles
      ?.split(/[\s|]+/)
      .map((token) => token.trim())
      .includes(TEXT_JUSTIFIED_CLASS)
  );
};

const useTextJustified = (params?: { [key: string]: string }) => {
  const ref = useRef<HTMLElement | null>(null);
  const fromParams = isTextJustifiedFromParams(params);
  const [fromDom, setFromDom] = useState(fromParams);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      setFromDom(fromParams);
      return;
    }

    const sync = () =>
      setFromDom(element.classList.contains(TEXT_JUSTIFIED_CLASS) || fromParams);

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(element, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [fromParams]);

  return { ref, isTextJustified: fromParams || fromDom };
};

const PromoItem = ({ isHorizontal, ...promo }: PromoItemProps) => {
  const { image, heading, description, link } = promo ?? {};
  const linkField = getFieldValue(link);

  return (
    <div className={`grid gap-8 ${isHorizontal ? 'lg:grid-cols-[1fr_2fr]' : ''}`}>
      <ContentSdkImage
        field={getFieldValue(image)}
        className="w-full h-full aspect-square object-cover shadow-2xl"
      />
      <div>
        <h3 className="text-xl lg:text-2xl mb-2 uppercase">
          <ContentSdkText field={getFieldValue(heading)} />
        </h3>
        <p className="lg:text-lg mb-2">
          <ContentSdkText field={getFieldValue(description)} />
        </p>
        {linkField && <ContentSdkLink field={linkField} className="btn btn-ghost" />}
      </div>
    </div>
  );
};

const parentBasedGridClasses =
  'grid lg:[.multipromo-2-3_&]:grid-cols-[2fr_3fr] lg:[.multipromo-3-2_&]:grid-cols-[3fr_2fr] lg:grid-cols-[1fr_1fr] gap-14';
const parentBasedGridItemClasses =
  '[.multipromo-centered_&]:items-center [.bg-gradient_&]:text-white items-start';

const multiPromoHeaderClass = (isTextJustified: boolean) =>
  cn(
    'multipromo-header',
    isTextJustified
      ? 'max-w-none text-left lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-x-12'
      : 'mx-auto max-w-3xl text-center'
  );

export const Default = (props: MultiPromoProps) => {
  const datasource = useMemo(() => getDatasource(props.fields), [props.fields]);
  const { ref, isTextJustified } = useTextJustified(props.params);

  if (datasource) {
    return (
      <section
        ref={ref}
        className={cn(
          'relative',
          props.params?.styles,
          isTextJustified && TEXT_JUSTIFIED_CLASS
        )}
        data-class-change
      >
        <div className="container mx-auto px-4 py-16">
          <div className={multiPromoHeaderClass(isTextJustified)} data-testid="multipromo-header">
            <div className="multipromo-header-title">
              <h2 className="mb-6 text-2xl lg:text-5xl uppercase">
                <ContentSdkText field={getFieldValue(datasource?.title)} />
              </h2>
            </div>
            <p
              className={cn(
                'multipromo-header-description text-lg',
                isTextJustified && 'lg:mt-0'
              )}
            >
              <ContentSdkText field={getFieldValue(datasource?.description)} />
            </p>
          </div>
          <div className={`${parentBasedGridClasses} ${parentBasedGridItemClasses} mt-12`}>
            {datasource?.children?.results?.filter(Boolean).map((promo) => {
              return <PromoItem key={promo?.id} {...promo} />;
            }) || null}
          </div>
        </div>
      </section>
    );
  }
  return <NoDataFallback componentName="MultiPromo" />;
};

export const Stacked = (props: MultiPromoProps) => {
  const datasource = useMemo(() => getDatasource(props.fields), [props.fields]);

  if (datasource) {
    return (
      <section
        className={`relative ${props.params?.styles || ''} overflow-hidden`}
        data-class-change
      >
        <span className="absolute top-1/3 left-1/3 [.multipromo-3-2_&]:-left-1/3 w-screen h-64 bg-primary opacity-50 blur-[400px] -rotate-15 [.multipromo-3-2_&]:rotate-15 z-0"></span>
        <div className="relative container mx-auto px-4 py-16 z-10">
          <div className={`${parentBasedGridClasses}`}>
            <div className="lg:[.multipromo-3-2_&]:col-start-1 lg:[.multipromo-2-3_&]:col-start-2 lg:col-start-2 [.multipromo-2-3_&]:text-right">
              <h2 className="mb-6 text-2xl lg:text-5xl uppercase">
                <ContentSdkText field={getFieldValue(datasource?.title)} />
              </h2>
              <p className="text-lg">
                <ContentSdkText field={getFieldValue(datasource?.description)} />
              </p>
            </div>
          </div>
          <div className={`${parentBasedGridClasses} ${parentBasedGridItemClasses} mt-30`}>
            {datasource?.children?.results?.filter(Boolean).map((promo) => {
              return (
                <div
                  key={promo?.id}
                  className="lg:odd:-mt-8 lg:[.multipromo-3-2_&]:even:-mt-8 lg:[.multipromo-3-2_&]:odd:mt-0"
                >
                  <PromoItem {...promo} />
                </div>
              );
            }) || null}
          </div>
        </div>
      </section>
    );
  }
  return <NoDataFallback componentName="MultiPromo" />;
};

export const SingleColumn = (props: MultiPromoProps) => {
  const datasource = useMemo(() => getDatasource(props.fields), [props.fields]);

  if (datasource) {
    return (
      <section className={`relative ${props.params?.styles || ''}`} data-class-change>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mb-16">
            <h2 className="mb-6 text-2xl lg:text-5xl uppercase">
              <ContentSdkText field={getFieldValue(datasource?.title)} />
            </h2>
            <p className="text-lg">
              <ContentSdkText field={getFieldValue(datasource?.description)} />
            </p>
          </div>
          <div className="grid gap-14">
            {datasource?.children?.results?.filter(Boolean).map((promo) => {
              return <PromoItem key={promo?.id} {...promo} isHorizontal />;
            }) || null}
          </div>
        </div>
      </section>
    );
  }
  return <NoDataFallback componentName="MultiPromo" />;
};

const FlexColumnCard = (promo: PromoItemProps) => {
  const { image, heading, description, link } = promo ?? {};
  const imageField = getFieldValue(image);
  const headingField = getFieldValue(heading);
  const descriptionField = getFieldValue(description);
  const linkField = getFieldValue(link);
  const hasLink = Boolean(linkField?.value?.href);
  const hasDescription = Boolean(descriptionField?.value);

  return (
    <article
      className="group relative flex h-full min-h-[22rem] flex-col overflow-hidden bg-primary"
      data-testid="multipromo-flexcolumn-card"
    >
      <ContentSdkImage
        field={imageField}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out group-focus-within:opacity-30 group-hover:opacity-30 motion-reduce:transition-none"
      />
      <div className="relative z-10 mt-auto bg-primary px-6 py-5 transition-colors duration-300 ease-out group-focus-within:bg-primary/90 group-hover:bg-primary/90 motion-reduce:transition-none">
        <h3 className="max-w-[14ch] text-xl font-bold uppercase leading-tight tracking-wide text-primary-foreground">
          <ContentSdkText field={headingField} />
        </h3>
        <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity,margin] duration-300 ease-out group-focus-within:mt-3 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100 group-hover:mt-3 group-hover:grid-rows-[1fr] group-hover:opacity-100 motion-reduce:transition-none">
          <div className="overflow-hidden">
            {hasDescription && (
              <p className="text-sm leading-relaxed text-primary-foreground/90 md:text-base">
                <ContentSdkText field={descriptionField} />
              </p>
            )}
            {linkField && hasLink && (
              <ContentSdkLink
                field={linkField}
                className="mt-4 inline-flex items-center justify-center bg-background px-5 py-2 text-sm font-bold uppercase tracking-wide text-primary no-underline hover:bg-background/90"
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export const FlexColumn = (props: MultiPromoProps) => {
  const datasource = useMemo(() => getDatasource(props.fields), [props.fields]);
  const { ref, isTextJustified } = useTextJustified(props.params);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const items = datasource?.children?.results?.filter(Boolean) ?? [];

  const handleScrollerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const node = scrollerRef.current;
    if (!node) return;

    const step = Math.max(node.clientWidth * 0.7, 240);
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      node.scrollBy({ left: step, behavior: 'smooth' });
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      node.scrollBy({ left: -step, behavior: 'smooth' });
    } else if (event.key === 'Home') {
      event.preventDefault();
      node.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (event.key === 'End') {
      event.preventDefault();
      node.scrollTo({ left: node.scrollWidth, behavior: 'smooth' });
    }
  };

  if (datasource) {
    return (
      <section
        ref={ref}
        className={cn(
          'relative bg-background',
          props.params?.styles,
          isTextJustified && TEXT_JUSTIFIED_CLASS
        )}
        data-class-change
        data-testid="multipromo-flexcolumn"
      >
        <div className="container mx-auto px-4 py-16">
          <div className={multiPromoHeaderClass(isTextJustified)} data-testid="multipromo-header">
            <div className="multipromo-header-title">
              <h2 className="text-3xl font-bold tracking-tight text-dark md:text-5xl">
                <ContentSdkText field={getFieldValue(datasource?.title)} />
              </h2>
              <div
                aria-hidden="true"
                className={cn(
                  'multipromo-header-underline mt-5 h-1 w-12 bg-brand-red',
                  isTextJustified ? 'ml-0 mr-auto' : 'mx-auto'
                )}
                data-testid="multipromo-flexcolumn-underline"
              />
            </div>
            <p
              className={cn(
                'multipromo-header-description text-base leading-relaxed text-foreground md:text-lg',
                isTextJustified ? 'mt-6 max-w-none lg:mt-0' : 'mx-auto mt-6 max-w-2xl'
              )}
            >
              <ContentSdkText field={getFieldValue(datasource?.description)} />
            </p>
          </div>
          <div
            ref={scrollerRef}
            tabIndex={0}
            role="region"
            aria-label="Promo cards"
            onKeyDown={handleScrollerKeyDown}
            data-testid="multipromo-flexcolumn-scroller"
            className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-2 outline-none focus-visible:ring-2 focus-visible:ring-ring [scrollbar-width:thin]"
          >
            {items.map((promo) => (
              <div
                key={promo?.id}
                className={cn(
                  'w-[min(22rem,80vw)] shrink-0 snap-start',
                  items.length === 1 && 'mx-auto',
                  items.length === 2 && 'sm:w-[calc((100%-1.5rem)/2)]',
                  items.length >= 3 && 'lg:w-[calc((100%-3rem)/3)]'
                )}
              >
                <FlexColumnCard {...promo} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="MultiPromo" />;
};

const visibleColumnCount = (params?: { [key: string]: string }) => {
  const match = params?.numColumns?.match(/\d+/);
  const parsed = match ? Number.parseInt(match[0], 10) : 3;
  return parsed > 0 ? parsed : 3;
};

const isTextOverlayFromParams = (params?: { [key: string]: string }) => {
  const flag = params?.TextOverlay?.trim().toLowerCase();
  if (flag === '1' || flag === 'true') {
    return true;
  }

  return Boolean(
    params?.styles
      ?.split(/[\s|]+/)
      .map((token) => token.trim().toLowerCase())
      .includes('text-overlay')
  );
};

const CarouselCard = ({
  promo,
  textOverlay,
}: {
  promo: PromoItemProps;
  textOverlay: boolean;
}) => {
  const imageField = getFieldValue(promo.image);
  const headingField = getFieldValue(promo.heading);
  const descriptionField = getFieldValue(promo.description);
  const linkField = getFieldValue(promo.link);
  const linkText = linkField?.value?.text?.trim();
  const descriptionText =
    typeof descriptionField?.value === 'string' ? descriptionField.value.trim() : '';
  const showDescription = Boolean(descriptionText) && descriptionText !== linkText;

  return (
    <article
      className="relative h-full overflow-hidden"
      data-testid="multipromo-carousel-card"
      data-text-overlay={textOverlay ? 'true' : 'false'}
    >
      <ContentSdkImage
        field={imageField}
        className={
          textOverlay
            ? 'aspect-[5/3] h-full w-full object-cover'
            : 'aspect-square w-full object-cover'
        }
      />
      <div
        className={
          textOverlay
            ? 'absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-black'
            : 'pt-4 text-left'
        }
      >
        <h3 className={textOverlay ? 'text-lg font-bold leading-tight' : 'mb-2 text-xl uppercase'}>
          <ContentSdkText field={headingField} />
        </h3>
        {showDescription && (
          <p className={textOverlay ? 'mt-2 text-sm leading-snug' : 'mb-2 lg:text-lg'}>
            <ContentSdkText field={descriptionField} />
          </p>
        )}
        {linkField?.value?.href && (
          <ContentSdkLink
            field={linkField}
            className={
              textOverlay ? 'mt-2 text-sm leading-snug text-black no-underline' : 'btn btn-ghost'
            }
          />
        )}
      </div>
    </article>
  );
};

export const Carousel = (props: MultiPromoProps) => {
  const datasource = useMemo(() => getDatasource(props.fields), [props.fields]);
  const items = datasource?.children?.results?.filter(Boolean) ?? [];
  const columns = visibleColumnCount(props.params);
  const textOverlay = isTextOverlayFromParams(props.params);
  const canSlide = items.length > columns;
  const pageCount = Math.max(1, Math.ceil(items.length / Math.max(columns, 1)));
  const basis = canSlide ? 100 / columns : 100 / Math.max(items.length, 1);
  const [page, setPage] = useState(0);
  const titleField = getFieldValue(datasource?.title);
  const descriptionField = getFieldValue(datasource?.description);

  useEffect(() => {
    setPage(0);
  }, [items.length, columns]);

  if (!datasource) {
    return <NoDataFallback componentName="MultiPromo" />;
  }

  return (
    <section
      className={cn('relative', props.params?.styles)}
      data-class-change
      data-testid="multipromo-carousel"
    >
      <div className="container mx-auto px-4 py-16">
        {(titleField?.value || descriptionField?.value) && (
          <div className="mx-auto mb-10 max-w-3xl text-center">
            {titleField?.value && (
              <h2 className="mb-4 text-2xl uppercase lg:text-5xl">
                <ContentSdkText field={titleField} />
              </h2>
            )}
            {descriptionField?.value && (
              <p className="text-lg">
                <ContentSdkText field={descriptionField} />
              </p>
            )}
          </div>
        )}
        <div className="relative">
          {canSlide && (
            <button
              type="button"
              aria-label="Previous"
              disabled={page === 0}
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              className="absolute top-1/2 left-2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow disabled:opacity-40"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
          )}
          <div className="overflow-hidden">
            <div
              className="flex w-full transition-transform duration-300 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${page * 100}%)` }}
              data-testid="multipromo-carousel-track"
            >
              {items.map((promo) => (
                <div key={promo?.id} className="shrink-0 px-2" style={{ flex: `0 0 ${basis}%` }}>
                  <CarouselCard promo={promo} textOverlay={textOverlay} />
                </div>
              ))}
            </div>
          </div>
          {canSlide && (
            <button
              type="button"
              aria-label="Next"
              data-testid="multipromo-carousel-next"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
              className="absolute top-1/2 right-2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow disabled:opacity-40"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

const COLOR_BAR_COLORS: Record<string, string> = {
  purple: '#8B1E6D',
  magenta: '#991E66',
  orange: '#E36C1E',
  teal: '#0E7C86',
};

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

const resolveButtonColor = (value?: string): string => {
  const token = value?.trim() ?? '';
  const named = COLOR_BAR_COLORS[token.toLowerCase()];
  if (named) return named;
  if (HEX_COLOR.test(token)) return token;
  return COLOR_BAR_COLORS.teal;
};

const ColorBarCard = ({ heading, description, link, buttonColor }: SimplePromoFields) => {
  const linkField = getFieldValue(link);
  const colorField = getFieldValue(buttonColor);
  const color = resolveButtonColor(typeof colorField?.value === 'string' ? colorField.value : '');

  return (
    <article
      className="flex h-full flex-col border border-[#cfc8bc] bg-white"
      data-testid="multipromo-colorbar-card"
    >
      <div className="flex flex-1 flex-col px-6 py-8 text-center">
        <h3 className="text-lg font-semibold uppercase tracking-wide text-[#00778B]">
          <ContentSdkText field={getFieldValue(heading)} />
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-[#5c564e]">
          <ContentSdkText field={getFieldValue(description)} />
        </p>
      </div>
      {linkField?.value?.href ? (
        <ContentSdkLink
          field={linkField}
          className="mt-auto block px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-white no-underline"
          style={{ backgroundColor: color }}
        />
      ) : null}
    </article>
  );
};

const ColorBarGrid = ({ items }: { items: SimplePromoFields[] }) => (
  <div className="grid grid-cols-1 gap-4 @md:grid-cols-3">
    {items.map((promo) => (
      <ColorBarCard key={promo.id} {...promo} />
    ))}
  </div>
);

export const ColorBarCards = (props: MultiPromoProps) => {
  const datasource = useMemo(() => getDatasource(props.fields), [props.fields]);
  const items = datasource?.children?.results?.filter(Boolean) ?? [];

  if (!datasource) {
    return <NoDataFallback componentName="MultiPromo" />;
  }

  return (
    <section
      className={cn('@container px-4 py-8 sm:px-8', props.params?.styles)}
      id={props.params?.RenderingIdentifier}
      data-testid="multipromo-colorbar-cards"
    >
      <ColorBarGrid items={items} />
    </section>
  );
};

export const ColorBarCarousel = (props: MultiPromoProps) => {
  const datasource = useMemo(() => getDatasource(props.fields), [props.fields]);
  const items = datasource?.children?.results?.filter(Boolean) ?? [];
  const columns = 3;
  const canSlide = items.length > columns;
  const pageCount = Math.max(1, Math.ceil(items.length / columns));
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [items.length]);

  if (!datasource) {
    return <NoDataFallback componentName="MultiPromo" />;
  }

  return (
    <section
      className={cn('@container relative px-4 py-8 sm:px-8', props.params?.styles)}
      id={props.params?.RenderingIdentifier}
      data-testid="multipromo-colorbar-carousel"
    >
      {canSlide ? (
        <div className="relative">
          <button
            type="button"
            aria-label="Previous"
            disabled={page === 0}
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            className="absolute top-1/2 left-0 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#00778B] shadow disabled:opacity-40"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <div className="overflow-hidden px-12">
            <div
              className="flex w-full transition-transform duration-300 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${page * 100}%)` }}
              data-testid="multipromo-colorbar-track"
            >
              {Array.from({ length: pageCount }, (_, pageIndex) => (
                <div key={pageIndex} className="w-full shrink-0">
                  <ColorBarGrid items={items.slice(pageIndex * columns, pageIndex * columns + columns)} />
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            aria-label="Next"
            data-testid="multipromo-colorbar-next"
            disabled={page >= pageCount - 1}
            onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
            className="absolute top-1/2 right-0 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#00778B] shadow disabled:opacity-40"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      ) : (
        <ColorBarGrid items={items} />
      )}
    </section>
  );
};
