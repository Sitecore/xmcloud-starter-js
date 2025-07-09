/**
 * Formats a date string in UTC timezone
 * @param dateString - ISO date string
 * @param options - Additional Intl.DateTimeFormat options
 * @returns Formatted date string in UTC
 */
export function formatDateInUTC(dateString: string, options: Intl.DateTimeFormatOptions = {}) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
    ...options,
  });
}

/**
 * Formats a date string with custom format options
 * @param dateString - ISO date string
 * @param options - Format options
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string,
  options: {
    format?: 'full' | 'long' | 'medium' | 'short';
    locale?: string;
    timeZone?: string;
  } = {}
) {
  const { format = 'full', locale = 'en-US', timeZone = 'UTC' } = options;

  const date = new Date(dateString);

  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone,
  };

  switch (format) {
    case 'full':
      formatOptions.month = 'long';
      formatOptions.day = 'numeric';
      formatOptions.year = 'numeric';
      break;
    case 'long':
      formatOptions.month = 'long';
      formatOptions.day = 'numeric';
      formatOptions.year = 'numeric';
      break;
    case 'medium':
      formatOptions.month = 'short';
      formatOptions.day = 'numeric';
      formatOptions.year = 'numeric';
      break;
    case 'short':
      formatOptions.month = 'numeric';
      formatOptions.day = 'numeric';
      formatOptions.year = '2-digit';
      break;
  }

  return date.toLocaleDateString(locale, formatOptions);
}
