import { isNumeric } from './helpers.js';
import { trimStr } from './helpers.js';
import { formatDate } from './helpers.js';
import { formatSeconds } from './helpers.js';
import { formatPercentage } from './helpers.js';
import { getTotal } from './helpers.js';
import { capitalize } from './helpers.js';
import { calculateDelta } from './helpers.js';
import { convertMinsToMs } from './helpers.js';
import { convertMsToMins } from './helpers.js';
import { convertSecondsToMins } from './helpers.js';
import { convertMinsToSeconds } from './helpers.js';
import { convertSecondsToHours } from './helpers.js';
import { convertWithCommas } from './helpers.js';
import { formatJobType } from './helpers.js';

describe('Utilities/helpers/isNumeric', () => {
  it('validates 0', () => {
    expect(isNumeric(0)).toBe(true);
  });
  it('validates stringy 0', () => {
    expect(isNumeric('0')).toBe(true);
  });
  it('validates float 0.0', () => {
    expect(isNumeric(0.0)).toBe(true);
  });
  it('validates float 0.01', () => {
    expect(isNumeric(0.01)).toBe(true);
  });
  it('validates float -0.01', () => {
    expect(isNumeric(-0.01)).toBe(true);
  });
  it('invalidates "a"', () => {
    expect(isNumeric('a')).toBe(false);
  });
  it('invalidates null', () => {
    expect(isNumeric(null)).toBe(false);
  });
  it('invalidates undefined', () => {
    expect(isNumeric(undefined)).toBe(false);
  });
  it('invalidates empty string', () => {
    expect(isNumeric('')).toBe(false);
  });
});

describe('Utilities/helpers/trimStr', () => {
  it('removes outter double quotes', () => {
    expect(trimStr('"foo"')).toBe('foo');
  });
  it('removes inner double quotes', () => {
    expect(trimStr('bar"foo"bar')).toBe('barfoobar');
  });
  it('removes outter single quotes', () => {
    expect(trimStr("'foo'")).toBe('foo');
  });
  it('removes inner single quotes', () => {
    expect(trimStr("bar'foo'bar")).toBe('barfoobar');
  });
});

describe('Utilities/helpers/formatDate', () => {
  it('handles stringy ISO formats', () => {
    expect(formatDate('2020-10-01')).toBe('2020-10-01');
  });
  it('handles stringy ISO formats with timestamps', () => {
    expect(formatDate('2020-10-01T00:00:00')).toBe('2020-10-01');
  });
});

describe('Utilities/helpers/formatSeconds', () => {
  it('handles positive integers', () => {
    expect(formatSeconds(90)).toBe('0:01:30');
  });
  it('handles negative integers', () => {
    expect(formatSeconds(-90)).toBe('23:58:30');
  });
  it('handles stringy integers', () => {
    expect(formatSeconds('90')).toBe('0:01:30');
  });
  it('handles stringy negative integers', () => {
    expect(formatSeconds('-90')).toBe('23:58:30');
  });
});

describe('Utilities/helpers/formatPercentage', () => {
  it('handles a positive integer', () => {
    expect(formatPercentage(1)).toBe('1%');
  });
  it('handles a positive stringy integer', () => {
    expect(formatPercentage('1')).toBe('1%');
  });
  it('handles a positive float', () => {
    expect(formatPercentage(1.0)).toBe('1%');
  });
  it('handles a positive stringy float', () => {
    expect(formatPercentage('1.0')).toBe('1.0%');
  });
  it('handles an integer zero', () => {
    expect(formatPercentage(0)).toBe('0%');
  });
  it('handles an integer stringy zero', () => {
    expect(formatPercentage('0')).toBe('0%');
  });
  it('handles a float zero', () => {
    expect(formatPercentage(0.0)).toBe('0%');
  });
  it('handles a float stringy zero', () => {
    expect(formatPercentage('0.0')).toBe('0.0%');
  });
  it('handles a float less than 1', () => {
    expect(formatPercentage(0.1)).toBe('0.1%');
  });
  it('handles a stringy float less than 1', () => {
    expect(formatPercentage('0.1')).toBe('0.1%');
  });
});

describe('Utilities/helpers/getTotal', () => {
  it('returns zero for an empty list', () => {
    expect(getTotal([])).toBe(0);
  });
  it('returns undefined for a null', () => {
    expect(getTotal(null)).toBe(undefined);
  });
  it('returns undefined for an undefined ', () => {
    expect(getTotal(undefined)).toBe(undefined);
  });
  it('returns NaN for objects with no count properties', () => {
    expect(getTotal([{}, {}])).toBe(NaN);
  });
  it('adds integer .count entries properly', () => {
    expect(getTotal([{ count: 1 }, { count: 1 }])).toBe(2);
  });
  it('adds string .count entries properly', () => {
    expect(getTotal([{ count: '1' }, { count: '1' }])).toBe(2);
  });
});

describe('Utilities/helpers/capitalize', () => {
  it('returns empty string for integer', () => {
    expect(capitalize(3)).toBe('');
  });
  it('returns empty string for stringy integer', () => {
    expect(capitalize('3')).toBe('3');
  });
  it('returns empty string for bool', () => {
    expect(capitalize(true)).toBe('');
  });
  it('returns empty string for empty string', () => {
    expect(capitalize('')).toBe('');
  });
  it('returns Title case for foo', () => {
    expect(capitalize('foo')).toBe('Foo');
  });
  it('returns F for f', () => {
    expect(capitalize('f')).toBe('F');
  });
});

