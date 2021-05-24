import React from 'react';
import { mount } from 'enzyme';
import { useQueryParams } from './useQueryParams';
import { act } from 'react-dom/test-utils';
import moment from 'moment';

/* See https://github.com/testing-library/react-testing-library/pull/274
for more details regarding the need to create a test component to call
custom hooks from within a testing environment. */

const TestHook = ({ callback }) => {
  callback();
  return null;
};

const testHook = (callback) => {
  mount(<TestHook callback={callback} />);
};

const initialValues = {
  foo: '1',
  bar: 2,
  sort_options: 'count',
  sort_order: 'asc',
};

let page;

beforeEach(() => {
  testHook(() => {
    page = useQueryParams(initialValues);
  });
});

afterEach(() => {
  page = null;
});

describe('Utilities/useQueryParams', () => {
  it('returns expected initial values as queryParams, as well as computed sort_by value (if applicable)', () => {
    expect(page.queryParams).toEqual({
      ...initialValues,
      sort_by: 'count:asc',
    });
    const noSortOrderInitialValues = {
      foo: '1',
      bar: 2,
      sort_options: 'count',
    };
    testHook(() => {
      page = useQueryParams(noSortOrderInitialValues);
    });
    expect(page.queryParams).toEqual(noSortOrderInitialValues);
    const noSortOptionsInitialValues = { foo: '1', bar: 2, sort_order: 'asc' };
    testHook(() => {
      page = useQueryParams(noSortOptionsInitialValues);
    });
    expect(page.queryParams).toEqual(noSortOptionsInitialValues);
  });

  it('returns setId, setStartDate and setEndDate as methods', () => {
    expect(page.setId).toBeInstanceOf(Function);
    expect(page.setStartDate).toBeInstanceOf(Function);
    expect(page.setEndDate).toBeInstanceOf(Function);
  });

  it('invoked methods returns new queryParams object', () => {
    act(() => {
      page.setId(1);
    });
    expect(page.queryParams).toEqual({
      ...initialValues,
      sort_by: 'count:asc',
      id: 1,
    });
  });

  it('setId correctly handles null, undefined and NaN values', () => {
    act(() => {
      page.setId(null);
    });
    expect(page.queryParams).toEqual({
      foo: '1',
      bar: 2,
      sort_by: 'count:asc',
      sort_options: 'count',
      sort_order: 'asc',
    });
  });

  it('setEndDate returns current day in `YYYY-MM-DD` string format', () => {
    const currentDate = moment(new Date().toISOString()).format('YYYY-MM-DD');
    act(() => {
      page.setEndDate();
    });
    expect(page.queryParams).toEqual({
      ...initialValues,
      sort_by: 'count:asc',
      endDate: currentDate,
    });
  });

  it('setStartDate returns current day if passed a null value', () => {
    const currentDate = moment(new Date().toISOString()).format('YYYY-MM-DD');
    act(() => {
      page.setStartDate(null);
    });
    expect(page.queryParams).toEqual({
      ...initialValues,
      sort_by: 'count:asc',
      startDate: currentDate,
    });
  });

  it('setStartDate returns expected day when invoked', () => {
    const days = 8;
    const date = new Date(new Date().setDate(new Date().getDate() - days));
    const expected = moment(date.toISOString()).format('YYYY-MM-DD');
    act(() => {
      page.setStartDate(days);
    });
    expect(page.queryParams).toEqual({
      ...initialValues,
      sort_by: 'count:asc',
      startDate: expected,
    });
  });
});
