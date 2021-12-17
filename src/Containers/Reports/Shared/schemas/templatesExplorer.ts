import {
  ChartKind,
  ChartTopLevelType,
  ChartType,
  ChartThemeColor,
} from 'react-json-chart-builder';
import { Params, Endpoint } from '../../../../Api';
import { LayoutComponentName } from '../../Layouts';
import { ExpandedTableRowName } from '../../Layouts/Standard/Components';
import { TagName } from '../constants';
import { AttributesType, ReportPageParams } from '../types';

const slug = 'templates_explorer';

const name = 'Templates explorer';

const description =
  'An overview of the job templates that have ran across your Ansible cluster.\n\nYou can use this report to review the status of a particular job template across its job runs, giving you an overview of the times a template fails a job run, a host, or a task. You can also review the host and task status for tasks that fail the most, allowing you to identify any bottlenecks or problems with the templates you are running.';

const tags = [
  TagName.operations,
  TagName.jobTemplate,
  TagName.jobRuns,
  TagName.tasks,
  TagName.performanceAnomalyDetection,
];

const tableHeaders: AttributesType = [
  { key: 'id', value: 'ID' },
  { key: 'name', value: 'Template name' },
  { key: 'total_count', value: 'Total jobs count' },
  { key: 'successful_count', value: 'Successful jobs count' },
  { key: 'failed_count', value: 'Failed jobs count' },
];

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
  attributes: [
    'total_count',
    'successful_count',
    'failed_count',
    ...expandedAttributes,
  ],
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

const availableChartTypes = [ChartType.bar];

const schema = [
  {
    id: 1,
    kind: ChartKind.wrapper,
    type: ChartTopLevelType.chart,
    parent: null,
    props: {
      height: 400,
      padding: {
        top: 10,
        bottom: 85,
        right: 90,
        left: 90,
      },
      themeColor: ChartThemeColor.multiOrdered,
    },
    xAxis: {
      label: 'Template',
      style: {
        axisLabel: {
          padding: 50,
        },
      },
    },
    yAxis: {
      tickFormat: 'formatNumberAsK',
      showGrid: true,
      label: 'VAR_label',
      style: {
        axisLabel: {
          padding: 60,
        },
      },
    },
  },
  {
    id: 2,
    kind: ChartKind.group,
    parent: 1,
    template: 3,
  },
  {
    id: 3,
    kind: ChartKind.simple,
    type: ChartType.bar,
    parent: 0,
    props: {
      x: 'name',
      y: 'VAR_y',
    },
    tooltip: {
      standalone: true,
      labelName: 'VAR_label',
    },
  },
];

const reportParams: ReportPageParams = {
  slug,
  name,
  description,
  tags,
  reportParams: {
    slug,
    defaultParams,
    tableHeaders,
    expandedTableRowName: ExpandedTableRowName.templatesExplorer,
    availableChartTypes,
    dataEndpoint: Endpoint.jobExplorer,
    optionsEndpoint: Endpoint.jobExplorerOptions,
    schema,
  },
  layoutComponent: LayoutComponentName.standard,
};

export default reportParams;
