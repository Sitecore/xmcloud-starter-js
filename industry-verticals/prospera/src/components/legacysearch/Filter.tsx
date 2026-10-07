'use client';

import { useSearchResultsActions, useSearchResultsSelectedFilters } from '@sitecore-search/react';

const buildRangeLabel = (min: number | undefined, max: number | undefined): string => {
  return typeof min === 'undefined' ? `< $${max}` : typeof max === 'undefined' ? ` > $${min}` : `$${min} - $${max}`;
};
const buildFacetLabel = (selectedFacet: any) => {
  if ('min' in selectedFacet || 'max' in selectedFacet) {
    return `${buildRangeLabel(selectedFacet.min, selectedFacet.max)}`;
  }
  return `${selectedFacet.valueLabel}`;
};

const Filter = () => {
  const selectedFacetsFromApi = useSearchResultsSelectedFilters();
  const { onRemoveFilter, onClearFilters } = useSearchResultsActions();
  return selectedFacetsFromApi.length > 0 ? (
    <div className="mb-4">
      <div className="flex flex-row justify-between items-center mb-2">
        <h3 className="text-sm md:text-base font-semibold">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-sm font-medium text-gray-800 dark:text-gray-100 underline text-opacity-75 hover:text-gray-900 focus:outline-gray-900"
        >
          Clear Filters
        </button>
      </div>
      <div className="flex flex-wrap">
        {selectedFacetsFromApi.map((selectedFacet) => (
          <button
            key={`${selectedFacet.facetId}${selectedFacet.facetLabel}${selectedFacet.valueLabel}`}
            onClick={() => onRemoveFilter(selectedFacet)}
            className="text-ellipsis text-xs font-medium text-white bg-gray-400 rounded-md pl-2 pr-5 py-1.5 m-1 whitespace-no-wrap max-w-full overflow-hidden relative cursor-pointer before:content-[''] before:-rotate-45 before:absolute before:w-2.5 before:h-0.5 before:right-2 before:top-2/4 before:bg-white after:content-[''] after:rotate-45 after:absolute after:w-2.5 after:h-0.5 after:right-2 after:top-2/4 after:bg-white focus:outline-indigo-500"
          >
            {buildFacetLabel(selectedFacet)}
          </button>
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Filter;
