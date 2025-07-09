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

export const Default: React.FC<BreadcrumbsProps> = (props) => {
  const { fields } = props;
  const { ancestors, name } = fields?.data?.datasource ?? {};

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
      return (
        <Breadcrumb>
          <BreadcrumbList>
            {ancestors?.map((ancestor: BreadcrumbsPage, index) => {
              const title =
                ancestor.navigationTitle?.jsonValue.value || ancestor.title?.jsonValue.value;

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
              <BreadcrumbPage>{truncate(name)}</BreadcrumbPage>
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
