'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  Text as ContentSdkText,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
} from '@sitecore-content-sdk/nextjs';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { getDatasource, getFieldValue } from '@/lib/component-props';
import { cn } from '@/lib/utils';
import type { MultiPromoProps, PromoItemProps } from './multi-promo.props';

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
