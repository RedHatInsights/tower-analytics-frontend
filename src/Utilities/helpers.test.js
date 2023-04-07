import { trimStr } from './helpers';
import { formatDate } from './helpers';
import { getTotal } from './helpers';
import { capitalize } from './helpers';
import { calculateDelta } from './helpers';
import { convertSecondsToHours } from './helpers';
import { formatJobType } from './helpers';

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
  it('handle date objects', () => {
    expect(formatDate(new Date('2020-10-01'))).toBe('2020-10-01');
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
  it('returns empty string for stringy integer', () => {
    expect(capitalize('3')).toBe('3');
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

describe('Utilities/helpers/formatJobType', () => {
  it('returns "Playbook run" for "job"', () => {
    expect(formatJobType('job')).toBe('Playbook run');
  });
  it('returns "Workflow job" for !"job"', () => {
    expect(formatJobType('foo')).toBe('Workflow job');
  });
});
