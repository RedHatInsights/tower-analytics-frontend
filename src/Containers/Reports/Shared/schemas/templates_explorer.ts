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

const name = 'Templates Explorer';

const expandRows = true;

const description =
  'The number of times a job template has ran in a specified time window.\n\nYou can use this report to be able to tell which playbooks are running most frequently, allowing you to see which groups in your organization are running Ansible the most.';
const categories = [CATEGORIES.executive];
const listAttributes = ['failed_count', 'successful_count', 'total_count']
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
  'total_count'
  ]

const defaultParams: Params = {
  limit: 6,
  offset: 0,
  attributes: [...listAttributes, ...expandedAttributes],
  group_by: 'template',
  group_by_time: false,
  granularity: 'monthly',
  quick_date_range: 'last_6_months',
  sort_options: 'host_count',
  sort_order: 'desc',
  cluster_id: [],
  inventory_id: [],
  job_type: [],
  org_id: [],
  status: [],
  template_id: [],
};

const extraAttributes: AttributesType = [
  { key: 'id', value: 'ID' },
  { key: 'name', value: 'Template name' },
];

const schemaFnc = (
  label: string,
  y: string,
  xTickFormat: string
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
      // tickFormat: xTickFormat,
    },
    yAxis: {
      tickFormat: 'formatNumberAsK',
      showGrid: true,
      label: 'Number of runs',
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
        y: 'total_count',
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
    defaultParams,
    extraAttributes,
    expandRows: expandRows,
    listAttributes: listAttributes,
    readData: readJobExplorer,
    readOptions: readJobExplorerOptions,
    schemaFnc,
  },
};

export default reportParams;
