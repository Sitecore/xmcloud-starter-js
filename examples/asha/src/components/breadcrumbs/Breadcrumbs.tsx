import { BreadcrumbsPage, BreadcrumbsProps } from '@/components/breadcrumbs/breadcrumbs.props';
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

export const Default: React.FC<BreadcrumbsProps> = (props) => {
  const datasource = getDatasource(props.fields);
  const { ancestors, name } = datasource ?? {};

  const truncate = (str: string): string => {
    return str?.length > 25
      ? str
          .replace(/(.{24})..+/, '$1')
          .trim()
          .concat('...')
      : str;
  };

  if (datasource) {
    if (ancestors) {
      return (
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
              <BreadcrumbPage>{truncate(name || '')}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
    }

    //if no ancestors
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return <NoDataFallback componentName="Breadcrumbs" />;
};
