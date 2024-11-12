import ChartBuilder, {
  ChartData,
  ChartFunctions,
  ChartSchemaElement,
  functions,
} from '@ansible/react-json-chart-builder';
import { ChartDataSerie } from '@ansible/react-json-chart-builder/dist/cjs';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/exclamation-circle-icon';
import React, { FC, useEffect, useState } from 'react';
import { useQueryParams } from '../../QueryParams';
import { convertApiToData } from './convertApi';
import { ApiReturnType } from './types';

interface Props {
  schema: ChartSchemaElement[];
  data: ApiReturnType;
  specificFunctions?: ChartFunctions;
  namespace?: string;
}

interface Props {
  x?: number;
  y?: number;
  [key: string]: any;
}

const CustomPoint: FC<Props> = ({ x, y, disableInlineStyles, ...props }) => {
  return x != undefined && y != undefined ? (
    <ExclamationCircleIcon
      x={x - 8}
      y={y - 8}
      {...props}
      {...props.events}
    ></ExclamationCircleIcon>
  ) : null;
};

const customFunctions = (specificFunctions?: ChartFunctions) => ({
  ...functions,
  axisFormat: {
    ...functions.axisFormat,
    formatAsYear: (tick: string | number) =>
      Intl.DateTimeFormat('en', { year: 'numeric' }).format(new Date(tick)),
    formatAsMonth: (tick: string | number) =>
      Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(tick)),
    ...specificFunctions?.axisFormat,
  },
  labelFormat: {
    ...functions.labelFormat,
    ...specificFunctions?.labelFormat,
  },

  onClick: {
    ...functions.onClick,
    ...specificFunctions?.onClick,
  },
  dataComponent: {
    scatterPlot: CustomPoint,
  },
});

const applyHiddenFilter = (
  chartData: ChartData,
  chartSeriesHidden: string[] = []
): ChartData => ({
  ...chartData,
  series: chartData.series.map((series: ChartDataSerie) => ({
    ...series,
    hidden:
      (!!series.serie[0].id || !!series.serie[0].host_id) &&
      !!chartSeriesHidden.includes(
        (series.serie[0].host_id || series.serie[0].id || '').toString()
      ),
  })),
});

const Chart: FC<Props> = ({
  schema,
  data,
  specificFunctions,
  namespace = 'settings',
}) => {
  const {
    queryParams: { chartSeriesHiddenProps },
    dispatch,
  } = useQueryParams(
    {
      chartSeriesHiddenProps: [],
    },
    namespace
  );

  const [chartData, setChartData] = useState<ChartData>({
    series: [],
    legend: [],
  });

  // gets called when clicking on legend, .series[x].hidden is updated
  const setChartDataHook = (newChartData: ChartData) => {
    dispatch({
      type: 'SET_CHART_SERIES_HIDDEN_PROPS',
      value: newChartData.series.map((line) => [line.serie[0].id, line.hidden]),
    });

    setChartData(newChartData);
  };

  useEffect(() => {
    setChartData(
      applyHiddenFilter(
        convertApiToData(data),
        chartSeriesHiddenProps as string[]
      )
    );
  }, [data, chartSeriesHiddenProps]);

  return (
    <ChartBuilder
      schema={schema}
      functions={{
        ...customFunctions(specificFunctions),
      }}
      dataState={[chartData, setChartDataHook]}
    />
  );
};

export default Chart;
