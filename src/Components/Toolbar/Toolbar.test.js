import FilterableToolbar from './Toolbar';
import { handleSingleChips, handleCheckboxChips } from './helpers';

describe('Components/Toolbar/handleChips', () => {
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
        const statusesParam = [{ key: 1, value: 'template_name_0' }, { key: 2, value: 'template_name_2' }];
        const expected = [ 'template_name_0' ];
        const result = handleCheckboxChips(statusParam, statusesParam);
        expect(result).toEqual(expect.arrayContaining(expected));
    });
});

describe('Components/Toolbar/handleDateChips', () => {
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
        const comparator = [{ key: 'id:asc', value: 'ID ascending' }, { key: 'id:desc', value: 'ID descending' }];
        const expected = [ 'ID ascending' ];
        const result = handleSingleChips(date, comparator);
        expect(result).toEqual(expected);
    });
    it('should accept a valid date param and a comparator of empty objects and return an empty array, not an array of undefined', () => {
        const date = 'id:asc';
        const comparator = [{ }, { }];
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

describe('Components/Toolbar/FilterableToolbar', () => {
    it('should shallow mount', () => {
        let wrapper = shallow(
            <FilterableToolbar
                categories={ {
                    status: [],
                    quickDateRange: [],
                    jobType: [],
                    orgId: [],
                    clusterId: [],
                    templateId: [],
                    sortBy: []
                } }
                filters={ { status: null, quickDateRange: null } }
            />);
        expect(wrapper).toBeTruthy();
    });
    it('should have 2 button at initialization', () => {
        let wrapper = mount(
            <FilterableToolbar
                categories={ {
                    status: [],
                    quickDateRange: [],
                    jobType: [],
                    orgId: [],
                    clusterId: [],
                    templateId: [],
                    sortBy: []
                } }
                filters={ { status: null, quickDateRange: null } }
            />);
        const buttons = wrapper.find({ className: 'pf-c-select__toggle' });
        expect(buttons.length).toBe(2);
        const buttonTexts = buttons.map((b) => {
            return b.text().trim();
        });
        expect(buttonTexts).toEqual(expect.arrayContaining([ 'Status' ]));
    });
});
