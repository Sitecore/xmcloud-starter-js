import type {
  IGQLImageField,
  IGQLLinkField,
  IGQLTextField,
} from '@/lib/component-props';

export interface ProductFields {
  id: string;
  productImage: IGQLImageField;
  productTagLine: IGQLTextField;
  productLink: IGQLLinkField;
  productDescription: IGQLTextField;
  productPrice: IGQLTextField;
  productDiscountedPrice: IGQLTextField;
}

export interface ProductSectionDatasourceFields {
  data: {
    datasource: {
      children: {
        results: ProductFields[];
      };
      heading: IGQLTextField;
      link: IGQLLinkField;
    };
  };
}

export type ProductSectionProps = {
  params: { [key: string]: string };
  fields: ProductSectionDatasourceFields;
};
