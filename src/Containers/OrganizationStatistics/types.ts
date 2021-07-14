import { ChartSchemaElement } from "react-json-chart-builder";

export type AttributesType = { key: string, value: string }[];
export type ApiParamsType = Record<string, string | number | string[] | number[] | boolean>;
export type ApiFunctionType = (options: { params: AttributesType }) => Promise<unknown>;
export type SchemaFnc = (label: string, y: string) => ChartSchemaElement[];

export interface ReportGeneratorParams {
  defaultParams: ApiParamsType;
  extraAttributes: AttributesType;
  readData: ApiFunctionType;
  readOptions: ApiFunctionType;
  schemaFnc: SchemaFnc;
};
