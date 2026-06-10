import moment from 'moment';

export const isPositiveNum = (val: number): boolean => /^\d+$/.test(`${val}`);

export const trimStr = (str: string): string => str.replace(/['"]+/g, '');

export const formatTotalTime = (elapsed: number): string =>
  new Date(elapsed * 1000).toISOString().substr(11, 8);

export const formatDateTime = (dateTime: string | number): string =>
  moment(new Date(dateTime).toISOString()).format('M/D/YYYY h:mm:ssa');

export const formatDate = (date: Date | string): string => {
  return moment(date).format('YYYY-MM-DD');
};

export const getTotal = (
  data: { count: number | string }[],
): number | undefined => {
  if (!data) return undefined;

  let total = 0;
  data.forEach(({ count }) => {
    total += +count;
  });
  return total;
};

export const capitalize = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1);

export const calculateDelta = (
  a: string | number,
  b: string | number,
): number => {
  const n1 = +a;
  const n2 = +b;

  if (isNaN(n1) || isNaN(n2)) {
    return 0;
  }

  // never return less than zero ...
  if (n2 - n1 < 0) {
    return 0;
  }

  return n2 - n1;
};

export const today = (days = 0): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const convertSecondsToHours = (seconds: string | number): number =>
  isNaN(+seconds) ? 0 : +seconds / 3600;

export const formatJobType = (type: string): string =>
  type === 'job' ? 'Playbook run' : 'Workflow job';

export const getDateFormatByGranularity = (granularity: string): string => {
  if (granularity === 'yearly') return 'formatAsYear';
  if (granularity === 'monthly') return 'formatAsMonth';
  if (granularity === 'daily') return 'formatDateAsDayMonth';
  return '';
};

export const avgDurationFormatter = (avgDuration: number): string =>
  avgDuration.toFixed(2);

/**
 * Sanitize user input to prevent XSS attacks by escaping HTML special characters
 * @param input - The user input string to sanitize
 * @returns Sanitized string with HTML entities escaped
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return input;

  const htmlEscapeMap: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char]);
};

/**
 * Validate input length against a maximum limit
 * @param input - The input string to validate
 * @param maxLength - Maximum allowed length
 * @returns Object with isValid flag and error message if invalid
 */
export const validateLength = (
  input: string,
  maxLength: number,
): { isValid: boolean; error?: string } => {
  if (!input) {
    return { isValid: true };
  }

  if (input.length > maxLength) {
    return {
      isValid: false,
      error: `Input exceeds maximum length of ${maxLength} characters (current: ${input.length})`,
    };
  }

  return { isValid: true };
};
