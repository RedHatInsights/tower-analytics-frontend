import FilterableToolbar from './Toolbar';

describe('Components/Toolbar/FilterableToolbar', () => {
    it('should shallow mount', () => {
        let wrapper = shallow(
            <FilterableToolbar
                categories={ {
                    status: [],
                    quick_date_range: [],
                    job_type: [],
                    org_id: [],
                    cluster_id: [],
                    template_id: [],
                    sort_by: []
                } }
                filters={ { status: null, quick_date_range: null } }
            />);
        expect(wrapper).toBeTruthy();
    });
    it('should have 2 button at initialization', () => {
        let wrapper = mount(
            <FilterableToolbar
                categories={ {
                    status: [],
                    job_type: [],
                    org_id: [],
                    cluster_id: [],
                    template_id: [],
                    quick_date_range: [],
                    sort_by: []
                } }
                filters={ { status: null, quick_date_range: null } }
            />);
        const selectBoxes = wrapper.find({ className: 'pf-c-select__toggle' });

        // Categories, filter, date, sort
        expect(selectBoxes.length).toBe(4);
        const selectBoxTexts = selectBoxes.map((b) => {
            return b.text().trim();
        });

        // Initialized with the placeholders since we passed an empty array to them.
        expect(selectBoxTexts).toStrictEqual(
            [
                'Status',
                'Filter by job status',
                'Filter by date',
                'Sort by attribute'
            ]);
    });
});
