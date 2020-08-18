/*eslint camelcase: ["error", {properties: "never", ignoreDestructuring: true}]*/
// import { mount } from 'enzyme';
import { formatQueryStrings } from './formatQueryStrings/';
// import { act } from 'react-dom/test-utils';

const combined = {
    job_type: [ 'foo', 'bar' ],
    status: [ 'foo', 'bar' ],
    attributes: [ 'foo', 'bar' ],
    cluster_id: [ 'foo', 'bar' ],
    org_id: [ 'foo', 'bar' ],
    template_id: [ 'foo', 'bar' ]
};
const expected = {
    status: 'status[]=foo&status[]=bar',
    job_type: 'job_type[]=foo&job_type[]=bar',
    attributes: 'attributes[]=foo&attributes[]=bar',
    cluster_id: 'cluster_id[]=foo&cluster_id[]=bar',
    org_id: 'org_id[]=foo&org_id[]=bar',
    template_id: 'template_id[]=foo&template_id[]=bar'
};

const combinedStrings = {
    status: 'baz',
    job_type: 'baz',
    attributes: 'baz',
    cluster_id: 'baz',
    org_id: 'baz',
    template_id: 'baz',
    sort_by: 'baz',
    limit: 'baz',
    offset: 'baz',
    quick_date_range: 'baz',
    end_date: 'baz',
    start_date: 'baz',
    only_root_workflows_and_standalone_jobs: 'baz'
};
const expectedStrings = {
    status: 'status[]=baz',
    job_type: 'job_type[]=baz',
    attributes: 'attributes[]=baz',
    cluster_id: 'cluster_id[]=baz',
    org_id: 'org_id[]=baz',
    template_id: 'template_id[]=baz',
    sort_by: 'sort_by=baz',
    limit: 'limit=baz',
    offset: 'offset=baz',
    limit_number: 'limit_remove=baz',
    quick_date_range: 'quick_date_range=baz',
    end_date: 'end_date=baz',
    start_date: 'start_date=baz',
    only_root_workflows_and_standalone_jobs: 'only_root_workflows_and_standalone_jobs=baz'
};

