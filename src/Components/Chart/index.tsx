import React, { FC, useEffect, useState } from 'react';
import ChartBuilder, {
  ChartFunctions,
  ChartSchemaElement,
  functions,
} from 'react-json-chart-builder';
import { convertApiToData } from './convertApi';
import { ApiReturnType } from './types';

interface Props {
  schema: ChartSchemaElement[];
  data: ApiReturnType;
  specificFunctions?: ChartFunctions;
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

const Chart: FC<Props> = ({ schema, data, specificFunctions }) => {
  const dataState = useState(convertApiToData(data));

  useEffect(() => {
    dataState[1](convertApiToData(data));
  }, [data]);

  return (
    <ChartBuilder
      schema={schema}
      functions={customFunctions(specificFunctions)}
      dataState={dataState}
    />
  );
};

export default Chart;
