import FilterableToolbar from './Toolbar';

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
