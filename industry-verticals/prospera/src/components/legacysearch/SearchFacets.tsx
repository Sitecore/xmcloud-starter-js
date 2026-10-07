'use client';

import { CheckIcon } from '@radix-ui/react-icons';
import type { SearchResponseFacet } from '@sitecore-search/react';
import { useSearchResultsActions } from '@sitecore-search/react';
import {
  AccordionFacets,
  FacetItem,
  RangeFacet,
  SearchResultsAccordionFacets,
  SearchResultsFacetValueRange,
} from '@sitecore-search/ui';

type PriceFacetProps = {
  min: number;
  max: number;
};

const PriceFacet = ({ min, max }: PriceFacetProps) => {
  return (
    <SearchResultsFacetValueRange
      max={max}
      min={min}
      autoAdjustValues={false}
      className="relative flex items-center select-none touch-none w-full h-5 mb-8"
    >
      <RangeFacet.Track className="relative grow h-[3px] rounded-full bg-gray-400">
        <RangeFacet.Range className="absolute h-full bg-gray-700 rounded-full" />
      </RangeFacet.Track>
      <RangeFacet.Start className="block w-5 h-5 bg-[white] shadow-[0_2px_10px_grey] text-[10px] leading-5 text-center cursor-pointer rounded-[10px] hover:bg-gray-700 focus:shadow-[0_0_0_3px_grey]">
        {(value) => <span className="absolute text-sm left-0 top-[30px]">${value}</span>}
      </RangeFacet.Start>
      <RangeFacet.End className="block w-5 h-5 bg-[white] shadow-[0_2px_10px_grey] text-[10px] leading-5 text-center cursor-pointer rounded-[10px] hover:bg-gray-700 focus:shadow-[0_0_0_3px_grey]">
        {(value) => <span className="absolute text-sm left-0 top-[30px]">${value}</span>}
      </RangeFacet.End>
    </SearchResultsFacetValueRange>
  );
};

type SearchFacetsProps = {
  facets: SearchResponseFacet[];
};

const SearchFacets = ({ facets }: SearchFacetsProps) => {
  const { onFacetClick } = useSearchResultsActions();
  return (
    <SearchResultsAccordionFacets
      defaultFacetTypesExpandedList={["type"]}
      onFacetTypesExpandedListChange={() => {}}
      onFacetValueClick={onFacetClick}
      className="w-full"
    >
      {facets.map((f) => (
        <AccordionFacets.Facet
          facetId={f.name}
          key={f.name}
          className="block border-b mb-4 border-gray-200 bg-white rounded-lg shadow-sm border p-6"
        >
          <AccordionFacets.Header className="flex">
            <AccordionFacets.Trigger className="text-sm md:text-base font-semibold focus:outline-gray-700">
              {f.label}
            </AccordionFacets.Trigger>
          </AccordionFacets.Header>
          <AccordionFacets.Content className="mt-8">
            {f.name !== 'price' ? (
              <AccordionFacets.ValueList className="list-none mt-2 flex flex-col space-y-2">
                {f.value.map((v, index: number) => (
                  <FacetItem
                  key={v.id}
                    {...{
                      index,
                      facetValueId: v.id,
                    }}
                    className="group flex items-center text-sm cursor-pointer"
                  >
                    <AccordionFacets.ItemCheckbox className="form-checkbox flex-none w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out hover:border-heading focus:outline-gray-700 aria-checked:bg-gray-700 aria-checked:hover:bg-heading aria-checked:focus:bg-heading">
                      <AccordionFacets.ItemCheckboxIndicator className="text-white w-5 h-5 ">
                        <CheckIcon />
                      </AccordionFacets.ItemCheckboxIndicator>
                    </AccordionFacets.ItemCheckbox>
                    <AccordionFacets.ItemLabel className="text-sm ms-4 -mt-0.5">
                      {v.text} {v.count && `(${v.count})`}
                    </AccordionFacets.ItemLabel>
                  </FacetItem>
                ))}
              </AccordionFacets.ValueList>
            ) : (
              <PriceFacet min={Math.floor(f.value[0].min)} max={Math.floor(f.value[f.value.length - 1].max)} />
            )}
          </AccordionFacets.Content>
        </AccordionFacets.Facet>
      ))}
    </SearchResultsAccordionFacets>
  );
};

export default SearchFacets;
