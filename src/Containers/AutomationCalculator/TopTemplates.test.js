import TopTemplates from './TopTemplates';

const dummyData = [
    {
        id: 1,
        name: 'a',
        host_cluster_count: 10,
        successful_hosts_total: 10,
        avgRunTime: 3600,
        delta: 50,
        successful_elapsed_total: 50,
        total_org_count: 2,
        total_cluster_count: 20
    },
    {
        id: 2,
        name: 'b',
        host_cluster_count: 10,
        successful_hosts_total: 10,
        avgRunTime: 3600,
        delta: 50,
        successful_elapsed_total: 50,
        total_org_count: 2,
        total_cluster_count: 20
    },
    {
        id: 3,
        name: 'c',
        host_cluster_count: 10,
        successful_hosts_total: 10,
        avgRunTime: 1980, // Whole minutes
        delta: 50,
        successful_elapsed_total: 50,
        total_org_count: 2,
        total_cluster_count: 20
    }
];

describe('Containers/AutomationCalculator/TopTemplates', () => {
    const fn = jest.fn();

    afterEach(() => {
        fn.mockReset();
    });

    it('should render without any params', () => {
        const wrapper = mount(<TopTemplates />);
        expect(wrapper).toBeTruthy();
    });

    it('should render with dummy data', () => {
        const wrapper = mount(<TopTemplates data={dummyData} sortBy={'foo:asc'} />);
        expect(wrapper.find('input')).toHaveLength(3);
    });

    it('should call redirect on link click', () => {
        const wrapper = mount(
            <TopTemplates data={dummyData} redirectToJobExplorer={fn} sortBy={'foo:desc'} />
        );
        wrapper
        .find('a')
        .at(0)
        .simulate('click');
        expect(fn).toHaveBeenCalledWith(1);
    });

    it('should call setDataRunTime with the correct value on input change', () => {
        const wrapper = mount(
            <TopTemplates data={dummyData} setDataRunTime={fn} sortBy={'foo'} />
        );

        // First field
        wrapper
        .find('input')
        .at(0)
        .simulate('change', {});
        expect(fn).toHaveBeenCalledWith(3600, 1);

        // Last field
        fn.mockReset();
        wrapper
        .find('input')
        .at(2)
        .simulate('change', {});
        expect(fn).toHaveBeenCalledWith(1980, 3);
    });
});
