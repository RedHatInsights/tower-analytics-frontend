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

const name = 'Hosts changed by job template';

const description =
  'The number of hosts changed by a job template in a specified time window.\n\nYou can use this report to find discrepancies in the host change rate at a particular time, helping you drill down to when and why hosts were unreachable at a particular time.';

const categories = [CATEGORIES.executive];

const defaultParams = {
  limit: 6,
  offset: 0,
  attributes: ['total_unique_host_count', 'total_unique_host_changed_count'],
  group_by: 'template',
  group_by_time: true,
  granularity: 'monthly',
  quick_date_range: 'last_6_months',
  sort_options: 'total_unique_host_count',
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

const schemaFnc = (label: string, y: string): ChartSchemaElement[] => [
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
      tickFormat: 'formatDateAsDayMonth',
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
    readData: readHostExplorer,
    readOptions: readHostExplorerOptions,
    schemaFnc,
  },
};

export default reportParams;
