import {
  ChartSchemaElement,
  ChartKind,
  ChartTopLevelType,
  ChartType,
  ChartThemeColor,
} from 'react-json-chart-builder';
import {
  readJobExplorer,
  readJobExplorerOptions,
  Params,
} from '../../../../Api';
import { CATEGORIES } from '../constants';
import { AttributesType, ReportPageParams } from '../types';

const slug = 'templates_explorer';

const name = 'Templates explorer';

const description =
  'An overview of the job templates that have ran across your Ansible cluster.\n\nYou can use this report to review the status of particular job templates across its job runs, giving you an overview of the times a template fails a job run, a host, or a task. You can also review the host and task status for tasks that fail the most, allowing you to identify any bottlenecks or problems with the templates you are running.';

const categories = [CATEGORIES.executive];

const defaultTableHeaders: AttributesType = [
  { key: 'id', value: 'ID' },
  { key: 'name', value: 'Template name' },
];

const tableAttributes = ['failed_count', 'successful_count', 'total_count'];

const expandedAttributes = [
  'average_host_task_count_per_host',
  'average_host_task_ok_count_per_host',
  'average_host_task_failed_count_per_host',
  'average_host_task_unreachable_count_per_host',
  'average_host_task_skipped_count_per_host',
  'successful_count',
  'failed_count',
  'error_count',
  'started',
  'finished',
  'elapsed',
  'created',
  'total_cluster_count',
  'total_org_count',
  'most_failed_tasks',
  'host_count',
  'host_task_count',
  'host_task_changed_count',
  'host_task_failed_count',
  'host_task_ok_count',
  'host_task_skipped_count',
  'host_task_unreachable_count',
  'failed_host_count',
  'unreachable_host_count',
  'changed_host_count',
  'ok_host_count',
  'skipped_host_count',
  'total_count',
];

const defaultParams: Params = {
  limit: 6,
  offset: 0,
  attributes: [...tableAttributes, ...expandedAttributes],
  group_by: 'template',
  group_by_time: false,
  granularity: 'monthly',
  quick_date_range: 'last_6_months',
  sort_options: 'total_count',
  sort_order: 'desc',
  cluster_id: [],
  inventory_id: [],
  job_type: [],
  org_id: [],
  status: [],
  template_id: [],
};

const schemaFnc = (
  label: string,
  y: string,
  _xTickFormat: string
): ChartSchemaElement[] => [
  {
    id: 1,
    kind: ChartKind.wrapper,
    type: ChartTopLevelType.chart,
    parent: null,
    props: {
      height: 600,
      domainPadding: {
        x: 100,
      },
      padding: {
        bottom: 60,
        left: 80,
      },
      themeColor: ChartThemeColor.multiOrdered,
    },
    xAxis: {
      label: 'Template',
      // It is using names instead of dates so no need for formatting.
      // tickFormat: xTickFormat,
    },
    yAxis: {
      tickFormat: 'formatNumberAsK',
      showGrid: true,
      label,
      style: {
        axisLabel: {
          padding: 55,
        },
      },
    },
    api: {
      url: '',
      params: {},
    },
    tooltip: {
      mouseFollow: true,
      stickToAxis: 'x',
      cursor: true,
      customFnc: (datum: Record<string, string | number>) =>
        `${datum.name}: ${datum.y}`,
    },
  },
  {
    id: 2,
    kind: ChartKind.group,
    parent: 1,
    template: {
      id: 0,
      kind: ChartKind.simple,
      type: ChartType.bar,
      parent: 0,
      props: {
        x: 'name',
        y,
      },
    },
  },
];

const reportParams: ReportPageParams = {
  slug,
  name,
  description,
  categories,
  report: {
    slug,
    defaultParams,
    defaultTableHeaders,
    tableAttributes,
    expandedAttributes,
    readData: readJobExplorer,
    readOptions: readJobExplorerOptions,
    schemaFnc,
  },
};

export default reportParams;
