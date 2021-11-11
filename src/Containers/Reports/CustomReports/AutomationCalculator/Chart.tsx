import React, { FunctionComponent } from 'react';
import ChartBuilder, {
  ApiReturnType,
  functions,
  ApiType,
  ChartSchemaElement,
} from 'react-json-chart-builder';
import { Template } from './TemplatesTable/types';

const customFunctions = (data: ApiReturnType) => ({
  ...functions,
  fetchFnc: () =>
    new Promise<ApiReturnType>((resolve) => {
      resolve(data);
    }),
});

interface Props {
  schema: ChartSchemaElement[];
  data: Template[];
}

const Chart: FunctionComponent<Props> = ({ schema, data }) => (
  <ChartBuilder
    schema={schema}
    functions={customFunctions({
      items: data as unknown,
      type: ApiType.nonGrouped,
      response_type: '',
    } as ApiReturnType)}
  />
);

export default Chart;
