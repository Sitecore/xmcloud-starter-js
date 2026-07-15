import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { generateBreadcrumbListSchema } from '@/lib/structured-data/schema';
import { getBaseUrl } from '@/lib/utils';
import { StructuredData } from '@/components/structured-data/StructuredData';
import { getDatasource, getFieldValue } from '@/lib/component-props';
import type { BreadcrumbsPage, BreadcrumbsProps } from './breadcrumbs.props';

export const Default: React.FC<BreadcrumbsProps> = (props) => {
  const { fields } = props;
  const datasource = getDatasource(fields);
  const { ancestors, name } = datasource ?? {};
  const currentPageName = name || 'Current page';

  const truncate = (str: string): string => {
    return str?.length > 25
      ? str
          .replace(/(.{24})..+/, '$1')
          .trim()
          .concat('...')
      : str;
  };

  // Generate BreadcrumbList schema
  const breadcrumbItems = [
    ...(ancestors?.map((ancestor) => ({
      name:
        getFieldValue(ancestor.navigationTitle)?.value ||
        getFieldValue(ancestor.title)?.value ||
        'Untitled',
      url: ancestor.url?.href ? `${getBaseUrl()}${ancestor.url.href}` : undefined,
    })) || []),
    { name: currentPageName, url: undefined }, // Current page
  ];

  const breadcrumbSchema = generateBreadcrumbListSchema(breadcrumbItems);

  if (fields) {
    if (ancestors) {
      return (
        <>
          {/* BreadcrumbList structured data */}
          <StructuredData id="breadcrumb-schema" data={breadcrumbSchema} />
          
          <Breadcrumb>
            <BreadcrumbList>
              {ancestors?.map((ancestor: BreadcrumbsPage, index) => {
                const title =
                  getFieldValue(ancestor.navigationTitle)?.value || getFieldValue(ancestor.title)?.value;

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
    const homeBreadcrumbSchema = generateBreadcrumbListSchema([{ name: 'Home', url: getBaseUrl() }]);
    return (
      <>
        <StructuredData id="breadcrumb-schema-home" data={homeBreadcrumbSchema} />
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
