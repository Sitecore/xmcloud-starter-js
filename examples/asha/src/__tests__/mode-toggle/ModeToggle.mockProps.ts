// Define ModeToggleProps interface inline since it's not exported from the component
interface ModeToggleProps {
  className?: string;
}

export const defaultModeToggleProps: ModeToggleProps = {
  className: 'test-mode-toggle',
};

export const modeTogglePropsMinimal: ModeToggleProps = {};

export const modeTogglePropsCustomClass: ModeToggleProps = {
  className: 'header-theme-toggle flex items-center',
};
