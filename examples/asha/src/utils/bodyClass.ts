import { hasDocument } from '@/utils/browser';

export const preventScroll = () => {
  if (!hasDocument) return;
  document.body.classList.add('overflow-hidden');
};

export const allowScroll = () => {
  if (!hasDocument) return;
  document.body.classList.remove('overflow-hidden');
};
