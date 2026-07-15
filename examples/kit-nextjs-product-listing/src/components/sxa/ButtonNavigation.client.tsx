'use client';

import { useSitecore, Link as ContentSdkLink, LinkField } from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { JSX } from 'react';
import type { NavigationFields } from './sxa-navigation.props';

type ButtonNavigationClientProps = {
  list: NavigationFields[];
  getLinkField: (props: { fields: NavigationFields }) => LinkField;
  getNavigationText: (props: { fields: NavigationFields }) => JSX.Element | string;
};

/**
 * Client component for ButtonNavigation with editing mode detection
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
        return isPageEditing ? (
          <ContentSdkLink
            key={section.Id}
            field={linkField}
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
          </ContentSdkLink>
        ) : (
          href && (
            <Link
              key={section.Id}
              href={href}
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
            </Link>
          )
        );
      })}
    </div>
  );
};
