import type { Dealership } from './location-search.props';

export interface GoogleMapProps {
  apiKey: string;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  selectedDealership: Dealership | null;
  dealerships: Dealership[];
  onDealershipSelect: (dealership: Dealership) => void;
}
