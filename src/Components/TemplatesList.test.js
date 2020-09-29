/*eslint-disable camelcase*/
/*eslint-disable no-console*/
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import TemplatesList from './TemplatesList/';

import * as apiModule from '../Api';

describe('Components/TemplatesList', () => {
    it('should render successfully', () => {
        mount(<TemplatesList templates={ [{ name: 'Foo', type: 'Bar' }] } />);
    });
});

describe('Components/TemplatesList Modal', () => {

    const mockInsights = {
        chrome: {
            auth: {
                getUser: () => {
                    return 'bob';
                }
            }
        }
    };

    const templateResponse = {
        name: 'template_foo',
        id: 1,
        type: 'job',
        average_run: '00h 00m 05s',
        failed_run_count: 0,
        success_rate: 0,
        successful_run_count: 0,
        total_run: '00h 35m 49s',
        total_run_count: 366,
        most_failed_tasks: [],
        related_jobs: []
    };

    beforeEach(() => {
        global.insights = mockInsights;
        apiModule.readTemplateJobs = jest.fn();
        apiModule.readTemplateJobs.mockReturnValue(
            Promise.resolve(templateResponse)
        );
    });

    it('should open the modal on click', async () => {

        const templateData = [
            {
                name: 'template_foo',
                count: 100,
                id: 1
            }
        ];

        let wrapper = mount(<TemplatesList isLoading={ false } templates={ templateData } />);
        //let a = wrapper.find('a');

        await act(async () => {
            wrapper.find('a').simulate('click');
        });
        wrapper.update();

        console.log(wrapper.debug());
        //console.log(readTemplateJobs);
        //console.log(readTemplateJobs.mock.calls.length);
        //console.log(global.fetch.mock.calls.length);
        console.log(apiModule.readTemplateJobs);
        console.log(apiModule.readTemplateJobs.mock);
        console.log(apiModule.readTemplateJobs.mock.calls);
    });
});
