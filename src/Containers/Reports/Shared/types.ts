import { ChartSchemaElement } from 'react-json-chart-builder';
import { ApiJson, Params, ParamsWithPagination } from '../../../Api';

export type AttributesType = { key: string; value: string }[];
export type SchemaFnc = (
  label: string,
  y: string,
  xTickFormat: string
) => ChartSchemaElement[];

export interface ReportGeneratorParams {
  defaultParams: Params;
  expandRows?: boolean;
  extraAttributes: AttributesType;
  listAttributes?: string[],
  readData: (options: ParamsWithPagination) => Promise<ApiJson>;
  readOptions: (options: Params) => Promise<ApiJson>;
  schemaFnc: SchemaFnc;
}

export interface ReportPageParams {
  slug: string;
  name: string;
  description: string;
  categories: string[];
  report?: ReportGeneratorParams;
}
