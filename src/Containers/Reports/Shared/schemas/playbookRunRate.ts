import {
  ChartKind,
  ChartLegendOrientation,
  ChartLegendPosition,
  ChartTopLevelType,
  ChartType,
  ChartThemeColor,
} from 'react-json-chart-builder';
import { Params, Endpoint } from '../../../../Api';
import { LayoutComponentName } from '../../Layouts';
import { TagName } from '../constants';
import { AttributesType, ReportPageParams } from '../types';

const slug = 'job_template_run_rate';

const name = 'Job template run rate';

const description =
  'The number of times a job template has ran in a specified time window.\n\nYou can use this report to be able to tell which playbooks are running most frequently, allowing you to see which groups in your organization are running Ansible the most.';

const tags = [
  TagName.executive,
  TagName.jobTemplate,
  TagName.jobRuns,
  TagName.timeSeries,
];

const tableHeaders: AttributesType = [
  { key: 'id', value: 'ID' },
  { key: 'name', value: 'Template name' },
  { key: 'total_count', value: 'Total jobs count' },
  { key: 'successful_count', value: 'Successful jobs count' },
  { key: 'failed_count', value: 'Failed jobs count' },
];

const defaultParams: Params = {
  limit: 6,
  offset: 0,
  attributes: ['failed_count', 'successful_count', 'total_count'],
  group_by: 'template',
  group_by_time: true,
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

const reportParams: ReportPageParams = {
  slug,
  name,
  description,
  tags,
  reportParams: {
    slug,
    defaultParams,
    tableHeaders,
    availableChartTypes,
    dataEndpoint: Endpoint.jobExplorer,
    optionsEndpoint: Endpoint.jobExplorerOptions,
    schema,
  },
  layoutComponent: LayoutComponentName.standard,
};

export default reportParams;
