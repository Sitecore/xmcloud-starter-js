import React from 'react';
import { render, screen } from '@testing-library/react';
import { InputOTP } from '@/components/ui/input-otp';

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(' '),
}));

// Mock input-otp library with context
jest.mock('input-otp', () => {
  const OTPInputContext = React.createContext<{
    slots: Array<{ char: string; hasFakeCaret: boolean; isActive: boolean }>;
  }>({
    slots: Array(6).fill({ char: '', hasFakeCaret: false, isActive: false }),
  });

  const OTPInput = React.forwardRef<
    HTMLInputElement,
    React.PropsWithChildren<{
      maxLength?: number;
      render?: (props: unknown) => React.ReactNode;
      containerClassName?: string;
    }>
  >(({ children, render, maxLength = 6, containerClassName, ...props }, ref) => {
    const slots = Array(maxLength)
      .fill(null)
      .map(() => ({ char: '', hasFakeCaret: false, isActive: false }));

    if (render) {
      return (
        <OTPInputContext.Provider value={{ slots }}>
          <div
            ref={ref as React.Ref<HTMLDivElement>}
            data-testid="otp-input"
            className={containerClassName}
            {...props}
          >
            {render({ slots })}
          </div>
        </OTPInputContext.Provider>
      );
    }
    return (
      <OTPInputContext.Provider value={{ slots }}>
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          data-testid="otp-input"
          className={containerClassName}
          {...props}
        >
          {children}
        </div>
      </OTPInputContext.Provider>
    );
  });
  OTPInput.displayName = 'OTPInput';

  return { OTPInput, OTPInputContext };
});

describe('InputOTP', () => {
  it('renders input OTP', () => {
    render(
      <InputOTP maxLength={6}>
        <div>OTP Input</div>
      </InputOTP>
    );

    expect(screen.getByTestId('otp-input')).toBeInTheDocument();
  });

  it('renders with custom maxLength', () => {
    render(
      <InputOTP maxLength={4}>
        <div>OTP Input</div>
      </InputOTP>
    );

    expect(screen.getByTestId('otp-input')).toBeInTheDocument();
  });
});
