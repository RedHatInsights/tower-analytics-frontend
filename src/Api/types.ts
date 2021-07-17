export type Params = Record<string, string | number>;
export type ApiJson = Record<string, string | Record<string, unknown>>;

export interface ParamsWithPagination {
  limit?: string | number;
  offset?: string | number;
  sort_by?: string;
  [x: string]: string | number | undefined;
}

export type ReadParams = { params: Params };
export type ReadParamsWithPagination = { params: ParamsWithPagination };
export type DeleteParams = { id: string };
export type UpdateParams = { id: string; params: Params };
