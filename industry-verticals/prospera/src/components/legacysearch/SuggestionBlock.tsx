'use client';

import { useRouter } from 'next/navigation'; 
import { usePreviewSearchActions } from '@sitecore-search/react';
import { PreviewSearch } from '@sitecore-search/ui';

type SuggestionBlockProps = {
  items: Array<{ text: string }>;
  title: string;
  blockId: string;
  filterAttribute?: string;
  disabled?: boolean;
};

const SuggestionBlock = ({ items, title, blockId, filterAttribute, disabled }: SuggestionBlockProps) => {
  const { onSuggestionClick } = usePreviewSearchActions();
  const router = useRouter();
  return (
    <>
      {items.length > 0 && (
        <PreviewSearch.SuggestionsGroup className="flex flex-1 flex-col" id={blockId} filterAttribute={filterAttribute}>
          <h2 className="box-border pl-1 block text-lg font-bold m-2 dark:text-gray-100">{title}</h2>
          {items.map(({ text }) => (
            <PreviewSearch.SuggestionTrigger
              className="cursor-pointer p-2 text-sm data-[state=active]:outline-none data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-200  data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700  focus:outline-none focus:bg-white dark:focus:bg-gray-700 focus:text-bold hover:outline-none hover:text-gray-900 hover:bg-white dark:hover:text-gray-200 dark:hover:bg-gray-700 dark:text-gray-100 "
              id={text}
              key={text}
              asChild
              disabled={disabled}
            >
              <a
                onClick={() => {
                  onSuggestionClick({
                    name: blockId,
                    title,
                    value: text,
                    displayName: text,
                  });
                  router.push('/search?q=' + text);
                }}
              >
                {text}
              </a>
            </PreviewSearch.SuggestionTrigger>
          ))}
        </PreviewSearch.SuggestionsGroup>
      )}
    </>
  );
};

export default SuggestionBlock;
