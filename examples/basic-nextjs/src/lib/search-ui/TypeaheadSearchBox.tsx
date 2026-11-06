'use client';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Field, LinkField } from '@sitecore-content-sdk/nextjs';
import { useSearch, useSuggest } from '@sitecore-content-sdk/nextjs/search';
import { ComponentProps } from '@/lib/component-props';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { DEFAULT_MAX_SUGGESTIONS } from '@/lib/search-ui/constants';
import { navigateTo } from '@/lib/search-ui/navigate';
import { useDebouncedValue } from '@/lib/search-ui/useDebouncedValue';
import { useSearchLabels } from '@/lib/search-ui/useSearchLabels';
import { useSearchEvents } from '@/lib/search-ui/useSearchEvents';
import { searchLocale } from '@/lib/search-ui/locale';

export interface TypeaheadFields {
  SearchIndex?: Field<string>;
  TitleMapping?: Field<string>;
  LinkMapping?: Field<string>;
  ResultsPage?: LinkField;
  MaxSuggestions?: Field<string>;
}

// Structurally matches the SDK's SearchDocument constraint (not re-exported by
// the nextjs submodule).
type SearchDoc = { [key: string]: string | number | boolean | (string | number | boolean)[] };

const docValue = (doc: SearchDoc, attribute: string | undefined): string => {
  if (!attribute) return '';
  const value = doc[attribute];
  return typeof value === 'string' ? value : '';
};

/** One keyboard-navigable dropdown row: a completed query term or a preview document. */
type TypeaheadOption = { kind: 'term'; text: string } | { kind: 'doc'; doc: SearchDoc };

/**
 * The whole typeahead combobox — state, search, keyboard handling, dropdown.
 * Consumers (SearchTypeahead variants, NavigationHeader's search slot) differ
 * only in the chrome around this and the input treatment:
 * - default: page-style input
 * - compact: white pill (slim strips, light surfaces)
 * - compact + onDark: glass pill for brand-colored headers — translucent at
 *   rest, solid white with dark text on focus
 */
