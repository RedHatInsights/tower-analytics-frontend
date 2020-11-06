import TopTemplates from './TopTemplates';

const dummyData = [
    {
        id: 1,
        name: 'a',
        hostTaskCount: 10,
        hostCount: 10,
        avgRunTime: 3600,
        delta: 50,
        elapsed: 50,
        totalOrgCount: 2,
        totalClusterCount: 20
    },
    {
        id: 2,
        name: 'b',
        hostTaskCount: 10,
        hostCount: 10,
        avgRunTime: 3600,
        delta: 50,
        elapsed: 50,
        totalOrgCount: 2,
        totalClusterCount: 20
    },
    {
        id: 3,
        name: 'c',
        hostTaskCount: 10,
        hostCount: 10,
        avgRunTime: 1980, // Whole minutes
        delta: 50,
        elapsed: 50,
        totalOrgCount: 2,
        totalClusterCount: 20
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
        const wrapper = mount(<TopTemplates data={ dummyData } />);
        expect(wrapper.find('input')).toHaveLength(3);
    });

    it('should call redirect on link click', () => {
        const wrapper = mount(<TopTemplates
            data={ dummyData }
            redirectToJobExplorer={ fn }
        />);
        wrapper.find('a').at(0).simulate('click');
        expect(fn).toHaveBeenCalledWith(1);
    });

    it('should call setDataRunTime with the correct value on input change', () => {
        const wrapper = mount(<TopTemplates
            data={ dummyData }
            setDataRunTime={ fn }
        />);

        // First field
        wrapper.find('input').at(0).simulate('change', {});
        expect(fn).toHaveBeenCalledWith(3600, 1);

        // Last field
        fn.mockReset();
        wrapper.find('input').at(2).simulate('change', {});
        expect(fn).toHaveBeenCalledWith(1980, 3);
    });
});
