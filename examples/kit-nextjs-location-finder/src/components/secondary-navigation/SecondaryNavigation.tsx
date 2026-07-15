'use client';

import { useState, type JSX } from 'react';
import { Button } from '@/components/ui/button';
import { CompatibleLink } from '@/components/content-sdk/CompatibleLink';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';
import type { LinkField, LinkFieldValue } from '@sitecore-content-sdk/nextjs';
import type {
  SecondaryNavigationPage,
  SecondaryNavigationProps,
} from './secondary-navigation.props';

const toLinkField = (url: LinkFieldValue | undefined, text: string): LinkField => ({
  value: {
    href: url?.href ?? '',
    text,
    target: url?.target,
    querystring: url?.querystring,
    anchor: url?.anchor,
  },
});

export const Default: React.FC<SecondaryNavigationProps> = (props) => {
  const { fields } = props;
  const { datasource } = fields?.data ?? {};
  const { parent, children } = datasource ?? {};

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const renderChildren = (childItems: SecondaryNavigationPage[]) => {
    return (
      <NavigationMenu.List className="mt-2 flex list-none flex-col items-start gap-2">
        {childItems.map((child, index) => {
          const title =
            child.navigationTitle?.jsonValue.value ||
            child.title?.jsonValue.value ||
            child.displayName ||
            child.name ||
            '';

          return (
            <NavigationMenu.Item key={index}>
              <Button asChild variant="link" className="font-bold">
                <CompatibleLink
                  field={toLinkField(child.url, title)}
                  editable={false}
                  className=" p-2"
                  prefetch={false}
                />
              </Button>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>
    );
  };

  const Content = (props: { className?: string }): JSX.Element => {
    const { className } = props;

    return (
      <NavigationMenu.Root
        className={cn('relative justify-center', className)}
        orientation="vertical"
      >
        <NavigationMenu.List className="m-0 flex list-none flex-col gap-2 pl-0">
          {parent.children?.results?.map((item, index) => {
            const isParent = datasource.id == item.id;
            const title =
              item.navigationTitle?.jsonValue.value ||
              item.title?.jsonValue.value ||
              item.displayName ||
              item.name ||
              '';

            return (
              <NavigationMenu.Item key={index}>
                <Button asChild variant="link" className="justify-start">
                  <CompatibleLink
                    field={toLinkField(item.url, title)}
                    editable={false}
                    className="hover:bg-accent-6 box-border inline-block w-full  p-2 px-4 font-bold"
                    prefetch={false}
                  />
                </Button>
                {isParent && renderChildren(children.results)}
              </NavigationMenu.Item>
            );
          })}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    );
  };

  if (fields) {
    return (
      <nav aria-label="Secondary navigation">
        <Content className="hidden sm:block" />

        {/* Mobile Dropdown */}
        <div className="relative block sm:hidden">
          <button
            className={cn(
              'border-accent-6 flex w-full items-center justify-between rounded-md border bg-[color:var(--color-background)] p-2 px-4',
              { ['rounded-bl-none rounded-br-none']: isOpen }
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="secondary-nav-menu"
          >
            <span className="sr-only">Toggle secondary navigation</span>
            <ChevronDownIcon className={cn('transition-all', { ['rotate-180']: isOpen })} aria-hidden="true" />
          </button>
          {isOpen && (
            <div 
              id="secondary-nav-menu"
              className="border-accent-6 absolute top-full flex w-full flex-col rounded-bl-md rounded-br-md border border-t-0 bg-[color:var(--color-background)]"
            >
              <Content />
            </div>
          )}
        </div>
      </nav>
    );
  }
  return <NoDataFallback componentName="Secondary Navigation" />;
};
