import {
  ChartKind,
  ChartLegendOrientation,
  ChartLegendPosition,
  ChartTopLevelType,
  ChartType,
  ChartThemeColor,
} from 'react-json-chart-builder';
import {
  jobExplorerEndpoint,
  readJobExplorer,
  readJobExplorerOptions,
} from '../../../../Api';
import { CATEGORIES } from '../constants';
import { AttributesType, ReportPageParams, SchemaFnc } from '../types';

const slug = 'jobs_and_tasks_by_organization';

const name = 'Jobs/Tasks by organization';

const description =
  'The number of job template and task runs, grouped by organizations from Ansible Controller.\n\nYou can use this report to find which organizations are running the most Ansible jobs.';

const categories = [CATEGORIES.executive];

const defaultTableHeaders: AttributesType = [
  { key: 'id', value: 'ID' },
  { key: 'name', value: 'Organization name' },
];

const tableAttributes = ['total_count', 'host_task_count'];

const expandedAttributes = [] as string[];

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
  attributes: [...tableAttributes, ...expandedAttributes],
  group_by: 'org',
  group_by_time: true,
  sort_options: 'total_count',
  sort_order: 'desc',
};

const availableChartTypes = [ChartType.line, ChartType.bar];

const schemaFnc: SchemaFnc = (
  label,
  y,
  xTickFormat,
  chartType = ChartType.line
) => [
  {
    id: 1,
    kind: ChartKind.wrapper,
    type: ChartTopLevelType.chart,
    parent: null,
    props: {
      height: 400,
      padding: {
        top: 40,
        bottom: 85,
        right: 90,
        left: 90,
      },
      domainPadding: {
        y: 25,
        x: chartType == ChartType.bar ? 85 : 0,
      },
      themeColor: ChartThemeColor.multiOrdered,
    },
    xAxis: {
      label: 'Date',
      tickFormat: xTickFormat,
      style: {
        axisLabel: {
          padding: 50,
        },
      },
    },
    yAxis: {
      tickFormat: 'formatNumberAsK',
      showGrid: true,
      label,
      style: {
        axisLabel: {
          padding: 60,
        },
      },
    },
    api: {
      url: '',
      params: {},
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
    template: {
      id: 0,
      kind: ChartKind.simple,
      type: chartType,
      parent: 0,
      props: {
        x: 'created_date',
        y,
      },
      tooltip: {
        labelName: '',
      },
    },
  },
];

const reportParams: ReportPageParams = {
  slug,
  name,
  description,
  categories,
  reportParams: {
    slug,
    defaultParams,
    defaultTableHeaders,
    tableAttributes,
    expandedAttributes,
    availableChartTypes,
    dataEndpointUrl: jobExplorerEndpoint,
    readData: readJobExplorer,
    readOptions: readJobExplorerOptions,
    schemaFnc,
  },
};

export default reportParams;
