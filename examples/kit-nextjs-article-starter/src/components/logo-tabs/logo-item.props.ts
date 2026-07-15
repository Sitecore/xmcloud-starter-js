import { LogoItemProps } from './logo-tabs.props';

export interface LogoButtonProps extends LogoItemProps {
  isActive: boolean;
  onClick: () => void;
  id: string;
  controls: string;
}
