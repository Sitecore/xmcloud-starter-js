import { cn } from '@/lib/utils';
import { SvgProps, sharedAttributes } from '../Icon';

import type { JSX } from 'react';

const FileIcon = (props: SvgProps): JSX.Element => {
  const { className } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('icon--file lucide lucide-arrow-down-to-lin', className)}
      {...sharedAttributes(props)}
    >
      <path d="M12 17V3" />
      <path d="m6 11 6 6 6-6" />
      <path d="M19 21H5" />
    </svg>
  );
};

export default FileIcon;
