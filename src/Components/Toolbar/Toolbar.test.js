import FilterableToolbar from './Toolbar';
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
  }),
  useLocation: () => ({
    push: jest.fn(),
    pathname: 'some_path',
    search: '',
  }),
}));

const mockCategories = {
  status: [],
  job_type: [],
  org_id: [],
  cluster_id: [],
  template_id: [],
  quick_date_range: [],
  sort_options: [],
};

const mockConfig = {
  defaultParams: {
    status: ['successful', 'failed'],
    quick_date_range: 'last_30_days',
    job_type: ['workflowjob', 'job'],
    org_id: [],
    cluster_id: [],
    template_id: [],
    inventory_id: [],
    sort_by: 'created:desc',
    sort_options: 'created',
    sort_order: 'desc',
    only_root_workflows_and_standalone_jobs: false,
    limit: 5,
    offset: 0,
  },
  namespace: 'foo',
  integerFields: ['limit', 'offset'],
};

const mockFilters = { status: null, quick_date_range: null };

describe('Components/Toolbar/FilterableToolbar', () => {
  describe('General Toolbar', () => {
    it('should render without issuess', () => {
      let wrapper = shallow(
        <FilterableToolbar
          categories={mockCategories}
          filters={mockFilters}
          qsConfig={mockConfig}
          setFilters={() => {}}
        />
      );
      expect(wrapper).toBeTruthy();
    });
    it('should render 3 sections: Filters, Date Range, Sort', () => {
      let wrapper = shallow(
        <FilterableToolbar
          categories={mockCategories}
          filters={mockFilters}
          qsConfig={mockConfig}
          setFilters={() => {}}
        />
      );
      const filters = wrapper.find('FilterCategoriesGroup');
      const date = wrapper.find('QuickDateGroup');
      const sort = wrapper.find('SortByGroup');
      expect(filters.length).toBe(1);
      expect(date.length).toBe(1);
      expect(sort.length).toBe(1);
    });
    it('should render settings if `hasSettings` prop is passed', () => {
      let wrapper = shallow(
        <FilterableToolbar
          categories={mockCategories}
          filters={mockFilters}
          qsConfig={mockConfig}
          setFilters={() => {}}
          hasSettings
        />
      );
      const settings = wrapper.find('Button[aria-label="settings"]');
      expect(settings.length).toBe(1);
    });
    it('should render pagination if `pagination` prop is passed', () => {
      const mockPagination = <span />;
      let wrapper = shallow(
        <FilterableToolbar
          categories={mockCategories}
          filters={mockFilters}
          qsConfig={mockConfig}
          setFilters={() => {}}
          pagination={mockPagination}
        />
      );
      const pagination = wrapper.find('ToolbarItem').find('span');
      expect(pagination.length).toBe(1);
    });
  });
  describe('Category filters', () => {
    it('should render the correct number of categories you pass it', () => {
      const mockCategories = {
        status: [],
        job_type: [],
      };

      let wrapper = mount(
        <FilterableToolbar
          categories={mockCategories}
          filters={mockFilters}
          qsConfig={mockConfig}
          setFilters={() => {}}
        />
      );
      const filterItem = wrapper.find('ToolbarInput');
      expect(filterItem.length).toEqual(Object.keys(mockCategories).length);
    });
    it('should filter out quick_date_range and sort_options params', () => {
      let wrapper = mount(
        <FilterableToolbar
          categories={mockCategories}
          filters={mockFilters}
          qsConfig={mockConfig}
          setFilters={() => {}}
        />
      );
      const filterItem = wrapper
        .find('FilterCategoriesGroup')
        .find('ToolbarInput');
      const { sort_options, quick_date_range, ...rest } = mockCategories;
      expect(filterItem.length).toEqual(Object.keys(rest).length);
    });
  });
});
