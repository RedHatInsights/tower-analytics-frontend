import React, { FunctionComponent } from 'react';
import ChartBuilder, {
  ApiReturnType,
  functions,
} from 'react-json-chart-builder';
import { Template } from '../TemplatesTable/types';
import schema from './chartSchema';

const customFunctions = (data: ApiReturnType) => ({
  ...functions,
  fetchFnc: () =>
    new Promise<ApiReturnType>((resolve) => {
      resolve(data);
    }),
});

interface Props {
  data: Template[];
}

const Chart: FunctionComponent<Props> = ({ data }) => (
  <ChartBuilder
    schema={schema}
    functions={customFunctions(data as unknown as ApiReturnType)}
  />
);

export default Chart;
