import { cn } from '@/lib/utils';
import { SvgProps, sharedAttributes } from '../Icon';

import type { JSX } from 'react';

const LinePlay = (props: SvgProps): JSX.Element => {
  const { className } = props;

  return (
    <svg
      viewBox="0 0 85 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...sharedAttributes(props)}
      className={cn('icon--play', className)}
    >
      <mask id="a" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0">
        <path fill="currentColor" d="M0 0h85v85H0z" />
      </mask>
      <g mask="url(#a)">
        <path
          d="M34.531 56.803V28.196l22.272 14.304-22.272 14.303Z"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
        />
      </g>
    </svg>
  );
};

export default LinePlay;
