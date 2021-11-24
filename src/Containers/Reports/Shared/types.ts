import { ChartSchemaElement, ChartType } from 'react-json-chart-builder';
import { Endpoint, Params } from '../../../Api';
import { ReportLayout } from '../Layouts';

export type AttributesType = { key: string; value: string }[];
export type SchemaFnc = (
  label?: string,
  y?: string,
  xTickFormat?: string,
  chartType?: ChartType
) => ChartSchemaElement[];

export interface ReportGeneratorParams {
  slug: string;
  defaultParams: Params;
  defaultTableHeaders: AttributesType;
  tableAttributes: string[];
  expandedAttributes: string[];
  availableChartTypes: string[];
  dataEndpoint: Endpoint;
  optionEndpoint: Endpoint;
  schemaFnc: SchemaFnc;
}

export interface ReportPageParams {
  slug: string;
  name: string;
  description: string;
  categories: string[];
  reportParams: ReportGeneratorParams;
  componentName: ReportLayout;
}
