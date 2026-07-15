import type { RefObject } from 'react';

export type VideoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  componentRef: RefObject<HTMLDivElement | null>;
};
