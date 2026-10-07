'use client';

import type { SearchResponseSortChoice } from '@sitecore-search/react';
import { useSearchResultsActions } from '@sitecore-search/react';
import { SortSelect } from '@sitecore-search/ui';

type SortOrderProps = {
  options: Array<SearchResponseSortChoice>;
  selected: string;
};
const SortOrder = ({ options, selected }: SortOrderProps) => {
  const selectedSortIndex = options.findIndex((s) => s.name === selected);
  const { onSortChange } = useSearchResultsActions();
  return (
    <SortSelect.Root defaultValue={options[selectedSortIndex]?.name} onValueChange={onSortChange}>
      <SortSelect.Trigger className="inline-flex h-10 cursor-pointer items-center gap-1 border-0 bg-transparent px-4 py-1 focus:outline-gray-700">
        <SortSelect.SelectValue>
          {selectedSortIndex > -1 ? options[selectedSortIndex].label : ''}
        </SortSelect.SelectValue>
        <SortSelect.Icon />
      </SortSelect.Trigger>
      <SortSelect.Content className="absolute top-8 z-[100] min-w-[150px] rounded-md bg-gray-100 shadow-[2px_2px_4px_#CFCFCF] focus-within:border-gray-700 dark:bg-gray-700">
        <SortSelect.Viewport className="z-[50000] p-1">
          {options.map((option: any) => (
            <SortSelect.Option
              value={option}
              key={option.name}
              className="whitespace-no-wrap m-1 flex h-6 cursor-pointer items-center rounded-sm p-1 px-1 leading-none select-none hover:bg-gray-700 hover:text-gray-100 focus:outline-gray-700 data-[state=checked]:bg-white data-[state=checked]:text-gray-700 dark:hover:bg-gray-100 dark:hover:text-gray-700"
            >
              <SortSelect.OptionText>{option.label}</SortSelect.OptionText>
            </SortSelect.Option>
          ))}
        </SortSelect.Viewport>
      </SortSelect.Content>
    </SortSelect.Root>
  );
};

export default SortOrder;
