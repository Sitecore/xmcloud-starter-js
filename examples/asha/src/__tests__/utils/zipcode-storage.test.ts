import {
  clearZipcodeFromSession,
  decodeZipcodeFromStorage,
  encodeZipcodeForStorage,
  readZipcodeFromSession,
  storeZipcodeInSession,
} from '@/utils/zipcode-storage';
import { USER_ZIPCODE } from '@/lib/constants';

describe('zipcode-storage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('round-trips zipcodes through encoded session storage', () => {
    storeZipcodeInSession('90210');

    expect(sessionStorage.getItem(USER_ZIPCODE)).not.toBe('90210');
    expect(readZipcodeFromSession()).toBe('90210');
  });

  it('encodes and decodes zipcodes', () => {
    const encoded = encodeZipcodeForStorage('M5V 2T6');

    expect(encoded).not.toBe('M5V 2T6');
    expect(decodeZipcodeFromStorage(encoded)).toBe('M5V 2T6');
  });

  it('reads legacy cleartext values for backward compatibility', () => {
    sessionStorage.setItem(USER_ZIPCODE, '10001');

    expect(readZipcodeFromSession()).toBe('10001');
  });

  it('clears stored zipcodes', () => {
    storeZipcodeInSession('30301');
    clearZipcodeFromSession();

    expect(readZipcodeFromSession()).toBeNull();
  });
});
