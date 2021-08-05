import { ChartSchemaElement } from 'react-json-chart-builder';
import { ApiJson, Params, ParamsWithPagination } from '../../../Api';

export type AttributesType = { key: string; value: string }[];
export type SchemaFnc = (label: string, y: string) => ChartSchemaElement[];

export interface ReportGeneratorParams {
  defaultParams: Params;
  extraAttributes: AttributesType;
  readData: (options: ParamsWithPagination) => Promise<ApiJson>;
  readOptions: (options: Params) => Promise<ApiJson>;
  schemaFnc: SchemaFnc;
}

export interface ReportPageParams {
  name: string;
  description: string;
  categories: string[];
  report?: ReportGeneratorParams;
}
