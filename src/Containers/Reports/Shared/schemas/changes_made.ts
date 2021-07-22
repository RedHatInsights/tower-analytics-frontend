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

const name = 'Count of changes made by Template';

const description =
  'The total count of changes made by a each template over specified time period (default 24hrs)';

const categories = [CATEGORIES.operations];

const defaultParams = {
  limit: 4,
  offset: 0,
  attributes: [
    'host_count',
    'failed_host_count',
    'changed_host_count',
    'host_task_changed_count',
    'host_task_count',
    'host_task_failed_count',
    'host_task_ok_count',
    'host_task_unreachable_count',
  ],
  group_by: 'template',
  group_by_time: true,
  granularity: 'monthly',
  sort_options: 'host_task_changed_count',
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
          padding: 50,
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
    readData: readJobExplorer,
    readOptions: readJobExplorerOptions,
    schemaFnc,
  },
};

export default reportParams;
