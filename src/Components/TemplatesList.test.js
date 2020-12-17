import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import TemplatesList from './TemplatesList';

import * as apiModule from '../Api';

describe('Components/TemplatesList', () => {
    it('should render successfully', () => {
        mount(<TemplatesList templates={ [{ name: 'Foo', type: 'Bar' }] } />);
    });
});

describe('Components/TemplatesList Modal', () => {

    let wrapper = null;

    // called inside the component before data fetch ...
    const mockInsights = {
        chrome: {
            auth: {
                getUser: () => {
                    return 'bob';
                }
            }
        }
    };

    // list of templates for the main page ...
    const templatesData = [
        {
            name: 'template_foo',
            count: 100,
            id: 1
        }
    ];

    // data for the modal ...
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
        wrapper = mount(<TemplatesList isLoading={ false } templates={ templatesData } />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('should open the modal on click', async () => {

        // should not be open by default
        let isOpen = wrapper.find('Modal').props().isOpen;
        expect(!isOpen);

        // click on the template ...
        await act(async () => {
            wrapper.find('a').simulate('click');
        });
        wrapper.update();

        // should be open after click
        isOpen = wrapper.find('Modal').props().isOpen;
        expect(isOpen);

    });

    it('should display 0% success in the modal', async () => {

        // click on the template ...
        await act(async () => {
            wrapper.find('a').simulate('click');
        });
        wrapper.update();

        // 0% success rate should not be "unavailable"
        let sr = wrapper.find({ 'aria-labelledby': 'success rate' });
        expect(sr.text()).toBe('Success rate0%');
    });

});
