/*eslint camelcase: ["error", {properties: "never", ignoreDestructuring: true}]*/

import { act } from 'react-dom/test-utils';
import { when } from 'jest-when';
import {
    computeTotalSavings,
    filterDataBySelectedIds,
    formatData,
    formatSelectedIds,
    handleManualTimeChange,
    handleToggle,
    setTemplatesIsActive,
    updateData
} from './AutomationCalculator';

import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import AutomationCalculator from './AutomationCalculator';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
Enzyme.configure({ adapter: new Adapter() });

const testResponse = [
    {
        template_id: 1,
        name: 'foo',
        run_count: 1,
        failed_run_count: 0,
        successful_run_count: 1,
        elapsed_sum: 1,
        failed_elapsed_sum: 0,
        successful_elapsed_sum: 1,
        host_count_avg: 1,
        failed_host_count_avg: 1,
        successful_host_run_count_avg: 1,
        host_count: 1,
        failed_host_count: 1,
        successful_host_run_count: 1,
        template_automation_percentage: 1,
        orgs: [
            {
                org_name: 'bar_org_name',
                org_id: 1
            }
        ],
        clusters: [
            {
                cluster_name: 'baz_cluster_name',
                cluster_id: 1
            }
        ],
        known_roi_metric: 36
    }
];

/*
const expectedObj = {
    id: expect.any(Number),
    name: expect.any(String),
    isActive: true,
    calculations: expect.any(Array),
    orgs: expect.any(Array),
    clusters: expect.any(Array),
    run_count: expect.any(Number),
    host_count: expect.any(Number),
    successful_host_run_count: expect.any(Number),
    delta: expect.any(Number),
    elapsed_sum: expect.any(Number),
    failed_elapsed_sum: expect.any(Number),
    successful_elapsed_sum: expect.any(Number),
    template_automation_percentage: expect.any(Number)
};
*/

// mock out the fetch api
global.fetch = jest.fn();

// preflight is just a check for authorization ...
when(global.fetch).calledWith(expect.stringContaining('/authorized/')).mockReturnValue(
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({})
    })
);

// all other calls should be for roi data ...
let roiTemplateJson = { templates: [ ...testResponse ]};
roiTemplateJson.templates[0].delta = 0;
when(global.fetch).calledWith(expect.not.stringContaining('/authorized/')).mockReturnValue(
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(roiTemplateJson)
    })
);

describe('AutomationCalculator Formulas', () => {
    const defaultCostAutomation = 20;
    const defaultCostManual = 50;

    it('filterDataBySelectedIds removes templates that match Id(s) passed from formattedData', () => {
        let testResponses = [ testResponse, { ...testResponse }];
        testResponses[0].id = 0;
        testResponses[1].id = 1;
        const filteredData = filterDataBySelectedIds(testResponses, [ 1 ]);
        expect(filteredData.length).toEqual(1);
        expect(filteredData[0].id).toEqual(0);

    });
    it('setTemplatesIsActive sets isActive to false in templatesList if the template matches the passed id', () => {
        let testResponses = [{ ...testResponse[ 0 ] }, { ...testResponse[ 0 ] }];
        testResponses[0].id = 0;
        testResponses[0].template_id = 0;
        testResponses[1].id = 1;
        testResponses[1].template_id = 1;

        setTemplatesIsActive(testResponses, [ 1 ]);
        expect(testResponses[0].isActive).toEqual(true);
        expect(testResponses[1].isActive).toEqual(false);

    });
    it('computeTotalSavings makes the correct total with manual cost set to 0', () => {
        const formattedData = formatData(testResponse, { defaultAvgRunVal: 3600 });
        const total = computeTotalSavings(formattedData, defaultCostAutomation, 0);
        //const expected = formattedData[0].calculations[0].cost - formattedData[0].calculations[1].cost;
        expect(total).toEqual(0);

    });
    it('computeTotalSavings makes the correct total with manual cost set to 10', () => {
        const formattedData = formatData(testResponse, { defaultAvgRunVal: 3600 });
        const total = computeTotalSavings(formattedData, defaultCostAutomation, 10);
        const expected = formattedData[0].calculations[0].cost - formattedData[0].calculations[1].cost;
        expect(total).toEqual(expected);

    });
    it('computeTotalSavings makes the correct total with automated cost set to 0', () => {
        const formattedData = formatData(testResponse, { defaultAvgRunVal: 3600 });
        const total = computeTotalSavings(formattedData, 0, defaultCostManual);
        expect(total).toEqual(50);

    });
    it('computeTotalSavings makes the correct total with automated cost set to 10', () => {
        const formattedData = formatData(testResponse, { defaultAvgRunVal: 3600 });
        const total = computeTotalSavings(formattedData, 10, defaultCostManual);
        expect(total).toEqual(49.99722222222222);

    });
    it('computeTotalSavings sets correct delta calculation for formattedData', () => {
        const formattedData = formatData(testResponse, { defaultAvgRunVal: 3600 });
        //const total = computeTotalSavings(formattedData, defaultCostAutomation, 10);
        const expected = formattedData[0].calculations[0].cost - formattedData[0].calculations[1].cost;
        expect(formattedData[0].delta).toEqual(expected);

    });
});

