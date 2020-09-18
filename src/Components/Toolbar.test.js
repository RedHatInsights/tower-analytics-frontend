/*eslint-disable */
import { mount,shallow } from 'enzyme';
import FilterableToolbar from './Toolbar';
import { handleChips } from './Toolbar';
import { handleDateChips } from './Toolbar';

describe('Components/Toolbar/handleChips', () => {
    it('should accept two nulls and return an empty array', () => {
        const statusParam = null;
        const statusesParam = null;
        const expected = [];
        const result = handleChips(statusParam, statusesParam);
        expect(result).toEqual(expect.arrayContaining(expected));
    });
    it('should accept two empty arrays and return an empty array', () => {
        const statusParam = [];
        const statusesParam = [];
        const expected = [];
        const result = handleChips(statusParam, statusesParam);
        expect(result).toEqual(expect.arrayContaining(expected));
    });
    it('should accept empty status and non-empty stateues and return an empty array', () => {
        const statusParam = [];
        const statusesParam = [{key: 1, value: 'template_name_0'}];
        const expected = [];
        const result = handleChips(statusParam, statusesParam);
        expect(result).toEqual(expect.arrayContaining(expected));
    });
    it('should trim the statuses down to the value of the key given by status', () => {
        const statusParam = [1];
        const statusesParam = [{key: 1, value: 'template_name_0'}, {key: 2, value: 'template_name_2'}];
        const expected = ['template_name_0'];
        const result = handleChips(statusParam, statusesParam);
        expect(result).toEqual(expect.arrayContaining(expected));
    });
});

describe('Components/Toolbar/handleDateChips', () => {
    it('should accept two nulls and return an empty array', () => {
        const date = null;
        const comparator = null;
        const expected = new Array();
        const result = handleDateChips(date, comparator);
        expect(result).toEqual(expect.arrayContaining(expected));
    });
    it('should accept a null date and return an empty array', () => {
        const date = null;
        const comparator = [{key: 'id:asc', value: 'ID ascending'}];
        const expected = new Array();
        const result = handleDateChips(date, comparator);
        expect(result).toEqual(expect.arrayContaining(expected));
    });
    it('should accept a valid date param and return a non-empty array', () => {
        const date = 'id:asc';
        const comparator = [{key: 'id:asc', value: 'ID ascending'}, {key: 'id:desc', value: 'ID descending'}];
        const expected = ['ID ascending'];
        const result = handleDateChips(date, comparator);
        expect(result).toEqual(expect.arrayContaining(expected));
    });

});

describe('Components/Toolbar/FilterableToolbar', () => {
    it('should shallow mount', () => {
        let wrapper = shallow(
            <FilterableToolbar
                orgs={[]}
                statuses={[]}
                types={[]}
                clusters={[]}
                templates={[]}
                sortables={[]}
                dateRanges={[]}
                passedFilters={{ status: null }}
            />);
    });
});
