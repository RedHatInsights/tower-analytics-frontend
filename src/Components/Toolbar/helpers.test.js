import { handleSingleChips, handleCheckboxChips } from './helpers';

describe('Components/Toolbar/helpers/handleCheckboxChips', () => {
    it('should accept two nulls and return an empty array', () => {
        const statusParam = null;
        const statusesParam = null;
        const expected = [];
        const result = handleCheckboxChips(statusParam, statusesParam);
        expect(result).toEqual(expect.arrayContaining(expected));
    });
    it('should accept two empty arrays and return an empty array', () => {
        const statusParam = [];
        const statusesParam = [];
        const expected = [];
        const result = handleCheckboxChips(statusParam, statusesParam);
        expect(result).toEqual(expect.arrayContaining(expected));
    });
    it('should accept empty status and non-empty stateues and return an empty array', () => {
        const statusParam = [];
        const statusesParam = [{ key: 1, value: 'template_name_0' }];
        const expected = [];
        const result = handleCheckboxChips(statusParam, statusesParam);
        expect(result).toEqual(expect.arrayContaining(expected));
    });
    it('should trim the statuses down to the value of the key given by status', () => {
        const statusParam = [ 1 ];
        const statusesParam = [
            { key: 1, value: 'template_name_0' },
            { key: 2, value: 'template_name_2' }
        ];
        const expected = [ 'template_name_0' ];
        const result = handleCheckboxChips(statusParam, statusesParam);
        expect(result).toEqual(expect.arrayContaining(expected));
    });
});

describe('Components/Toolbar/helpers/handleSingleChips', () => {
    it('should accept two undefineds and return an empty array', () => {
        const date = undefined;
        const comparator = undefined;
        const expected = [];
        const result = handleSingleChips(date, comparator);
        expect(result).toEqual(expected);
    });
    it('should accept two nulls and return an empty array', () => {
        const date = null;
        const comparator = null;
        const expected = [];
        const result = handleSingleChips(date, comparator);
        expect(result).toEqual(expected);
    });
    it('should accept a null date and return an empty array', () => {
        const date = null;
        const comparator = [{ key: 'id:asc', value: 'ID ascending' }];
        const expected = [];
        const result = handleSingleChips(date, comparator);
        expect(result).toEqual(expected);
    });
    it('should accept a valid date param and return a non-empty array', () => {
        const date = 'id:asc';
        const comparator = [
            { key: 'id:asc', value: 'ID ascending' },
            { key: 'id:desc', value: 'ID descending' }
        ];
        const expected = [ 'ID ascending' ];
        const result = handleSingleChips(date, comparator);
        expect(result).toEqual(expected);
    });
    it('should accept a valid date param and a comparator of empty objects and return an empty array, not an array of undefined', () => {
        const date = 'id:asc';
        const comparator = [{}, {}];
        const result = handleSingleChips(date, comparator);
        expect(result).toEqual([]);
    });
    it('should accept a valid date param and a null comparator and return an empty array, not an array of undefined', () => {
        const date = 'id:asc';
        const comparator = null;
        const result = handleSingleChips(date, comparator);
        expect(result).toEqual([]);
    });
});
