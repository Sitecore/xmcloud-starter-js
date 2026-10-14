export interface ZipcodeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (zipcode: string) => void;
  onUseMyLocation: () => void;
  isGeoLoading: boolean;
  error?: string | null;
}

export const defaultZipcodeModalProps: ZipcodeModalProps = {
  open: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  onUseMyLocation: jest.fn(),
  isGeoLoading: false,
  error: null,
};

export const zipcodeModalPropsNotOpen: ZipcodeModalProps = {
  ...defaultZipcodeModalProps,
  open: false,
};

export const zipcodeModalPropsWithError: ZipcodeModalProps = {
  ...defaultZipcodeModalProps,
  error: 'Location access denied. Please enter your zipcode manually.',
};

export const zipcodeModalPropsGeoLoading: ZipcodeModalProps = {
  ...defaultZipcodeModalProps,
  isGeoLoading: true,
};

export const zipcodeModalPropsLocationError: ZipcodeModalProps = {
  ...defaultZipcodeModalProps,
  error: 'Unable to determine your location. GPS signal not available.',
};

export const zipcodeModalPropsPermissionDenied: ZipcodeModalProps = {
  ...defaultZipcodeModalProps,
  error: 'Location permission denied. Please allow location access or enter zipcode manually.',
};

export const zipcodeModalPropsNetworkError: ZipcodeModalProps = {
  ...defaultZipcodeModalProps,
  error:
    'Network error occurred while accessing location services. Please try again or enter zipcode manually.',
};

export const zipcodeModalPropsLongError: ZipcodeModalProps = {
  ...defaultZipcodeModalProps,
  error:
    'We encountered an unexpected error while trying to access your location services. This could be due to various factors including browser settings, device permissions, network connectivity issues, or temporary service unavailability. Please try enabling location services for this website in your browser settings, or alternatively, you can enter your zipcode manually below.',
};

export const zipcodeModalPropsSpecialCharsError: ZipcodeModalProps = {
  ...defaultZipcodeModalProps,
  error:
    "Erreur d'accès à la localisation: permission refusée & services indisponibles. Veuillez saisir votre code postal manuellement.",
};

export const zipcodeModalPropsAllCallbacks: ZipcodeModalProps = {
  open: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  onUseMyLocation: jest.fn(),
  isGeoLoading: false,
  error: null,
};

export const zipcodeModalPropsGeoLoadingLong: ZipcodeModalProps = {
  ...defaultZipcodeModalProps,
  isGeoLoading: true,
  error: 'Taking longer than expected to get your location...',
};

// Mock callback functions for testing specific scenarios
export const mockOnClose = jest.fn();
export const mockOnSubmit = jest.fn();
export const mockOnUseMyLocation = jest.fn();

export const zipcodeModalPropsWithMockCallbacks: ZipcodeModalProps = {
  open: true,
  onClose: mockOnClose,
  onSubmit: mockOnSubmit,
  onUseMyLocation: mockOnUseMyLocation,
  isGeoLoading: false,
  error: null,
};

// Valid zipcode test cases
export const validZipcodes = [
  '12345',
  '90210',
  '10001',
  '12345-6789',
  '90210-1234',
  '00501', // Smallest valid zipcode (Holtsville, NY)
  '99950', // Largest valid zipcode (Ketchikan, AK)
];

// Invalid zipcode test cases
export const invalidZipcodes = [
  '', // Empty
  '   ', // Whitespace only
  '1234', // Too short
  '123456', // Too long without hyphen
  '12345-123', // Invalid extended format
  '12345-12345', // Extended part too long
  'abcde', // Letters
  '12a45', // Mixed letters and numbers
  '12345-abc4', // Letters in extended part
  '12-345', // Hyphen in wrong position
  '-12345', // Leading hyphen
  '12345-', // Trailing hyphen
  '12 345', // Space instead of hyphen
  '12345 6789', // Space in extended format
  '!@#$%', // Special characters
  '12345-!@#$', // Special characters in extended part
  '12345--6789', // Double hyphen
  '12345-6789-0123', // Multiple hyphens
];

// Edge case zipcodes
export const edgeCaseZipcodes = [
  '00000', // All zeros (technically invalid but might pass regex)
  '99999', // All nines
  '12345-0000', // Extended with all zeros
  '12345-9999', // Extended with all nines
];

