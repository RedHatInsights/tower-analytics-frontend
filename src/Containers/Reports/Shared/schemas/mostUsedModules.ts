import {
  ChartKind,
  ChartLegendOrientation,
  ChartLegendPosition,
  ChartTopLevelType,
  ChartType,
  ChartThemeColor,
} from 'react-json-chart-builder';
import { Endpoint } from '../../../../Api';
import { LayoutComponentName, ReportSchema } from '../../Layouts/types';
import { TagName } from '../constants';
import { AttributesType } from '../types';

const slug = 'most_used_modules';

const name = 'Most used modules';

const description =
  'The number of job template and task runs, grouped by Ansible module usage.\n\nYou can use this report to find which modules are being used the most across your automation, helping you to check things like organization-wide adoption of purpose-built modules over potentially less performant, catch-all solutions.';

const tags = [
  TagName.executive,
  TagName.modules,
  TagName.jobTemplate,
  TagName.tasks,
  TagName.timeSeries,
];

const tableHeaders: AttributesType = [
  { key: 'id', value: 'ID' },
  { key: 'name', value: 'Module name' },
  { key: 'host_task_count', value: 'Tasks count' },
  { key: 'host_task_changed_count', value: 'Changed tasks count' },
  { key: 'host_task_ok_count', value: 'Successful tasks count' },
  { key: 'host_task_failed_count', value: 'Failed tasks count' },
  { key: 'host_task_unreachable_count', value: 'Unreachable tasks count' },
  { key: 'total_count', value: 'Total jobs count' },
];

const defaultParams = {
  limit: 6,
  offset: 0,
  attributes: [
    'host_task_count',
    'host_task_changed_count',
    'host_task_ok_count',
    'host_task_failed_count',
    'host_task_unreachable_count',
    'total_count',
  ],
  group_by: 'module',
  group_by_time: true,
  granularity: 'monthly',
  quick_date_range: 'last_6_months',
  sort_options: 'host_task_count',
  sort_order: 'desc',
  cluster_id: [],
  inventory_id: [],
  job_type: [],
  org_id: [],
  status: [],
  task_action_id: [],
  template_id: [],
};
const availableChartTypes = [ChartType.line, ChartType.bar];

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
        right: 178,
        left: 90,
      },
      themeColor: ChartThemeColor.multiOrdered,
    },
    xAxis: {
      label: 'Date',
      tickFormat: 'VAR_xTickFormat',
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
    legend: {
      interactive: true,
      orientation: ChartLegendOrientation.vertical,
      position: ChartLegendPosition.right,
      turncateAt: 18,
    },
    tooltip: {
      mouseFollow: true,
      stickToAxis: 'x',
      cursor: true,
      legendTooltip: {
        titleProperyForLegend: 'created_date',
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
    type: 'VAR_chartType',
    parent: 0,
    props: {
      x: 'created_date',
      y: 'VAR_y',
    },
    tooltip: {
      labelName: '',
    },
  },
];

const reportParams: ReportSchema = {
  layoutComponent: LayoutComponentName.Standard,
  layoutProps: {
    name,
    description,
    tags,
    slug,
    defaultParams,
    tableHeaders,
    availableChartTypes,
    dataEndpoint: Endpoint.eventExplorer,
    optionsEndpoint: Endpoint.eventExplorerOptions,
    schema,
  },
};

export default reportParams;
