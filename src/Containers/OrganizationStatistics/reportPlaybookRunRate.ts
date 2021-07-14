import {
  ChartSchemaElement,
  ChartKind,
  ChartLegendOrientation,
  ChartLegendPosition,
  ChartTopLevelType,
  ChartType,
  ChartThemeColor,
} from 'react-json-chart-builder';
import { readJobExplorer, readJobExplorerOptions } from '../../Api';
import {
  AttributesType,
  ReportGeneratorParams
} from './types';

const defaultParams = {
  limit: 4,
  offset: 0,
  attributes: [
    'failed_count',
    'successful_count',
    'canceled_count',
    'total_count',
    'failed_host_count',
    'unreachable_host_count',
    'host_count',
    'elapsed',
  ],
  group_by: 'template',
  group_by_time: true,
  granularity: 'monthly',
  sort_options: 'total_count',
  sort_order: 'desc',
}

const extraAttributes: AttributesType = [
  { key: 'id', value: 'ID' },
  { key: 'name', value: 'Template name' },
];

const schemaFnc = (label: string, y: string): ChartSchemaElement[] => ([
  {
    id: 1,
    kind: ChartKind.wrapper,
    type: ChartTopLevelType.chart,
    parent: null,
    props: {
      height: 400,
      padding: {
        top: 10,
        right: 100
      },
      themeColor: ChartThemeColor.multiOrdered
    },
    xAxis: {
      label: 'Date',
      tickFormat: 'formatDateAsDayMonth'
    },
    yAxis: {
      tickFormat: 'formatNumberAsK',
      showGrid: true,
      label,
      style: {
        axisLabel: {
          padding: 50
        }
      }
    },
    api: {
      url: '',
      params: {}
    },
    legend: {
      interactive: true,
      orientation: ChartLegendOrientation.vertical,
      position: ChartLegendPosition.right
    }
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
        standalone: true
      }
    }
  }
]);

const reportParams: ReportGeneratorParams = {
  defaultParams,
  extraAttributes,
  readData: readJobExplorer,
  readOptions: readJobExplorerOptions,
  schemaFnc 
};

export default reportParams;