describe('Utilities/formatQueryStrings', () => {
    describe('parseStatus method', () => {
        it('formats "status" array as "status=a&status=b"', () => {
            const { parseStatuses } = formatQueryStrings(combined);
            const string = parseStatuses(combined.status);
            expect(string).toEqual(expected.status);
        });
        it('formats "status" string as "status=a"', () => {
            const { parseStatuses } = formatQueryStrings(combinedStrings);
            const string = parseStatuses(combinedStrings.status);
            expect(string).toEqual(expectedStrings.status);
        });
    });
    describe('parseJobType method', () => {
        it('formats "job_type" array as "job_type=a&job_type=b"', () => {
            const { parseJobType } = formatQueryStrings(combined);
            const string = parseJobType(combined.job_type);
            expect(string).toEqual(expected.job_type);
        });
        it('formats "job_type" string as "job_type=a"', () => {
            const { parseJobType } = formatQueryStrings(combinedStrings);
            const string = parseJobType(combinedStrings.job_type);
            expect(string).toEqual(expectedStrings.job_type);
        });
    });
    describe('parseAttrs method', () => {
        it('formats "attributes" array as "attributes=a&attributes=b"', () => {
            const { parseAttrs } = formatQueryStrings(combined);
            const string = parseAttrs(combined.attributes);
            expect(string).toEqual(expected.attributes);
        });
        it('formats "attributes" string as "attributes=a"', () => {
            const { parseAttrs } = formatQueryStrings(combinedStrings);
            const string = parseAttrs(combinedStrings.attributes);
            expect(string).toEqual(expectedStrings.attributes);
        });
    });
    describe('parseCluster method', () => {
        it('formats "cluster_id" array as "cluster_id=a&cluster_id=b"', () => {
            const { parseCluster } = formatQueryStrings(combined);
            const string = parseCluster(combined.cluster_id);
            expect(string).toEqual(expected.cluster_id);
        });
        it('formats "cluster_id" string as "cluster_id=a"', () => {
            const { parseCluster } = formatQueryStrings(combinedStrings);
            const string = parseCluster(combinedStrings.cluster_id);
            expect(string).toEqual(expectedStrings.cluster_id);
        });
    });
    describe('parseOrganization method', () => {
        it('formats "org_id" array as "org_id=a&org_id=b"', () => {
            const { parseOrganization } = formatQueryStrings(combined);
            const string = parseOrganization(combined.org_id);
            expect(string).toEqual(expected.org_id);
        });
        it('formats "org_id" string as "org_id=a"', () => {
            const { parseOrganization } = formatQueryStrings(combinedStrings);
            const string = parseOrganization(combinedStrings.org_id);
            expect(string).toEqual(expectedStrings.org_id);
        });
    });
    describe('parseTemplate method', () => {
        it('formats "template_id" array as "template_id=a&template_id=b"', () => {
            const { parseTemplate } = formatQueryStrings(combined);
            const string = parseTemplate(combined.template_id);
            expect(string).toEqual(expected.template_id);
        });
        it('formats "template_id" string as "template_id=a"', () => {
            const { parseTemplate } = formatQueryStrings(combinedStrings);
            const string = parseTemplate(combinedStrings.template_id);
            expect(string).toEqual(expectedStrings.template_id);
        });
    });
    describe('parseSortBy method', () => {
        it('formats "sort_by" string as "sort_by=a"', () => {
            const { parseSortBy } = formatQueryStrings(combinedStrings);
            const string = parseSortBy(combinedStrings.sort_by);
            expect(string).toEqual(expectedStrings.sort_by);
        });
    });
    describe('parseLimit method', () => {
        it('formats "limit" string as "limit=a"', () => {
            const { parseLimit } = formatQueryStrings(combinedStrings);
            const string = parseLimit(combinedStrings.limit);
            expect(string).toEqual(expectedStrings.limit);
        });
    });
    describe('parseQuickDateRange method', () => {
        it('formats "quick_date_range" string as "quick_date_range=a"', () => {
            const { parseQuickDateRange } = formatQueryStrings(combinedStrings);
            const string = parseQuickDateRange(combinedStrings.quick_date_range);
            expect(string).toEqual(expectedStrings.quick_date_range);
        });
    });
    describe('parseEndDate method', () => {
        it('formats "end_date" string as "end_date=a"', () => {
            const { parseEndDate } = formatQueryStrings(combinedStrings);
            const string = parseEndDate(combinedStrings.end_date);
            expect(string).toEqual(expectedStrings.end_date);
        });
    });
    describe('parseStartDate method', () => {
        it('formats "start_date" string as "start_date=a"', () => {
            const { parseStartDate } = formatQueryStrings(combinedStrings);
            const string = parseStartDate(combinedStrings.start_date);
            expect(string).toEqual(expectedStrings.start_date);
        });
    });
    describe('parseRootWorkflowsAndJobs method', () => {
        it('formats "only_root_workflows_and_standalone_jobs" string as "only_root_workflows_and_standalone_jobs=a"', () => {
            const { parseRootWorkflowsAndJobs } = formatQueryStrings(combinedStrings);
            const string = parseRootWorkflowsAndJobs(combinedStrings.only_root_workflows_and_standalone_jobs);
            expect(string).toEqual(expectedStrings.only_root_workflows_and_standalone_jobs);
        });
    });
    describe('parseOffset method', () => {
        it('formats "offset" string as "offset_pos=a"', () => {
            const { parseOffset } = formatQueryStrings(combinedStrings);
            const string = parseOffset(combinedStrings.offset);
            expect(string).toEqual(expectedStrings.offset);
        });
        it('returns an empty object if "offset" is less than zero', () => {
            const lessThanZero = { offset: -1 };
            const { strings } = formatQueryStrings(lessThanZero);
            expect(strings).toEqual({});
        });
        it('returns an an object if "offset" is equal than zero', () => {
            const greaterThanZero = { offset: 1 };
            const { strings } = formatQueryStrings(greaterThanZero);
            expect(strings).toEqual({ offset: 'offset=1' });
        });
    });
    describe('stringify method', () => {
        it('converts object into urlencoded string value', () => {
            const combined = { bar: 'bar=1&bar=2', baz: 'baz=2' };
            const { stringify } = formatQueryStrings(combined);
            const expected = 'bar=1&bar=2&baz=2';
            expect(stringify(combined)).toEqual(expected);
        });
    });
});
