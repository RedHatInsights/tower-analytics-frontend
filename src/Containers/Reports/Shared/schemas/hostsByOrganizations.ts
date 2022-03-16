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

const slug = 'hosts_by_organization';

const name = 'Hosts by organization';

const description =
  'The number of unique hosts, grouped by organizations from Ansible Controller.\n\nYou can use this report to find which organizations are managing the most hosts with Ansible automation.';

const tags = [
  TagName.executive,
  TagName.hosts,
  TagName.organization,
  TagName.timeSeries,
];

const tableHeaders: AttributesType = [
  { key: 'id', value: 'ID' },
  { key: 'name', value: 'Organization name' },
  { key: 'total_unique_host_count', value: 'Unique host count' },
  {
    key: 'total_unique_host_changed_count',
    value: 'Unique changed host count',
  },
];

const defaultParams = {
  limit: 6,
  offset: 0,
  granularity: 'daily',
  quick_date_range: 'last_30_days',
  status: [],
  org_id: [],
  job_type: ['workflowjob', 'job'],
  cluster_id: [],
  template_id: [],
  inventory_id: [],
  attributes: ['total_unique_host_count', 'total_unique_host_changed_count'],
  group_by: 'org',
  group_by_time: true,
  sort_options: 'total_unique_host_count',
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
    dataEndpoint: Endpoint.hostExplorer,
    optionsEndpoint: Endpoint.hostExplorerOptions,
    schema,
  },
};

export default reportParams;
