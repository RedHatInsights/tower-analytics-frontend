import { act } from 'react-dom/test-utils';
import ModalContents from './ModalContents';
import fetchMock from 'fetch-mock-jest';

const jobExplorerUrl = 'path:/api/tower-analytics/v1/job_explorer/';

const mockStats = {
    items: [
        {
            elapsed: 1268.6,
            failed_count: 101,
            id: 2,
            name: 'template_name_0',
            successful_count: 115,
            total_count: 216
        }
    ]
};

const mockQueryParams = {
    status: [ 'successful', 'failed' ],
    quick_date_range: 'last_30_days',
    job_type: [ 'workflowjob', 'job' ],
    group_by_time: true,
    org_id: [],
    cluster_id: [],
    template_id: [],
    only_root_workflows_and_standalone_jobs: false
};

const mockRelatedJobs = {
    items: [
        {
            cluster_name: 'ec2-52-90-106-01.compute-1.amazonaws.com',
            created: '2020-12-05T00:00:00',
            elapsed: 5.873,
            finished: '2020-12-05T00:00:05',
            id: {
                cluster_id: 2,
                cluster_url_base: 'https://ec2-52-90-106-01.compute-1.amazonaws.com',
                id: 1800,
                template_id: 2,
                template_name: 'template_name_0',
                tower_link: 'https://ec2-52-90-106-01.compute-1.amazonaws.com/#/jobs/playbook/1800'
            },
            job_type: 'job',
            org_name: 'organization_0',
            started: '2020-12-05T00:00:01',
            status: 'successful'
        }
    ]
};

describe('Components/ModalContents', () => {
    let wrapper;

    beforeEach(() => {
        fetchMock.post({
            url: jobExplorerUrl,
            repeat: 1
        }, { ...mockStats });
        fetchMock.post({
            url: jobExplorerUrl,
            body: { limit: 5, sort_by: 'created:asc' },
            matchPartialBody: true,
            overwriteRoutes: false,
            repeat: 1
        }, { ...mockRelatedJobs });
    });

    afterEach(() => {
        fetchMock.restore();
        wrapper = null;
    });

    it('should render successfully', async () => {
        await act(async () => {
            wrapper = mount(
                <ModalContents
                    isOpen={ true }
                    handleModal={ () => {} }
                    selectedId={ 1 }
                    qp={ mockQueryParams }
                    jobType={ 'Foo' }
                    handleCloseBtn={ () => { } }
                />);
        });

        wrapper.update();
        expect(wrapper).toBeTruthy();
    });
    it('should display the correct Template name', async () => {
        await act(async () => {
            wrapper = mount(
                <ModalContents
                    isOpen={ true }
                    handleModal={ () => {} }
                    selectedId={ 1 }
                    qp={ mockQueryParams }
                    jobType={ 'Foo' }
                    handleCloseBtn={ () => { } }
                />);
        });

        wrapper.update();
        const modalHeader = wrapper.find('ModalBoxTitle');
        const title = modalHeader.find('h1');
        expect(title.text()).toEqual(mockRelatedJobs.items[0].id.template_name);
    });
    it('should display the the correct number of total jobs ran', async () => {
        await act(async () => {
            wrapper = mount(
                <ModalContents
                    isOpen={ true }
                    handleModal={ () => {} }
                    selectedId={ 1 }
                    qp={ mockQueryParams }
                    jobType={ 'Foo' }
                    handleCloseBtn={ () => { } }
                />);
        });

        wrapper.update();
        const statsBox = wrapper.find('DataListItem[aria-labelledby="Selected Template Statistics"]');
        const jobRuns = statsBox.find('div[aria-labelledby="job runs"]');
        expect(jobRuns.text()).toMatch(String(mockStats.items[0].total_count));
    });
    it('should display the the correct success rate', async () => {
        const calculateSuccessRate = (successCount, totalCount) => Math.ceil(successCount / totalCount * 100) + '%';
        await act(async () => {
            wrapper = mount(
                <ModalContents
                    isOpen={ true }
                    handleModal={ () => {} }
                    selectedId={ 1 }
                    qp={ mockQueryParams }
                    jobType={ 'Foo' }
                    handleCloseBtn={ () => { } }
                />);
        });

        wrapper.update();
        const statsBox = wrapper.find('DataListItem[aria-labelledby="Selected Template Statistics"]');
        const successRate = statsBox.find('div[aria-labelledby="success rate"]');
        const expected = calculateSuccessRate(mockStats.items[0].successful_count, mockStats.items[0].total_count);
        expect(successRate.text()).toMatch(expected);
    });
});
