import type { AnimatedSectionProps } from '../../components/animated-section/animated-section.props';

export const defaultProps: AnimatedSectionProps = {
  children: <div data-testid="animated-child">Content</div>,
  className: 'test-class',
};

export const rotateProps: AnimatedSectionProps = {
  ...defaultProps,
  animationType: 'rotate',
  endRotation: 90,
  duration: 500,
};

export const reducedMotionProps: AnimatedSectionProps = {
  ...defaultProps,
  reducedMotion: true,
};

export const editingProps: AnimatedSectionProps = {
  ...defaultProps,
  isPageEditing: true,
};
