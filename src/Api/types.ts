export type Params = Record<
  string,
  string | number | string[] | number[] | boolean | undefined
>;

export type OptionsReturnType = Record<
  string,
  { key: string; value: string }[]
>;
export type ApiJson = Record<string, unknown> | OptionsReturnType;

export interface ParamsWithPagination {
  limit?: string | number;
  offset?: string | number;
  sort_options?: string;
  sort_order?: 'asc' | 'desc';
  [x: string]: string | number | string[] | number[] | boolean | undefined;
}

export interface PDFParams {
  slug: string;
  endpointUrl: string;
  queryParams: Params;
  y: string;
  label: string;
  x_tick_format: string;
  showExtraRows: boolean;
}

export type ReadParams = { params: Params };
export type ReadParamsWithPagination = { params: ParamsWithPagination };
