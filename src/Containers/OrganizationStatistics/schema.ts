import {
  ChartSchemaElement,
  ChartKind,
  ChartLegendOrientation,
  ChartLegendPosition,
  ChartTopLevelType,
  ChartType,
  functions,
  ChartApiProps
} from 'react-json-chart-builder';

import { jobExplorerEndpoint, readWithPagination } from '../../Api';

export const customFunctions = {
  ...functions,
  fetchFnc: (api: ChartApiProps) => readWithPagination(api.url, api.params)
}

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
      }
    },
    xAxis: {
      label: 'Date',
      tickFormat: 'formatDateAsDayMonth'
    },
    yAxis: {
      label: params.sort_options,
      tickFormat: 'formatNumberAsK'
    },
    api: {
      url: jobExplorerEndpoint,
      method: 'POST',
      params
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
        y: params.sort_options
      },
      tooltip: {
        standalone: true
      }
    }
  }
]);

export default schema;