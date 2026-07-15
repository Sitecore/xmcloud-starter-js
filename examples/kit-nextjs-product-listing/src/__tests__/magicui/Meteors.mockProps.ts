// Define MeteorsProps interface inline since it's not exported from the component
interface MeteorsProps {
  number?: number;
  minDelay?: number;
  maxDelay?: number;
  minDuration?: number;
  maxDuration?: number;
  angle?: number;
  className?: string;
  color?: string;
  size?: string;
}

export const defaultMeteorsProps: MeteorsProps = {
  number: 20,
  minDelay: 0.2,
  maxDelay: 1.2,
  minDuration: 2,
  maxDuration: 10,
  angle: 215,
  className: 'test-meteors',
  color: 'white',
  size: '1',
};

export const meteorsPropsMinimal: MeteorsProps = {
  number: 5,
};

export const meteorsPropsCustom: MeteorsProps = {
  number: 10,
  minDelay: 0.5,
  maxDelay: 2.0,
  minDuration: 1,
  maxDuration: 5,
  angle: 180,
  className: 'custom-meteors bg-blue-500',
  color: 'blue',
  size: '2',
};

export const meteorsPropsLarge: MeteorsProps = {
  number: 50,
  minDelay: 0.1,
  maxDelay: 0.5,
  minDuration: 1,
  maxDuration: 3,
  angle: 90,
  size: '4',
};
