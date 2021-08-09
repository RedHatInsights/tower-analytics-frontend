export type Params = Record<
  string,
  string | number | string[] | number[] | boolean
>;
export type ApiJson = Record<string, unknown>;

export interface ParamsWithPagination {
  limit?: string | number;
  offset?: string | number;
  sort_options?: string;
  sort_order?: 'asc' | 'desc';
  [x: string]: string | number | string[] | number[] | boolean | undefined;
}

export type ReadParams = { params: Params };
export type ReadParamsWithPagination = { params: ParamsWithPagination };
export type DeleteParams = { id: string };
