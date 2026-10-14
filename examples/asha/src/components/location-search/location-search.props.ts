import type { Field } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from '@/lib/component-props';

// These fields are authored in Sitecore
export interface DealershipFields {
  dealershipName: { jsonValue: Field<string> };
  dealershipAddress: { jsonValue: Field<string> };
  dealershipCity: { jsonValue: Field<string> };
  dealershipState: { jsonValue: Field<string> };
  dealershipZipCode: { jsonValue: Field<string> };
}

// This extends the authored fields with runtime calculated values
export interface Dealership extends DealershipFields {
  // These fields are calculated at runtime, not authored in Sitecore
  distance?: number;
  latitude?: number;
  longitude?: number;
}

export interface LocationSearchParams {
  [key: string]: any; // eslint-disable-line
}

export interface LocationSearchFields {
  googleMapsApiKey: string;
  title: { jsonValue: Field<string> };
  defaultZipCode: string;
}

export interface LocationSearchProps extends ComponentProps {
  isPageEditing?: boolean;
  params: LocationSearchParams;
  fields: {
    data: {
      datasource: LocationSearchFields;
      dealerships: {
        results: DealershipFields[]; // Note: This comes from Sitecore without the runtime fields
      };
    };
  };
  defaultZipCode?: string;
  googleMapsApiKey: string;
}

export interface LocationSearchItemProps {
  dealership: Dealership;
  isSelected: boolean;
  onSelect: (dealership: Dealership) => void;
}
