'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Link, RichText, Text } from '@sitecore-content-sdk/nextjs';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { MultiPromoItemProps, MultiPromoProps } from './multi-promo.props';
import { getDatasource, getFieldValue } from '@/lib/component-props';
import { Default as MultiPromoItem } from './MultiPromoItem.dev';

/**
 * Section heading plus a responsive grid of brand cards (one per child promo).
 */
export const Default: React.FC<MultiPromoProps> = (props) => {
  const { fields, params } = props;
  const datasource = useMemo(() => getDatasource(fields), [fields]);
  const { children, title, description } = datasource ?? {};
  const items = children?.results ?? [];

  if (!fields) {
    return <NoDataFallback componentName="Multi Promo" />;
  }

  return (
    <section
      data-component="MultiPromo"
      className={cn('component multi-promo w-full bg-white py-16 text-black md:py-20', {
        [params?.styles]: params?.styles,
      })}
    >
      <div className="mx-auto max-w-[1311px] px-6">
        {(title || description) && (
          <div className="mb-10 max-w-3xl">
            {title && (
              <Text
                tag="h2"
                field={getFieldValue(title)}
                className="mb-4 text-balance text-3xl font-medium leading-tight md:text-[2.25rem]"
              />
            )}
            {description && (
              <RichText
                className="text-pretty text-base font-light leading-relaxed"
                field={getFieldValue(description)}
              />
            )}
          </div>
        )}
        {items.length > 0 && (
          <ul
            className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2', {
              'lg:grid-cols-3': items.length % 4 !== 0,
              'lg:grid-cols-4': items.length % 4 === 0,
            })}
          >
            {items.map((item: MultiPromoItemProps, index: number) => (
              <li key={index} className="flex">
                <MultiPromoItem {...item} index={index} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

/** Gap between the pinned edges of consecutive stacked cards, in px. */
const STACK_OFFSET = 24;
/** How much a pinned card shrinks per pixel scrolled after it pins. */
const STACK_SCALE_PER_PX = 0.00013;
const STACK_MIN_SCALE = 0.72;
const STACK_GRADIENTS = [
  'bg-[linear-gradient(120deg,#004e97_0%,#0b3f7a_100%)]',
  'bg-[linear-gradient(120deg,#0b3b4f_0%,#14607a_60%,#1f8aa3_100%)]',
  'bg-[linear-gradient(120deg,#2a1b4f_0%,#4b2c7f_60%,#7a3fa0_100%)]',
  'bg-[linear-gradient(120deg,#1a2433_0%,#2f3e55_60%,#4a5f7d_100%)]',
];

/**
 * Stacked variant: full-width brand panels that pin below the header one after
 * another; earlier panels shrink from the top as later ones slide over them.
 */
export const Stacked: React.FC<MultiPromoProps> = (props) => {
  const { fields, params, page } = props;
  const isPageEditing = page?.mode?.isEditing;
  const datasource = useMemo(() => getDatasource(fields), [fields]);
  const { children, title, description } = datasource ?? {};
  const items = children?.results ?? [];
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || isPageEditing) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = Array.from(list.querySelectorAll<HTMLElement>('[data-stack-card]'));
    let frame = 0;

    const update = () => {
      frame = 0;
      const listTop = list.getBoundingClientRect().top;
      cards.forEach((card, index) => {
        if (index === cards.length - 1) return;
        const pinTop = parseFloat(getComputedStyle(card).top) || 0;
        // Where the card would sit if it were not sticky (list gap equals STACK_OFFSET), relative to the viewport.
        const naturalTop = listTop + index * (card.offsetHeight + STACK_OFFSET);
        const scrolledPastPin = Math.max(0, pinTop - naturalTop);
        const scale = Math.max(STACK_MIN_SCALE, 1 - scrolledPastPin * STACK_SCALE_PER_PX);
        card.style.transform = `scale(${scale})`;
      });
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      cards.forEach((card) => (card.style.transform = ''));
    };
  }, [isPageEditing, items.length]);

  if (!fields) {
    return <NoDataFallback componentName="Multi Promo" />;
  }

  return (
    <section
      data-component="MultiPromo"
      className={cn('component multi-promo w-full bg-white pb-20 text-black', {
        [params?.styles]: params?.styles,
      })}
    >
      <div className="mx-auto max-w-[1311px] px-6">
        {(title || description) && (
          <div className="mb-12 max-w-3xl">
            {title && (
              <Text
                tag="h2"
                field={getFieldValue(title)}
                className="mb-4 text-balance text-3xl font-medium leading-tight md:text-[2.25rem]"
              />
            )}
            {description && (
              <RichText className="text-base font-light leading-relaxed" field={getFieldValue(description)} />
            )}
          </div>
        )}
        <ul ref={listRef} className="flex flex-col gap-6">
          {items.map((item: MultiPromoItemProps, index: number) => {
            const heading = getFieldValue(item.heading);
            const text = getFieldValue(item.description);
            const link = getFieldValue(item.link);
            return (
              <li
                key={index}
                data-stack-card
                style={{ top: `calc(var(--stack-pin, 120px) + ${index * STACK_OFFSET}px)` }}
                className={cn(
                  'sticky origin-top text-white shadow-[0_-10px_30px_rgba(0,0,0,0.18)] will-change-transform',
                  STACK_GRADIENTS[index % STACK_GRADIENTS.length]
                )}
              >
                <article className="grid min-h-[26rem] grid-cols-1 gap-10 p-8 md:min-h-[30rem] md:grid-cols-[1.1fr_1fr] md:p-14">
                  <div>
                    {heading && (
                      <Text
                        tag="h3"
                        field={heading}
                        className="mb-6 text-balance text-3xl font-light leading-none md:text-[2.6875rem]"
                      />
                    )}
                    {text?.value && (
                      <Text tag="p" field={text} className="max-w-xl text-pretty text-base font-light leading-relaxed text-white/90" />
                    )}
                  </div>
                  {link?.value?.href && (
                    <div className="flex items-end md:items-start md:justify-end">
                      <Link
                        field={link}
                        className="flex w-full items-center justify-between gap-6 border-b border-white/30 py-4 text-lg text-white hover:underline md:max-w-md"
                      >
                        {link.value.text}
                        <ArrowRight className="size-6 shrink-0" aria-hidden="true" />
                      </Link>
                    </div>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
