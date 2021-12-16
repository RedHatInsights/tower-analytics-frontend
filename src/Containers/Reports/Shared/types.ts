import { ChartSchemaElement, ChartType } from 'react-json-chart-builder';
import { Endpoint, Params } from '../../../Api';
import { LayoutComponentName } from '../Layouts';
import { ExpandedTableRowName } from '../Layouts/Standard/Components';
import { TagName } from './constants';

export type AttributesType = { key: string; value: string }[];
export type SchemaFnc = (props: {
  label?: string;
  y?: string;
  xTickFormat?: string;
  chartType?: ChartType;
}) => ChartSchemaElement[];

export interface ReportGeneratorParams {
  slug: string;
  defaultParams: Params;
  tableHeaders: AttributesType;
  expandedTableRowName?: ExpandedTableRowName;
  availableChartTypes: string[];
  dataEndpoint: Endpoint;
  optionsEndpoint: Endpoint;
  schema: unknown;
}

export interface ReportPageParams {
  slug: string;
  name: string;
  description: string;
  tags: TagName[];
  reportParams: ReportGeneratorParams;
  layoutComponent: LayoutComponentName;
}

export interface Tag {
  key: TagName;
  name: string;
  description: string;
}
