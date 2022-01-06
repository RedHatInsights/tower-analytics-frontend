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
    hidden: !!chartSeriesHidden[index],
  })),
});

const Chart: FC<Props> = ({
  schema,
  data,
  specificFunctions,
  namespace = 'settings',
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
    console.log(newChartData);

    // This dispatch triggers a queryParams change
    // the queryParams change triggers a data change
    // the data change triggers the use effect, meaning
    // the hidden is reset on every second update after
    // the URL HAS THE API QUERY PARAMS.

    // Solution:
    // Query param value change should not trigger change in other values!!!!
    // Acchievable: Redux
    // Not acchievable: Like this (QueryParamsProvider)
    dispatch({
      type: 'SET_CHART_SERIES_HIDDEN_PROPS',
      value: newChartData.series.map(({ hidden }) => hidden),
    });

    setChartData(newChartData);
  };

  useEffect(() => {
    console.log('data changed');
    const convertedData = convertApiToData(data);

    // Enable all
    const newHiddenSeries = convertedData.series.map(() => false);

    // TODO THIS IS REALLY HACKY AND DEPENDS ON API ORDER AND RETURN HEAVILY
    // But if others are disabled keep the others (always last) disabled
    if (Array.isArray(chartSeriesHiddenProps)) {
      newHiddenSeries.pop();
      newHiddenSeries.push(!!chartSeriesHiddenProps.pop());
    }

    setChartData(applyHiddenFilter(convertedData, newHiddenSeries));
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
