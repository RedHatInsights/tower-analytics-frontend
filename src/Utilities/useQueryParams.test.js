/*eslint camelcase: ["error", {properties: "never", ignoreDestructuring: true}]*/
import { mount } from 'enzyme';
import { useQueryParams } from './useQueryParams/';
import { act } from 'react-dom/test-utils';

/* See https://github.com/testing-library/react-testing-library/pull/274
for more details regarding the need to create a test component to call
custom hooks from within a testing environment. */

const TestHook = ({ callback }) => {
    callback();
    return null;
};

const testHook = (callback) => {
    mount(<TestHook callback={ callback } />);
};

const initialValues = { foo: '1', bar: 2, sort_by: 'count:asc' };

let page;

beforeEach(() => {
    testHook(() => {
        page = useQueryParams(initialValues);
    });
});

describe('Utilities/useQueryParams', () => {
    it('returns expected initial values as queryParams ', () => {
        expect(page.queryParams).toEqual(initialValues);
    });

    it('returns setId, setStartDate, setEndDate, setSortBy, and setLimit as methods', () => {
        expect(page.setId).toBeInstanceOf(Function);
        expect(page.setStartDate).toBeInstanceOf(Function);
        expect(page.setEndDate).toBeInstanceOf(Function);
        expect(page.setSortBy).toBeInstanceOf(Function);
        expect(page.setLimit).toBeInstanceOf(Function);
    });

    it('invoked methods returns new queryParams object', () => {
        act(() => {
            page.setId(1);
            page.setLimit(2);
        });
        expect(page.queryParams).toEqual({ ...initialValues, id: 1, limit: 2 });
    });

    it('invoked methods correctly update existing values in queryParams object', () => {
        act(() => {
            page.setSortBy('count:desc');
        });
        expect(page.queryParams).toEqual({ foo: '1', bar: 2, sort_by: 'count:desc' });
    });

    it('setId, setLimit, setSortBy correctly handles null, undefined and NaN values', () => {
        act(() => {
            page.setId(null);
            page.setLimit(undefined);
            page.setSortBy(NaN);
        });
        expect(page.queryParams).toEqual({ foo: '1', bar: 2 });
    });

    it('setEndDate returns current day in `YYYY-MM-DD` string format', () => {
        const currentDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
        act(() => {
            page.setEndDate();
        });
        expect(page.queryParams).toEqual({ ...initialValues, endDate: currentDate });
    });

    it('setStartDate returns current day if passed a null value', () => {
        const currentDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
        act(() => {
            page.setStartDate(null);
        });
        expect(page.queryParams).toEqual({ ...initialValues, startDate: currentDate });
    });

    it('setStartDate returns expected day when invoked', () => {
        const days = 8;
        const date = new Date(new Date().setDate(new Date().getDate() - days));
        const expected = date.toJSON().slice(0, 10).replace(/-/g, '-');
        act(() => {
            page.setStartDate(days);
        });
        expect(page.queryParams).toEqual({ ...initialValues, startDate: expected });
    });
    it('setSortBy returns nothing when specifying a non-column type', () => {
        act(() => {
            page.setSortBy('foo');
        });
        expect(page.queryParams).toEqual({ foo: '1', bar: 2 });
    });
    it('setLimit returns expected value', () => {
        act(() => {
            page.setLimit(10);
        });
        expect(page.queryParams).toEqual({ ...initialValues, limit: 10 });
    });
    it('setLimit returns nothing when passed a non-integer value', () => {
        act(() => {
            page.setLimit('bar');
        });
        expect(page.queryParams).toEqual({ ...initialValues });
    });
    it('setLimit and setId cast strings into integers when passed string values', () => {
        act(() => {
            page.setLimit('10');
            page.setId('100');
        });
        expect(page.queryParams).toEqual({ ...initialValues, id: 100, limit: 10 });
    });
});
