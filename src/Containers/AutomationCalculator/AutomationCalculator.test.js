/*eslint camelcase: ["error", {properties: "never", ignoreDestructuring: true}]*/
import { act } from 'react-dom/test-utils';
import { automationCalculatorMethods, useAutomationFormula } from './AutomationCalculator';

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
    delta: 0,
    elapsed_sum: expect.any(Number),
    failed_elapsed_sum: expect.any(Number),
    successful_elapsed_sum: expect.any(Number)
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
    it('setRoiData creates unfilteredData, templatesList and formattedData arrays', () => {
        expect(page.totalSavings).toEqual('$0.00');
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
    it('setSelectedIds removes templates that match Id(s) passed from formattedData', () => {
        expect(page.formattedData).toStrictEqual(expect.arrayContaining([ expect.objectContaining(expectedObj) ]));
        act(() => {
            page.setSelectedIds([ 1 ]);
        });
        expect(page.formattedData).toEqual([]);
    });
    it('setSelectedIds sets isActive to false in templatesList if the template matches the passed id', () => {
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
    it('setformattedData triggers totalSavings calculation', () => {
        expect(page.totalSavings).toEqual('$0.00');
    });
    it('setCostManual triggers totalSavings calculation', () => {
        act(() => {
            page.setCostManual(0);
        });
        expect(page.totalSavings).toEqual('$0.00');
    });
    it('setCostAutomation triggers totalSavings calculation', () => {
        act(() => {
            page.setCostAutomation(0);
        });
        expect(page.totalSavings).toEqual('$0.00');
    });
    it('setCostManual triggers correct totalSavings calculation', () => {
        act(() => {
            page.setCostManual(10);
        });
        expect(page.totalSavings).toEqual('$10.00');
    });
    it('setCostManual sets correct delta calculation for formattedData', () => {
        act(() => {
            page.setCostManual(10);
        });
        if (page.formattedData.length > 0) {
            expect(page.formattedData[0].delta).toEqual(10);
        }
    });
    it('setCostAutomation triggers correct totalSavings calculation', () => {
        act(() => {
            page.setCostManual(1);
            page.setCostAutomation(100);
        });
        if (page.formattedData.length > 0) {
            expect(page.totalSavings).toEqual('$' + page.formattedData[0].delta.toFixed(2));
        }
    });
});
describe('automationCalculatorMethods()', () => {
    it('formatData should return correctly formatted array', () => {
        const testDefaults = 0;

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
                        avg_run: testDefaults,
                        total: testDefaults * testResponse[0].successful_host_run_count || 0
                    },
                    {
                        type: 'Automated',
                        avg_run: testResponse[0].successful_elapsed_sum || 0,
                        total: testResponse[0].successful_elapsed_sum * testResponse[0].successful_host_run_count || 0
                    }
                ],
                orgs: testResponse[0].orgs,
                clusters: testResponse[0].clusters,
                elapsed_sum: testResponse[0].elapsed_sum,
                failed_elapsed_sum: testResponse[0].failed_elapsed_sum,
                successful_elapsed_sum: testResponse[0].successful_elapsed_sum
            }

        ];
        expect(automationCalculatorMethods().formatData(testResponse, testDefaults)).toEqual(expected);
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
        expect(automationCalculatorMethods().updateData(testSeconds, testId, testData)).toEqual(expected);
    });
    it('handleManualTimeChange should return correct seconds from minutes', () => {
        expect(automationCalculatorMethods().handleManualTimeChange(60)).toEqual(60 * 60);
        expect(automationCalculatorMethods().handleManualTimeChange(0)).toEqual(0);
        expect(automationCalculatorMethods().handleManualTimeChange('foo')).toEqual(0);
        expect(automationCalculatorMethods().handleManualTimeChange(-1)).toEqual(0);
    });
    it('formatSelectedIds should return correct array of ids', () => {
        const testArr = [ 1, 2, 3 ];
        expect(automationCalculatorMethods().formatSelectedIds(testArr, 4)).toEqual([ ...testArr, 4 ]);
        expect(automationCalculatorMethods().formatSelectedIds(testArr, 1)).toEqual([ 2, 3 ]);
        expect(automationCalculatorMethods().formatSelectedIds([], 1)).toEqual([ 1 ]);
        expect(automationCalculatorMethods().formatSelectedIds([ 1 ], '1')).toEqual([ 1, '1' ]);
        expect(automationCalculatorMethods().formatSelectedIds([ 1, '1' ], '1')).toEqual([ 1 ]);
    });
    it('handleToggle should return correct array of ids', () => {
        const testArr = [ 1, 2, 3 ];
        expect(automationCalculatorMethods().handleToggle(4, testArr)).toEqual([ ...testArr, 4 ]);
        expect(automationCalculatorMethods().handleToggle(1, testArr)).toEqual([ 2, 3 ]);
        expect(automationCalculatorMethods().handleToggle(1, [])).toEqual([ 1 ]);
        expect(automationCalculatorMethods().handleToggle('1', [ 1 ])).toEqual([ 1, '1' ]);
        expect(automationCalculatorMethods().handleToggle('1', [ 1, '1' ])).toEqual([ 1 ]);
    });
});