describe('AutomationCalculator Functions()', () => {
    it('formatData should return correctly formatted array', () => {
        const testDefaults = {
            defaultAvgRunVal: 0
        };

        const expected = [
            {
                name: testResponse[0].name,
                id: testResponse[0].template_id,
                run_count: testResponse[0].successful_run_count,
                host_count: Math.ceil(testResponse[0].successful_host_run_count_avg) || 0,
                successful_host_run_count: testResponse[0].successful_host_run_count,
                delta: 0,
                isActive: true,
                calculations: [
                    {
                        type: 'Manual',
                        avg_run: testDefaults.defaultAvgRunVal,
                        cost: 0
                    },
                    {
                        type: 'Automated',
                        avg_run: testResponse[0].successful_elapsed_sum || 0,
                        cost: 0
                    }
                ],
                orgs: testResponse[0].orgs,
                clusters: testResponse[0].clusters,
                elapsed_sum: testResponse[0].elapsed_sum,
                failed_elapsed_sum: testResponse[0].failed_elapsed_sum,
                successful_elapsed_sum: testResponse[0].successful_elapsed_sum,
                template_automation_percentage: testResponse[0].template_automation_percentage
            }

        ];
        expect(formatData(testResponse, testDefaults)).toEqual(expected);
        expect(expected[0].orgs[0].org_name).toEqual(testResponse[0].orgs[0].org_name);
    });
    it('updateData should return correctly updated array', () => {
        const testSeconds = 60;
        const testId = 1;
        const testData = [
            {
                id: 1,
                successful_host_run_count: 2,
                calculations: [
                    {
                        type: 'Manual',
                        avg_run: 0,
                        total: 0
                    },
                    {
                        type: 'Automated',
                        avg_run: 1,
                        total: 1
                    }
                ]
            },
            {
                id: 2,
                successful_host_run_count: 3,
                calculations: [
                    {
                        type: 'Manual',
                        avg_run: 1,
                        total: 1
                    },
                    {
                        type: 'Automated',
                        avg_run: 3,
                        total: 3
                    }
                ]
            }
        ];
        const expected = [
            {
                id: 1,
                successful_host_run_count: 2,
                calculations: [
                    {
                        type: 'Manual',
                        avg_run: testSeconds,
                        total: testSeconds * testData[0].successful_host_run_count
                    },
                    {
                        type: 'Automated',
                        avg_run: 1,
                        total: 1
                    }
                ]
            },
            {
                id: 2,
                successful_host_run_count: 3,
                calculations: [
                    {
                        type: 'Manual',
                        avg_run: 1,
                        total: 1
                    },
                    {
                        type: 'Automated',
                        avg_run: 3,
                        total: 3
                    }
                ]
            }
        ];
        expect(updateData(testSeconds, testId, testData)).toEqual(expected);
    });
    it('handleManualTimeChange should return correct seconds from minutes', () => {
        expect(handleManualTimeChange(60)).toEqual(60 * 60);
        expect(handleManualTimeChange(0)).toEqual(0);
        expect(handleManualTimeChange('foo')).toEqual(0);
        expect(handleManualTimeChange(-1)).toEqual(0);
    });
    it('formatSelectedIds should return correct array of ids', () => {
        const testArr = [ 1, 2, 3 ];
        expect(formatSelectedIds(testArr, 4)).toEqual([ ...testArr, 4 ]);
        expect(formatSelectedIds(testArr, 1)).toEqual([ 2, 3 ]);
        expect(formatSelectedIds([], 1)).toEqual([ 1 ]);
        expect(formatSelectedIds([ 1 ], '1')).toEqual([ 1, '1' ]);
        expect(formatSelectedIds([ 1, '1' ], '1')).toEqual([ 1 ]);
    });
    it('handleToggle should return correct array of ids', () => {
        const testArr = [ 1, 2, 3 ];
        expect(handleToggle(4, testArr)).toEqual([ ...testArr, 4 ]);
        expect(handleToggle(1, testArr)).toEqual([ 2, 3 ]);
        expect(handleToggle(1, [])).toEqual([ 1 ]);
        expect(handleToggle('1', [ 1 ])).toEqual([ 1, '1' ]);
        expect(handleToggle('1', [ 1, '1' ])).toEqual([ 1 ]);
    });
});

