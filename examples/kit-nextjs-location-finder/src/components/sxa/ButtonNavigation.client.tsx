'use client';

import { useSitecore, LinkField } from '@sitecore-content-sdk/nextjs';
import { CompatibleLink } from '@/components/content-sdk/CompatibleLink';
import { ArrowRight } from 'lucide-react';
import type { JSX } from 'react';

import type { NavigationFields } from './navigation.props';

type ButtonNavigationClientProps = {
  list: NavigationFields[];
  getLinkField: (props: { fields: NavigationFields }) => LinkField;
  getNavigationText: (props: { fields: NavigationFields }) => JSX.Element | string;
};

/**
 * Client component for ButtonNavigation with adapter-based link routing.
 */
export const ButtonNavigationClient = ({
  list,
  getLinkField,
  getNavigationText,
}: ButtonNavigationClientProps) => {
  const { page } = useSitecore();
  const isPageEditing = page?.mode?.isEditing;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {list.map((section) => {
        const linkField = getLinkField({ fields: section });
        const href = linkField?.value?.href;

        return (
          href && (
            <CompatibleLink
              key={section.Id}
              field={linkField}
              editable={isPageEditing}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              prefetch={false}
            >
              <h4 className="text-xl font-semibold text-brand-sky mb-2">
                {getNavigationText({ fields: section })}
              </h4>
              <p className="text-brand-black mb-4">
                Explore {getNavigationText({ fields: section })} components
              </p>
              <div className="flex items-center text-brand-sky">
                <span className="mr-2">View components</span>
                <ArrowRight size={20} />
              </div>
            </CompatibleLink>
          )
        );
      })}
    </div>
  );
};
