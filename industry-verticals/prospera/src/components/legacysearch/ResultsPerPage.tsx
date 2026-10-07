'use client';

import { useSearchResultsActions } from '@sitecore-search/react';
import { Select, SortSelect } from '@sitecore-search/ui';

type ResultsPerPageProps = {
  defaultItemsPerPage: number;
};

const ResultsPerPage = ({ defaultItemsPerPage }: ResultsPerPageProps) => {
  const { onResultsPerPageChange } = useSearchResultsActions();
  return (
    <div>
      <label className="pr-1">Results Per Page</label>
      <Select.Root
        defaultValue={String(defaultItemsPerPage)}
        onValueChange={(v) =>
          onResultsPerPageChange({
            numItems: Number(v),
          })
        }
      >
        <Select.Trigger className="cursor-pointer inline-flex items-center bg-transparent h-10 gap-1 py-1 px-4 border-0 focus:outline-gray-700">
          <Select.SelectValue />
          <Select.Icon />
        </Select.Trigger>
        <Select.SelectContent className="bg-gray-100 dark:bg-gray-700 shadow-[2px_2px_4px_#CFCFCF] z-[100] min-w-[100px] rounded-md ">
          <Select.Viewport className="p-1">
            <Select.SelectItem
              value="10"
              className="flex rounded-sm items-center leading-none cursor-pointer select-none whitespace-no-wrap h-6 px-1 hover:bg-gray-700 hover:text-gray-100  dark:hover:bg-gray-100 dark:hover:text-gray-700  data-[state=checked]:text-gray-700 data-[state=checked]:bg-gray-100  dark:data-[state=checked]:text-gray-100 dark:data-[state=checked]:bg-gray-700 focus:outline-gray-700"
            >
              <SortSelect.OptionText>10</SortSelect.OptionText>
            </Select.SelectItem>

            <Select.SelectItem
              value="25"
              className="flex rounded-sm items-center leading-none cursor-pointer select-none whitespace-no-wrap h-6 px-1 hover:bg-gray-700 hover:text-gray-100  dark:hover:bg-gray-100 dark:hover:text-gray-700  data-[state=checked]:text-gray-700 data-[state=checked]:bg-gray-100  dark:data-[state=checked]:text-gray-100 dark:data-[state=checked]:bg-gray-700 focus:outline-gray-700"
            >
              <SortSelect.OptionText>25</SortSelect.OptionText>
            </Select.SelectItem>

            <Select.SelectItem
              value="50"
              className="flex rounded-sm items-center leading-none cursor-pointer select-none whitespace-no-wrap h-6 px-1 hover:bg-gray-700 hover:text-gray-100  dark:hover:bg-gray-100 dark:hover:text-gray-700  data-[state=checked]:text-gray-700 data-[state=checked]:bg-gray-100  dark:data-[state=checked]:text-gray-100 dark:data-[state=checked]:bg-gray-700 focus:outline-gray-700"
            >
              <SortSelect.OptionText>50</SortSelect.OptionText>
            </Select.SelectItem>
          </Select.Viewport>
        </Select.SelectContent>
      </Select.Root>
    </div>
  );
};

export default ResultsPerPage;
