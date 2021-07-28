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
  'The number of times a job template runs in a specified time period (default 24hrs)';

const categories = [CATEGORIES.operations];

const defaultParams = {
  limit: 6,
  offset: 0,
  attributes: [
    'host_count',
    'ok_host_count',
    'failed_host_count',
    'unreachable_host_count',
    'changed_host_count',
    'skipped_host_count',
    'total_unique_host_count',
  ],
  group_by: 'template',
  group_by_time: true,
  granularity: 'monthly',
  sort_options: 'total_unique_host_count',
  sort_order: 'desc',
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
        x: 'created_date',
        y,
      },
      tooltip: {
        standalone: true,
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
