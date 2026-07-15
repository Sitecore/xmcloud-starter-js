import type { RefObject } from 'react';

export interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  componentRef: RefObject<HTMLDivElement | null>;
}
