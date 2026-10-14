import { cn } from '@/lib/utils';
import { SvgProps, sharedAttributes } from '../Icon';

import type { JSX } from 'react';

const LeftArrow = (props: SvgProps): JSX.Element => {
  const { className } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 13 13"
      {...sharedAttributes(props)}
      className={cn('icon--arrow-up-right', className)}
    >
      <path
        fill="currentColor"
        d="M1.2942 12.6443.25 11.6l9.8405-9.85H1.1442V.25h11.5001v11.5h-1.5V2.8038l-9.85 9.8405Z"
      />
    </svg>
  );
};

export default LeftArrow;
