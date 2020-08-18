/*eslint-disable */
/*eslint camelcase: ["error", {properties: "never", ignoreDestructuring: true}]*/

import { act } from 'react-dom/test-utils';
import { automationCalculatorMethods, useAutomationFormula } from './AutomationCalculator';
import { 
    computeTotalSavings,
    formatData,
    formatSelectedIds,
    handleManualTimeChange,
    handleToggle,
    updateData 
} from './AutomationCalculator';

import * as ApiFuncs from '../../Api';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import AutomationCalculator from './AutomationCalculator';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
Enzyme.configure({ adapter: new Adapter() });

// the insights object
const mockInsights = {
    chrome: {
        auth: {
            getUser: () => {
                return 'bob';
            }
        }
    }
};

// roidata
const mockResponse = {
    ok: true,
    json: () => Promise.resolve({})
};
ApiFuncs.preflightRequest = jest.fn();
ApiFuncs.preflightRequest.mockResolvedValue(mockResponse);
ApiFuncs.readROI = jest.fn();
ApiFuncs.readROI.mockResolvedValue(mockResponse);

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

const TestHook = ({ callback }) => {
    callback();
    return null;
};

const testHook = (callback) => {
    mount(<TestHook callback={ callback } />);
};

let page;

describe('automationCalculatorFormula()', () => {
    /*
    beforeEach(() => {
        testHook(() => {
            page = useAutomationFormula();
        });
        act(() => {
            page.setRoiData(testResponse);
        });
    });
    afterEach(() => {
        act(() => {
            page.setSelectedIds([]);
        });
    });
    */
    xit('setRoiData creates unfilteredData, templatesList and formattedData arrays', () => {
        if (page.unfilteredData.length > 0) {
            expect(page.unfilteredData).toStrictEqual(expect.arrayContaining([ expect.objectContaining(expectedObj) ]));
        }

        if (page.formattedData.length > 0) {
            expect(page.formattedData).toStrictEqual(expect.arrayContaining([ expect.objectContaining(expectedObj) ]));
        }

        if (page.templatesList.length > 0) {
            expect(page.templatesList).toStrictEqual(expect.arrayContaining([ expect.objectContaining(expectedObj) ]));
        }
    });
    xit('setSelectedIds removes templates that match Id(s) passed from formattedData', () => {
        expect(page.formattedData).toStrictEqual(expect.arrayContaining([ expect.objectContaining(expectedObj) ]));
        act(() => {
            page.setSelectedIds([ 1 ]);
        });
        expect(page.formattedData).toEqual([]);
    });
    xit('setSelectedIds sets isActive to false in templatesList if the template matches the passed id', () => {
        if (page.templatesList.length > 0) {
            expect(page.templatesList[0].isActive).toEqual(true);
        }

        act(() => {
            page.setSelectedIds([ 1 ]);
        });
        if (page.templatesList.length > 0) {
            expect(page.templatesList[0].isActive).toEqual(false);
        }
    });
    xit('setformattedData triggers totalSavings calculation', () => {
        const expected = (page.formattedData[0].calculations[0].cost - page.formattedData[0].calculations[1].cost).toFixed(2)
        .toString();
        expect(page.totalSavings).toEqual('$' + expected);
    });
    xit('setCostManual triggers totalSavings calculation', () => {
        act(() => {
            page.setCostManual(0);
        });
        expect(page.totalSavings).toEqual('$0.00');
    });
    xit('setCostAutomation triggers totalSavings calculation', () => {
        act(() => {
            page.setCostAutomation(0);
        });
        const expected = (page.formattedData[0].calculations[0].cost - page.formattedData[0].calculations[1].cost).toFixed(2)
        .toString();
        expect(page.totalSavings).toEqual('$' + expected);
    });
    xit('setCostManual triggers correct totalSavings calculation', () => {
        act(() => {
            page.setCostManual(10);
        });
        const expected = (page.formattedData[0].calculations[0].cost - page.formattedData[0].calculations[1].cost).toFixed(2)
        .toString();
        expect(page.totalSavings).toEqual('$' + expected);
    });
    it('setCostManual sets correct delta calculation for formattedData', () => {
        const formattedData = formatData(testResponse, { defaultAvgRunVal: 3600 });
        const total = computeTotalSavings(formattedData, 1, 10);
        console.log(formattedData);
        const expected = formattedData[0].calculations[0].cost - formattedData[0].calculations[1].cost
        console.log('expected', expected);
        expect(formattedData[0].delta).toEqual(expected);

    });
    it('setCostAutomation triggers correct totalSavings calculation', () => {
        const formattedData = formatData(testResponse, { defaultAvgRunVal: 3600 });
        const total = computeTotalSavings(formattedData, 1, 10);
        console.log('total', total);
        expect(total).toEqual(9.999722222222223);

    });
});

