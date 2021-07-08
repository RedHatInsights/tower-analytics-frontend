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
import { attrPairs } from './Report';

export const customFunctions = (data: unknown = null) => ({
  ...functions,
  fetchFnc: (api: ChartApiProps) => data
    ? new Promise((resolve) => { resolve(data); })
    : readWithPagination(api.url, api.params) // This is just fallback, remove if not needed (we need the table unedr with same data then it is not needed)
})

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
        right: 50
      }
    },
    xAxis: {
      label: 'Date',
      tickFormat: 'formatDateAsDayMonth'
    },
    yAxis: {
      label: attrPairs[params.sort_options],
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