// Simulation delays for testing loading states
export const simulationDelays = {
  short: 100,
  medium: 500,
  long: 1000,
  veryLong: 3000,
};

// Mock form events
export const createMockFormEvent = (zipcode: string = '') => ({
  preventDefault: jest.fn(),
  target: {
    elements: {
      zipcode: { value: zipcode },
    },
  },
});

export const createMockInputEvent = (value: string) => ({
  target: { value },
  currentTarget: { value },
});

// Mock keyboard events
export const createMockKeyboardEvent = (key: string) => ({
  key,
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
});

// Test user interactions
export const userInteractionScenarios = {
  typingValidZipcode: {
    steps: [
      { action: 'type', value: '1' },
      { action: 'type', value: '12' },
      { action: 'type', value: '123' },
      { action: 'type', value: '1234' },
      { action: 'type', value: '12345' },
    ],
  },
  typingInvalidZipcode: {
    steps: [
      { action: 'type', value: 'a' },
      { action: 'type', value: 'ab' },
      { action: 'type', value: 'abc' },
      { action: 'type', value: 'abcd' },
      { action: 'type', value: 'abcde' },
    ],
  },
  correctingZipcode: {
    steps: [
      { action: 'type', value: 'abcde' },
      { action: 'clear' },
      { action: 'type', value: '12345' },
    ],
  },
  extendedZipcode: {
    steps: [
      { action: 'type', value: '12345' },
      { action: 'type', value: '12345-' },
      { action: 'type', value: '12345-6789' },
    ],
  },
};

// Accessibility test scenarios
export const accessibilityScenarios = {
  keyboardNavigation: [
    { key: 'Tab', description: 'Navigate to zipcode input' },
    { key: 'Tab', description: 'Navigate to location button' },
    { key: 'Tab', description: 'Navigate to submit button' },
    { key: 'Tab', description: 'Navigate to close button (if present)' },
  ],
  keyboardSubmission: [
    { key: 'Enter', description: 'Submit form with Enter key' },
    { key: ' ', description: 'Activate button with Space key' },
  ],
  escapeHandling: [{ key: 'Escape', description: 'Close modal with Escape key' }],
};

// Performance test scenarios
export const performanceScenarios = {
  rapidSubmissions: {
    count: 10,
    interval: 50,
    description: 'Rapidly submit form multiple times',
  },
  rapidLocationRequests: {
    count: 5,
    interval: 100,
    description: 'Rapidly request location multiple times',
  },
  largeDataInput: {
    zipcode: '1'.repeat(1000), // Very long input to test performance
    description: 'Test with extremely long input',
  },
};

// Mock geolocation API responses
export const mockGeolocationSuccess = {
  coords: {
    latitude: 40.7128,
    longitude: -74.006,
    accuracy: 10,
  },
  timestamp: Date.now(),
};

export const mockGeolocationError = {
  code: 1, // PERMISSION_DENIED
  message: 'User denied the request for Geolocation.',
};

export const mockGeolocationTimeout = {
  code: 3, // TIMEOUT
  message: 'The request to get user location timed out.',
};

export const mockGeolocationUnavailable = {
  code: 2, // POSITION_UNAVAILABLE
  message: 'Location information is unavailable.',
};

// Form validation messages
export const validationMessages = {
  required: 'Please enter a valid zipcode',
  invalidFormat: 'Please enter a valid 5-digit zipcode',
  tooShort: 'Zipcode must be at least 5 digits',
  tooLong: 'Zipcode format is invalid',
  invalidCharacters: 'Zipcode can only contain numbers and hyphens',
  invalidExtended: 'Extended zipcode format must be 5+4 digits',
};

// Component state scenarios for testing
export const componentStateScenarios = {
  initialState: {
    zipcode: '',
    inputError: null,
    isSubmitting: false,
  },
  validInput: {
    zipcode: '12345',
    inputError: null,
    isSubmitting: false,
  },
  invalidInput: {
    zipcode: 'abcde',
    inputError: 'Please enter a valid 5-digit zipcode',
    isSubmitting: false,
  },
  submitting: {
    zipcode: '12345',
    inputError: null,
    isSubmitting: true,
  },
  submitSuccess: {
    zipcode: '',
    inputError: null,
    isSubmitting: false,
  },
  submitError: {
    zipcode: '12345',
    inputError: 'Submission failed. Please try again.',
    isSubmitting: false,
  },
};