export const TypeaheadSearchBox = ({
  fields,
  page,
  rendering,
  className,
  compact = false,
  onDark = false,
}: Pick<ComponentProps, 'page' | 'rendering'> & {
  fields: TypeaheadFields;
  className?: string;
  compact?: boolean;
  onDark?: boolean;
}) => {
  const label = useSearchLabels(page?.siteName);

  const isEditing = page?.mode?.isEditing ?? false;
  const isPreview = page?.mode?.isPreview ?? false;
  const live = !isEditing && !isPreview;

  const searchIndexId = fields?.SearchIndex?.value ?? '';
  const titleAttribute = fields?.TitleMapping?.value || undefined;
  const linkAttribute = fields?.LinkMapping?.value || undefined;
  const resultsHref = fields?.ResultsPage?.value?.href || '';
  const maxSuggestions = Number(fields?.MaxSuggestions?.value) || DEFAULT_MAX_SUGGESTIONS;

  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const query = useDebouncedValue(inputValue);

  // One request per (debounced) keystroke: completed query terms (source
  // "Autocomplete" setting) + preview documents (source "Result preview").
  // The hook has no limit option — the source config sets the server cap,
  // MaxSuggestions can only trim further.
  const locale = searchLocale(page);
  const suggest = useSuggest<SearchDoc>({
    searchIndexId,
    locale,
    enabled: live && !!searchIndexId && !!query,
    query,
  });
  const { querySuggestions, previewResults } = suggest;

  // Fallback for sources without Autocomplete/Result preview (e.g. content sources
  // created before push sources): when suggest errors or returns nothing at all,
  // run the pre-v4 title search so the dropdown still lists matching documents.
  const suggestEmpty =
    suggest.isError ||
    (suggest.isSuccess && querySuggestions.length === 0 && previewResults.length === 0);
  const fallback = useSearch<SearchDoc>({
    searchIndexId,
    page: 1,
    pageSize: maxSuggestions,
    locale,
    enabled: live && !!searchIndexId && !!query && suggestEmpty,
    query,
  });
  const fallbackResults = fallback.results;
  const documents = useMemo(
    () => (previewResults.length ? previewResults : suggestEmpty ? fallbackResults : []),
    [previewResults, suggestEmpty, fallbackResults]
  );
  const isSuccess = suggest.isSuccess || fallback.isSuccess;

  const sendEvent = useSearchEvents({ query, uid: rendering?.uid, page });

  const options = useMemo<TypeaheadOption[]>(() => {
    if (!query) return [];
    const typed = query.trim().toLowerCase();
    const terms: TypeaheadOption[] = querySuggestions
      .map((s) => s.queryPlusText || s.text)
      .filter((text, i, all) => !!text && all.indexOf(text) === i && text.toLowerCase() !== typed)
      .slice(0, maxSuggestions)
      .map((text) => ({ kind: 'term', text }));
    const docs: TypeaheadOption[] = documents
      .filter((doc) => !!docValue(doc, titleAttribute))
      .slice(0, maxSuggestions)
      .map((doc) => ({ kind: 'doc', doc }));
    return [...terms, ...docs];
  }, [query, querySuggestions, documents, maxSuggestions, titleAttribute]);

  const showDropdown = isOpen && query.length > 0;

  // Reset keyboard position whenever the option list changes.
  useEffect(() => {
    setActiveIndex(-1);
  }, [options]);

  useEffect(() => {
    if (isSuccess && query) sendEvent('viewed');
  }, [isSuccess, query, sendEvent]);

  // Close on outside click.
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const listboxId = `typeahead-listbox-${rendering?.uid ?? 'default'}`;

  const resultsUrl = (q: string) => `${resultsHref}?q=${encodeURIComponent(q)}`;
  const seeAllHref = resultsHref && inputValue.trim() ? resultsUrl(inputValue.trim()) : '';

  const goToResults = () => {
    if (seeAllHref) navigateTo(seeAllHref);
  };

  const chooseTerm = (text: string) => {
    sendEvent('clicked');
    if (resultsHref) {
      navigateTo(resultsUrl(text));
      return;
    }
    setInputValue(text);
  };

  const chooseDoc = (doc: SearchDoc) => {
    sendEvent('clicked');
    const link = docValue(doc, linkAttribute);
    if (link) {
      navigateTo(link);
      return;
    }
    // Graceful degradation without a link mapping: hand the title to the
    // results page as the query.
    const title = docValue(doc, titleAttribute);
    if (resultsHref && title) navigateTo(resultsUrl(title));
  };

  const choose = (option: TypeaheadOption) =>
    option.kind === 'term' ? chooseTerm(option.text) : chooseDoc(option.doc);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && options[activeIndex]) {
        choose(options[activeIndex]);
      } else {
        goToResults();
      }
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!options.length) return;
      setIsOpen(true);
      const delta = e.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((prev) => (prev + delta + options.length) % options.length);
    }
  };

  const optionClass = (i: number) =>
    cn(
      'cursor-pointer px-4 py-2 text-sm',
      i === activeIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
    );
  const sectionHeaderClass =
    'text-muted-foreground px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide';
  const firstDocIndex = options.findIndex((o) => o.kind === 'doc');
  const hasTerms = options.some((o) => o.kind === 'term');

  return (
    <div
      ref={containerRef}
      role="combobox"
      aria-expanded={showDropdown}
      aria-haspopup="listbox"
      className={cn('relative', className)}
    >
      <Input
        type="text"
        value={inputValue}
        disabled={!live}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={label('SEARCH_INPUT_PLACEHOLDER')}
        aria-label={label('SEARCH_INPUT_PLACEHOLDER')}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
        className={cn(
          'w-full',
          !compact && 'py-2 pl-10',
          compact &&
            !onDark &&
            'h-9 rounded-full border-0 bg-white pl-9 pr-4 text-sm text-gray-900 shadow-sm ring-1 ring-black/10 placeholder:text-gray-500 focus-visible:ring-2',
          compact &&
            onDark &&
            'h-9 rounded-full border-0 bg-white/10 pl-9 pr-4 text-sm text-white placeholder:text-white/60 ring-1 ring-white/20 transition-colors focus:bg-white focus:text-gray-900 focus:placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-white/60'
        )}
      />
      <Search
        className={cn(
          'pointer-events-none absolute top-1/2 -translate-y-1/2 left-3 size-4',
          compact && onDark ? 'text-white/60' : compact ? 'text-gray-400' : 'text-muted-foreground'
        )}
      />

      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={label('SUGGESTIONS')}
          className={cn(
            'bg-background absolute z-50 mt-1 w-full overflow-hidden border shadow-md',
            compact ? 'min-w-72 rounded-lg shadow-lg' : 'rounded-md',
            compact && onDark && 'right-0 w-auto'
          )}
        >
          {hasTerms && (
            <li role="presentation" aria-hidden="true" className={sectionHeaderClass}>
              {label('SUGGESTED_SEARCHES')}
            </li>
          )}
          {options.map((option, i) => {
            if (option.kind === 'term') {
              return (
                <li
                  key={`term:${option.text}`}
                  id={`${listboxId}-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  className={cn(optionClass(i), 'flex items-center gap-2')}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => chooseTerm(option.text)}
                >
                  <Search className="text-muted-foreground size-3.5 shrink-0" />
                  <span>{option.text}</span>
                </li>
              );
            }
            const title = docValue(option.doc, titleAttribute);
            return (
              <Fragment key={`doc:${docValue(option.doc, 'sc_item_id') || title}`}>
                {i === firstDocIndex && (
                  <li
                    role="presentation"
                    aria-hidden="true"
                    className={cn(sectionHeaderClass, hasTerms && 'mt-1 border-t')}
                  >
                    {label('TOP_RESULTS')}
                  </li>
                )}
                <li
                  id={`${listboxId}-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  className={optionClass(i)}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => chooseDoc(option.doc)}
                >
                  {title}
                </li>
              </Fragment>
            );
          })}
          {seeAllHref && (
            <li role="option" aria-selected={false} className="border-t">
              <a
                href={seeAllHref}
                className="text-primary block px-4 py-2 text-sm font-medium"
                onClick={() => sendEvent('clicked')}
              >
                {label('SEE_ALL_RESULTS')}
              </a>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