describe('AutomationCalculator()', () => {

    let wrapper;

    beforeEach(async () => {

        fetch.mockClear();

        let d3Container = document.createElement('div');
        d3Container.setAttribute('id', 'd3-roi-chart-root');
        document.body.appendChild(d3Container);

        // full mount ...
        await act(async () => {
            const mockStore = configureStore();
            const store = mockStore({});
            wrapper = mount(<Provider store={ store } ><AutomationCalculator /></Provider>);
        });

    });

    afterEach(async () => {
        let d3Container = document.getElementById('d3-roi-chart-root');
        d3Container.remove();
        wrapper.unmount();
    });

    it('mounts and there are 5 dropdown values', async () => {

        await act(async () => {
            const fselect = wrapper.find('FormSelect');

            // ensure 4 options plus 'please choose'
            const optionValues = fselect.find('option').map(option => {
                return option.props().value;
            });
            expect(optionValues.length).toEqual(5);

            // default to n-365 days
            const selectedValue = fselect.find('select').props().value;
            expect(selectedValue).toEqual(optionValues[1]);
        });
    });

    it('changes the api params according to selection', async () => {
        const fselect = wrapper.find('FormSelect');

        // ensure 4 options plus 'please choose'
        const optionValues = fselect.find('option').map(option => {
            return option.props().value;
        });

        // fire off a selection event
        let event = {
            currentTarget: { value: optionValues[3] }
        };
        await act(async () => {
            wrapper.find('FormSelect').find('select').prop('onChange')(event);
            //wrapper.update();
        });
        wrapper.update();

        // verify the value change was made
        expect(wrapper.find('FormSelect').find('select').props().value).toBe(optionValues[3]);

        // verify the correct startDate url param was used
        const totalCalls = global.fetch.mock.calls.length;
        const lastUrl = global.fetch.mock.calls[totalCalls - 1][0].toString();
        //console.log('lastUrl', lastUrl);
        expect(lastUrl.includes('startDate=' + optionValues[3])).toBe(true);

    });

    xit('setSelectedIds removes templates that match Id(s) passed from formattedData', async () => {

        await act(async () => {
            wrapper.find('FormSelect').find('select').prop('onChange')({ currentTarget: { value: '1999-01-01' }});
        });
        wrapper.update();
        //const templateDetails = wrapper.find('TemplateDetail');
        const toggleOnIcons = wrapper.find('ToggleOnIcon');
        //const toggleOffIcons = wrapper.find('ToggleOffIcon');

        /*
        global.fetch.mock.calls.forEach((call) => {
            //console.log(call);
            //console.log(call[0]);
            //console.log(call[0].toString());
        });
        */

        //console.log('templateDetails', templateDetails.length);
        //console.log('toggleOnIcons', toggleOnIcons.length);
        //console.log('toggleOffIcons', toggleOffIcons.length);

        expect(toggleOnIcons.length).toBe(1);

        //console.log(toggleOnIcons.debug());
        //console.log(toggleOnIcons.parent().debug());
        //console.log(toggleOnIcons.parent().parent().debug());
        //console.log(toggleOnIcons.parent().parent().parent().debug());

        //console.log(wrapper.debug());
        //const svgs = wrapper.find('svg');
        //console.log(svgs);
        //console.log(svgs.debug());

        //const texts = wrapper.find('text');
        //console.log(texts);
        //console.log(texts.debug());

        //let d3Container = document.getElementById('d3-roi-chart-root');
        //console.log(d3Container);

        //someMockFunction.mock.calls.length
        //someMockFunction.mock.calls.length
        //console.log(ApiFuncs.readROI.mock.calls.length);
    });

});
