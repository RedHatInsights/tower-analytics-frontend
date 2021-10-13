import {
  ChartSchemaElement,
  ChartKind,
  ChartLegendOrientation,
  ChartLegendPosition,
  ChartTopLevelType,
  ChartType,
  ChartThemeColor,
} from 'react-json-chart-builder';
import { readHostExplorer, readHostExplorerOptions } from '../../../../Api';
import { CATEGORIES } from '../constants';
import { AttributesType, ReportPageParams } from '../types';

const slug = 'hosts_by_organization';

const name = 'Hosts by organization';

const description =
  'The number of unique hosts, grouped by organizations from Ansible Controller.\n\nYou can use this report to find which organizations are managing the most hosts with Ansible automation.';

const categories = [CATEGORIES.executive];

const defaultTableHeaders: AttributesType = [
  { key: 'id', value: 'ID' },
  { key: 'name', value: 'Organization name' },
];

const tableAttributes = [
  'total_unique_host_count',
  'total_unique_host_changed_count',
];

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
  sort_options: 'total_unique_host_count',
  sort_order: 'desc',
};

const availableChartTypes = [ChartType.line, ChartType.bar];

const schemaFnc = (
  label: string,
  y: string,
  xTickFormat: string,
  chartType: ChartType
): ChartSchemaElement[] => [
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
      type: chartType,
      parent: 0,
      props: {
        x: 'created_date',
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
    availableChartTypes,
    readData: readHostExplorer,
    readOptions: readHostExplorerOptions,
    schemaFnc,
  },
};

export default reportParams;
