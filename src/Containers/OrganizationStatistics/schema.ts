import {
  ChartSchemaElement,
  ChartKind,
  ChartLegendOrientation,
  ChartLegendPosition,
  ChartTopLevelType,
  ChartType,
  functions,
  ChartThemeColor,
  ApiReturnType
} from 'react-json-chart-builder';

import { attrPairs } from './Report';

export const customFunctions = (data: ApiReturnType) => ({
  ...functions,
  fetchFnc: () => new Promise<ApiReturnType>((resolve) => { resolve(data); })
});

interface Params {
  sort_options: string,
  [x: string]: unknown
}

const schema = (params: Params): ChartSchemaElement[] => ([
  {
    id: 3000,
    kind: ChartKind.wrapper,
    type: ChartTopLevelType.chart,
    parent: null,
    props: {
      height: 400,
      padding: {
        right: 100
      },
      themeColor: ChartThemeColor.multiOrdered
    },
    xAxis: {
      label: 'Date',
      tickFormat: 'formatDateAsDayMonth'
    },
    yAxis: {
      label: attrPairs.find(({ key }) => key === params.sort_options)?.name || 'Y axis',
      tickFormat: 'formatNumberAsK',
      showGrid: true,
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
    id: 3100,
    kind: ChartKind.group,
    parent: 3000,
    template: {
      id: 0,
      kind: ChartKind.simple,
      type: ChartType.bar,
      parent: 0,
      props: {
        x: 'created_date',
        y: params.sort_options,
        barWidth: 15,
      },
      tooltip: {
        standalone: true
      }
    }
  }
]);

export default schema;