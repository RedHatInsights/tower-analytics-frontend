import { mount } from 'enzyme';
import { useQueryParams } from './useQueryParams';
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

const initialValues = { foo: '1', bar: 2, sortBy: 'count:asc' };

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
    it('returns expected initial values as queryParams ', () => {
        expect(page.queryParams).toEqual(initialValues);
    });

    it('returns setId, setStartDate, setEndDate, and setLimit as methods', () => {
        expect(page.setId).toBeInstanceOf(Function);
        expect(page.setStartDate).toBeInstanceOf(Function);
        expect(page.setEndDate).toBeInstanceOf(Function);
        expect(page.setLimit).toBeInstanceOf(Function);
    });

    it('invoked methods returns new queryParams object', () => {
        act(() => {
            page.setId(1);
            page.setLimit(2);
        });
        expect(page.queryParams).toEqual({ ...initialValues, id: 1, limit: 2 });
    });

    it('setId, setLimit correctly handles null, undefined and NaN values', () => {
        act(() => {
            page.setId(null);
            page.setLimit(undefined);
        });
        expect(page.queryParams).toEqual({ foo: '1', bar: 2, sortBy: 'count:asc' });
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
