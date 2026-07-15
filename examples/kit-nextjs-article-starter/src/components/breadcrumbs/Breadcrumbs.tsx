import type React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { getDatasource, getFieldValue } from '@/lib/component-props';
import { BreadcrumbsProps, BreadcrumbsPage } from './breadcrumbs.props';
import { StructuredData } from '@/components/structured-data/StructuredData';
import { generateBreadcrumbListSchema } from '@/lib/structured-data/schema';

export const Default: React.FC<BreadcrumbsProps> = (props) => {
  const { fields } = props;
  const datasource = getDatasource(fields);
  const { ancestors, name } = datasource ?? {};
  const currentPageName = name || '';

  const truncate = (str: string): string => {
    return str?.length > 25
      ? str
          .replace(/(.{24})..+/, '$1')
          .trim()
          .concat('...')
      : str;
  };

  if (fields) {
    if (ancestors) {
      // Generate BreadcrumbList schema
      const breadcrumbItems = [
        ...ancestors.map((ancestor: BreadcrumbsPage, index: number) => ({
          name:
            getFieldValue(ancestor.navigationTitle)?.value ||
            getFieldValue(ancestor.title)?.value ||
            '',
          url: ancestor.url?.href || '',
          position: index + 1,
        })),
        {
          name: truncate(currentPageName),
          url: typeof window !== 'undefined' ? window.location.href : '',
          position: ancestors.length + 1,
        },
      ];

      const breadcrumbSchema = generateBreadcrumbListSchema({ items: breadcrumbItems });

      return (
        <>
          {breadcrumbSchema && <StructuredData id="breadcrumb-schema" data={breadcrumbSchema} />}
          {/* Breadcrumb component already includes <nav> with aria-label */}
          <Breadcrumb>
          <BreadcrumbList>
            {ancestors?.map((ancestor: BreadcrumbsPage, index) => {
              const title =
                getFieldValue(ancestor.navigationTitle)?.value ||
                getFieldValue(ancestor.title)?.value;

              return (
                <>
                  <BreadcrumbItem key={index}>
                    <BreadcrumbLink href={ancestor.url?.href || ''}>{title}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              );
            })}
            <BreadcrumbItem>
              <BreadcrumbPage>{truncate(currentPageName)}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        </>
      );
    }

    //if no ancestors
    const homeBreadcrumbSchema = generateBreadcrumbListSchema({
      items: [
        {
          name: 'Home',
          url: typeof window !== 'undefined' ? window.location.origin : '/',
          position: 1,
        },
      ],
    });

    return (
      <>
        {homeBreadcrumbSchema && <StructuredData id="breadcrumb-schema" data={homeBreadcrumbSchema} />}
        {/* Breadcrumb component already includes <nav> with aria-label */}
        <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      </>
    );
  }

  return <NoDataFallback componentName="Breadcrumbs" />;
};