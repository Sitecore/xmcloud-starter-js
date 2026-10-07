'use client';

import React from 'react';
import { CardViewSwitcher } from '@sitecore-search/ui';

type CardViewSwitcherProps = {
  onToggle: (value: string) => void;
  defaultCardView: 'list' | 'grid';
  GridIcon: React.FC;
  ListIcon: React.FC;
};

const CardViewSwitcherComponent = ({ onToggle, defaultCardView, GridIcon, ListIcon }: CardViewSwitcherProps) => {
  return (
    <CardViewSwitcher.Root onValueChange={onToggle} defaultValue={defaultCardView} className="inline-flex">
      <CardViewSwitcher.Item
        value="grid"
        aria-label="Grid View"
        className="mr-2 items-center rounded-md bg-white dark:bg-gray-800 text-gray-500 flex h-[30px] justify-center w-[30px] ml-0 hover:bg-gray-100 data-[state=on]:bg-gray-800  dark:data-[state=on]:bg-gray-300 data-[state=on]:text-white dark:data-[state=on]:text-gray-600 focus:outline-grey-800"
      >
        <GridIcon />
      </CardViewSwitcher.Item>
      <CardViewSwitcher.Item
        value="list"
        aria-label="List View"
        className="items-center rounded-md bg-white dark:bg-gray-800 text-gray-500 flex h-[30px] justify-center w-[30px] ml-0 hover:bg-gray-100 data-[state=on]:bg-gray-800  dark:data-[state=on]:bg-gray-300 data-[state=on]:text-white dark:data-[state=on]:text-gray-600 focus:outline-grey-800"
      >
        <ListIcon />
      </CardViewSwitcher.Item>
    </CardViewSwitcher.Root>
  );
};

export default CardViewSwitcherComponent;
