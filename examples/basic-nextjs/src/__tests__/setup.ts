import '@testing-library/jest-dom';

// next-intl/routing ships ESM only; defineRouting just returns its config (src/i18n/routing.ts).
jest.mock('next-intl/routing', () => ({ defineRouting: <T,>(config: T) => config }));
