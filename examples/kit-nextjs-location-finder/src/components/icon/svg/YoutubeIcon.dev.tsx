import { SvgProps, sharedAttributes } from '../Icon';

import { cn } from '@/lib/utils';

import type { JSX } from 'react';

const YoutubeIcon = (props: SvgProps): JSX.Element => {
  const { className } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 36 37"
      className={cn('icon--youtube', className)}
      {...sharedAttributes(props)}
    >
      <path
        fill="currentColor"
        d="M18 5.51294c-5.0232 0-11.54294 1.25859-11.54294 1.25859l-.01641.01875c-2.28783.3659-4.04063 2.33181-4.04063 4.72262v14.4024c.00224 1.1418.41145 2.2455 1.15416 3.1128.74272.8672 1.77028 1.4414 2.89819 1.6192l.00469.007S12.9768 31.9153 18 31.9153s11.543-1.261 11.543-1.261l.0023-.0023c1.1292-.1775 2.1579-.752 2.9012-1.6204.7433-.8683 1.1523-1.9733 1.1535-3.1163V11.5129c-.0016-1.1422-.4106-2.24642-1.1534-3.11419-.7427-.86777-1.7706-1.44223-2.8989-1.62015l-.0047-.00703S23.0232 5.51294 18 5.51294Zm-3.6 7.67816 9.6 5.5218-9.6 5.5219V13.1911Z"
      />
    </svg>
  );
};

export default YoutubeIcon;
