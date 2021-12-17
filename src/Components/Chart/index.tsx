import React, { FC, useEffect, useState } from 'react';
import ChartBuilder, {
  ChartData,
  ChartFunctions,
  ChartSchemaElement,
  functions,
} from 'react-json-chart-builder';
import { useQueryParams } from '../../QueryParams';
import { convertApiToData } from './convertApi';
import { ApiReturnType } from './types';

interface Props {
  schema: ChartSchemaElement[];
  data: ApiReturnType;
  specificFunctions?: ChartFunctions;
  namespace?: string;
}

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
});

const applyHiddenFilter = (
  chartData: ChartData,
  chartSeriesHidden: boolean[] = []
): ChartData => ({
  ...chartData,
  series: chartData.series.map((series, index) => ({
    ...series,
    hidden: !!chartSeriesHidden.at(index),
  })),
});

const Chart: FC<Props> = ({
  schema,
  data,
  specificFunctions,
  namespace = 'chart-settings',
}) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

  const setChartDataHook = (newChartData: ChartData) => {
    dispatch({
      type: 'SET_CHART_SERIES_HIDDEN_PROPS',
      value: newChartData.series.map(({ hidden }) => hidden),
    });

    setChartData(newChartData);
  };

  useEffect(() => {
    setChartData(
      applyHiddenFilter(convertApiToData(data), chartSeriesHiddenProps)
    );
  }, [data]);

  return (
    <ChartBuilder
      schema={schema}
      functions={customFunctions(specificFunctions)}
      dataState={[chartData, setChartDataHook]}
    />
  );
};

export default Chart;
