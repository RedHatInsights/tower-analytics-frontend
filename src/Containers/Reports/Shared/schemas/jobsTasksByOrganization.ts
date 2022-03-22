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

const slug = 'jobs_and_tasks_by_organization';

const name = 'Jobs/Tasks by organization';

const description =
  'The number of job template and task runs, grouped by organizations from Ansible Controller.\n\nYou can use this report to find which organizations are running the most Ansible jobs.';

const tags = [
  TagName.executive,
  TagName.jobRuns,
  TagName.tasks,
  TagName.organization,
  TagName.timeSeries,
];

const tableHeaders: AttributesType = [
  { key: 'id', value: 'ID' },
  { key: 'name', value: 'Organization name' },
  { key: 'total_count', value: 'Total jobs count' },
  { key: 'host_task_count', value: 'Tasks count' },
];

const defaultParams = {
  limit: 6,
  offset: 0,
  granularity: 'daily',
  quick_date_range: 'last_30_days',
  status: [],
  org_id: [],
  job_type: [],
  cluster_id: [],
  template_id: [],
  inventory_id: [],
  attributes: ['total_count', 'host_task_count'],
  group_by: 'org',
  group_by_time: true,
  sort_options: 'total_count',
  sort_order: 'desc',
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
    slug,
    name,
    description,
    tags,
    defaultParams,
    tableHeaders,
    availableChartTypes,
    dataEndpoint: Endpoint.jobExplorer,
    optionsEndpoint: Endpoint.jobExplorerOptions,
    schema,
  },
};

export default reportParams;
