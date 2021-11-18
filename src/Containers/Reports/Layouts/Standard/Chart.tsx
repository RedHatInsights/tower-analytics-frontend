import React, { FunctionComponent } from 'react';
import ChartBuilder, {
  ApiReturnType,
  ChartSchemaElement,
  functions,
} from 'react-json-chart-builder';

const customFunctions = (data: ApiReturnType) => ({
  ...functions,
  axisFormat: {
    ...functions.axisFormat,
    formatAsYear: (tick: string | number) =>
      Intl.DateTimeFormat('en', { year: 'numeric' }).format(new Date(tick)),
    formatAsMonth: (tick: string | number) =>
      Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(tick)),
  },
  fetchFnc: () =>
    new Promise<ApiReturnType>((resolve) => {
      resolve(data);
    }),
});

interface Props {
  schema: ChartSchemaElement[];
  data: ApiReturnType;
}

const Chart: FunctionComponent<Props> = ({ schema, data }) => (
  <ChartBuilder
    schema={schema}
    functions={customFunctions(data as unknown as ApiReturnType)}
  />
);

export default Chart;
