import {
  ChartSchemaElement,
  ChartKind,
  ChartLegendOrientation,
  ChartLegendPosition,
  ChartTopLevelType,
  ChartType,
  ChartThemeColor,
} from 'react-json-chart-builder';
import { readJobExplorer, readJobExplorerOptions } from '../../../../Api';
import { CATEGORIES } from '../constants';
import { AttributesType, ReportPageParams } from '../types';

const name = 'Jobs/Tasks by Organization';

const description =
  'See how many jobs and tasks have been run grouped by controller organization';

const categories = [CATEGORIES.executive];

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
  attributes: ['total_count'],
  group_by: 'org',
  group_by_time: true,
  sort_options: 'total_count',
  sort_order: 'desc',
};

const extraAttributes: AttributesType = [
  { key: 'id', value: 'ID' },
  { key: 'name', value: 'Organization name' },
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
      height: 400,
      padding: {
        top: 10,
        right: 100,
      },
      domainPadding: {
        y: 25,
      },
      themeColor: ChartThemeColor.multiOrdered,
    },
    xAxis: {
      label: 'Date',
      tickFormat: xTickFormat,
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
      type: ChartType.line,
      parent: 0,
      props: {
        x: 'created_date',
        y,
      },
    },
  },
];

const reportParams: ReportPageParams = {
  name,
  description,
  categories,
  report: {
    defaultParams,
    extraAttributes,
    readData: readJobExplorer,
    readOptions: readJobExplorerOptions,
    schemaFnc,
  },
};

export default reportParams;