describe('automationCalculatorMethods()', () => {
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

/*
xdescribe('AutomationCalculator()', () => {

    let wrapper;

    const mockInsights = {
        chrome: {
            auth: {
                getUser: () => {
                    return 'bob';
                }
            }
        }
    };

    beforeEach(() => {

        const mockStore = configureStore();
        const store = mockStore({});

        global.insights = mockInsights;

        // full mount ...
        wrapper = mount(<Provider store={ store } ><AutomationCalculator /></Provider>);

    });

    it('mounts and selection changes the startDate value', async () => {

        const fselect = wrapper.find('FormSelect');

        // ensure 4 options plus 'please choose'
        const optionValues = fselect.find('option').map(option => {
            return option.props().value;
        });
        expect(optionValues.length).toEqual(5);

        // default to n-365 days
        const selectedValue = fselect.find('select').props().value;
        expect(selectedValue).toEqual(optionValues[1]);

        // fire off a selection event
        let event = {
            currentTarget: { value: optionValues[3] }
        };
        await act(async() => {
            wrapper.find('FormSelect').find('select').prop('onChange')(event);
        });
        wrapper.update();

        // verify the value change was made
        expect(wrapper.find('FormSelect').find('select').props().value).toBe(optionValues[3]);

        expect(ApiFuncs.readROI).toHaveBeenCalled();
        const totalCalls = ApiFuncs.readROI.mock.calls.length;
        const lastParams = ApiFuncs.readROI.mock.calls[totalCalls - 1][0].params;
        expect(lastParams.startDate).toBe(optionValues[3]);
    });

});
*/

describe('AutomationCalculator2()', () => {

    let wrapper;

    beforeEach(async () => {

        //const mockStore = configureStore();
        //const store = mockStore({});
        //global.insights = mockInsights;

        // full mount ...
        await act(async () => {
            const mockStore = configureStore();
            const store = mockStore({});
            global.insights = mockInsights;
            //jest.runAllImmediates();
            wrapper = mount(<Provider store={ store } ><AutomationCalculator /></Provider>);
            //jest.runAllImmediates();
        });

    });

    it('mounts and there are 5 data values', async () => {
        await act(async () => {
            //console.log('acting !!!!');
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

    // FIXME
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

        expect(ApiFuncs.readROI).toHaveBeenCalled();
        const totalCalls = ApiFuncs.readROI.mock.calls.length;
        const lastParams = ApiFuncs.readROI.mock.calls[totalCalls - 1][0].params;
        expect(lastParams.startDate).toBe(optionValues[3]);
    });

    /*
    it('does something else 2', async () => {
        await act(async () => {
            //jest.runAllImmediates();
            console.log('acting !!!!');
            //jest.runAllImmediates();
        });
    });
    */

    xit('setCostAutomation triggers correct totalSavings calculation', async () => {
        /*
        act(() => {
            page.setCostManual(1);
            page.setCostAutomation(100);
        });
        if (page.formattedData.length > 0) {
            expect(page.totalSavings).toEqual('$' + page.formattedData[0].delta.toFixed(2));
        }
        */
        /*
          <TextInput
              id="manual-cost"
              type="number"
              step="any"
              min="0"
              aria-label="manual-cost"
              value={ parseFloat(costManual) }
              onChange={ (e) => setCostManual(e) }
          />
        */

        // fire off a selection event
        let event = {
            currentTarget: { value: '1999-01-01' }
        };
        await act(async () => {
            wrapper.find('FormSelect').find('select').prop('onChange')(event);
            //wrapper.update();
        });
        wrapper.update();
        console.log(wrapper.find('TextInput').length);

        let manualinput;
        let automationinput;
        //wrapper.update();
        await act(async () => {
            console.log(wrapper.find('PageHeaderTitle').props().title);
            console.log(wrapper.find('CardBody').length);
            console.log(wrapper.find('EmptyState').length);
            console.log(wrapper.find('TextInput').length);
            wrapper.find('TextInput').map(ti => {
                console.log(ti);
            })
        });

    });

});
