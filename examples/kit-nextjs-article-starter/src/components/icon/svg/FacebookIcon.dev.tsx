import { cn } from '@/lib/utils';
import { SvgProps, sharedAttributes } from '../Icon';
import { type JSX } from 'react';

const FacebookIcon = (props: SvgProps): JSX.Element => {
  const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      className={cn('icon--facebook', className)}
      {...sharedAttributes(props)}
    >
      <g clipPath="url(#a)">
        <path
          fill="currentColor"
          d="M11.548 20v-9.122h3.06l.46-3.556h-3.52v-2.27c0-1.03.285-1.731 1.762-1.731l1.882-.001V.14A25.512 25.512 0 0 0 12.45 0C9.735 0 7.877 1.657 7.877 4.7v2.622h-3.07v3.556h3.07V20h3.671Z"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="currentColor" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default FacebookIcon;
