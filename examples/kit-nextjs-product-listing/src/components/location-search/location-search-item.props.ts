import type { Dealership } from './location-search.props';

export interface LocationSearchItemProps {
  dealership: Dealership;
  isSelected: boolean;
  onSelect: (dealership: Dealership) => void;
}