describe('Utilities/helpers/calculateDelta', () => {
  it('subtracts two positive ints', () => {
    expect(calculateDelta(1, 2)).toBe(1);
  });
  it('subtracts two negative ints and round up to 0', () => {
    expect(calculateDelta(-1, -2)).toBe(0);
  });
  it('subtracts from zero and round up to zero', () => {
    expect(calculateDelta(1, 0)).toBe(0);
  });
  it('returns zero for a float result less than zero', () => {
    expect(calculateDelta(3.0, 1.0)).toBe(0);
  });
  it('returns zero if the second val is not an int', () => {
    expect(calculateDelta(1, 'a')).toBe(0);
  });
  it('returns zero if the first val is not an int', () => {
    expect(calculateDelta('a', 1)).toBe(0);
  });
  it('returns int for two stringy ints', () => {
    expect(calculateDelta('1', '2')).toBe(1);
  });
});

describe('Utilities/helpers/convertMinsToMs', () => {
  it('returns zero for null', () => {
    expect(convertMinsToMs(null)).toBe(0);
  });
  it('returns zero for undefined', () => {
    expect(convertMinsToMs(undefined)).toBe(0);
  });
  it('returns zero for non integers', () => {
    expect(convertMinsToMs('a')).toBe(0);
  });
  it('returns 60000 for int 1', () => {
    expect(convertMinsToMs(1)).toBe(60000);
  });
  it('returns 60000 for stringy 1', () => {
    expect(convertMinsToMs('1')).toBe(60000);
  });
  it('returns -60000 for -1', () => {
    expect(convertMinsToMs(-1)).toBe(-60000);
  });
  it('returns 60000 for float 1.0', () => {
    expect(convertMinsToMs(1.0)).toBe(60000);
  });
  it('returns 60000 for stringy float 1.0', () => {
    expect(convertMinsToMs('1.0')).toBe(60000);
  });
});

describe('Utilities/helpers/convertMsToMins', () => {
  it('returns zero for null', () => {
    expect(convertMsToMins(null)).toBe(0);
  });
  it('returns zero for undefined', () => {
    expect(convertMsToMins(undefined)).toBe(0);
  });
  it('returns zero for non integers', () => {
    expect(convertMsToMins('a')).toBe(0);
  });
  it('returns 1 for int 60000', () => {
    expect(convertMsToMins(60000)).toBe(1);
  });
  it('returns 2 for int 120000', () => {
    expect(convertMsToMins(120000)).toBe(2);
  });
  it('returns 1 for stringy int 60000', () => {
    expect(convertMsToMins('60000')).toBe(1);
  });
});

describe('Utilities/helpers/convertSecondsToMins', () => {
  it('returns zero for null', () => {
    expect(convertSecondsToMins(null)).toBe(0);
  });
  it('returns zero for undefined', () => {
    expect(convertSecondsToMins(undefined)).toBe(0);
  });
  it('returns zero for non integers', () => {
    expect(convertSecondsToMins('a')).toBe(0);
  });
  it('returns 1 for int 60', () => {
    expect(convertSecondsToMins(60)).toBe(1);
  });
  it('returns 2 for int 120', () => {
    expect(convertSecondsToMins(120)).toBe(2);
  });
  it('returns 1 for stringy int 60', () => {
    expect(convertSecondsToMins('60')).toBe(1);
  });
});

describe('Utilities/helpers/convertMinsToSeconds', () => {
  it('returns zero for null', () => {
    expect(convertMinsToSeconds(null)).toBe(0);
  });
  it('returns zero for undefined', () => {
    expect(convertMinsToSeconds(undefined)).toBe(0);
  });
  it('returns zero for non integers', () => {
    expect(convertMinsToSeconds('a')).toBe(0);
  });
  it('returns 60 for int 1', () => {
    expect(convertMinsToSeconds(1)).toBe(60);
  });
  it('returns 120 for int 2', () => {
    expect(convertMinsToSeconds(2)).toBe(120);
  });
  it('returns 60 for stringy int 1', () => {
    expect(convertMinsToSeconds('1')).toBe(60);
  });
});

describe('Utilities/helpers/convertSecondsToHours', () => {
  it('returns zero for null', () => {
    expect(convertSecondsToHours(null)).toBe(0);
  });
  it('returns zero for undefined', () => {
    expect(convertSecondsToHours(undefined)).toBe(0);
  });
  it('returns zero for non integers', () => {
    expect(convertSecondsToHours('a')).toBe(0);
  });
  it('returns 1 for int 60*60', () => {
    expect(convertSecondsToHours(60 * 60)).toBe(1);
  });
  it('returns .5 for int 60*30', () => {
    expect(convertSecondsToHours(60 * 30)).toBe(0.5);
  });
  it('returns -1 for int -60*60', () => {
    expect(convertSecondsToHours(-60 * 60)).toBe(-1);
  });
});

describe('Utilities/helpers/convertWithCommas', () => {
  it('returns "1, 2" for the expected array with key foo', () => {
    const array = [{ foo: 1 }, { foo: 2 }];
    expect(convertWithCommas(array, 'foo')).toBe('1, 2');
  });
  it('returns "1, 2, " for element with missing foo', () => {
    const array = [{ foo: 1 }, { foo: 2 }, {}];
    expect(convertWithCommas(array, 'foo')).toBe('1, 2, ');
  });
  it('returns ", , " if all missing foo', () => {
    const array = [{}, {}, {}];
    expect(convertWithCommas(array, 'foo')).toBe(', , ');
  });
});

describe('Utilities/helpers/formatJobType', () => {
  it('returns "Playbook run" for "job"', () => {
    expect(formatJobType('job')).toBe('Playbook run');
  });
  it('returns "Workflow job" for !"job"', () => {
    expect(formatJobType('foo')).toBe('Workflow job');
  });
});
