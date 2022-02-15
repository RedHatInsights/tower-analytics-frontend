import { NotificationOptions } from '../globalTypes';
import { DispatchType } from '../store';

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
  schemaParams: Record<string, string>;
  dataFetchingParams: {
    endpointUrl: string;
    queryParams: Params;
    selectOptions: OptionsReturnType;
    showExtraRows: boolean;
    chartSeriesHiddenProps: boolean[];
    sortOptions: string;
    sortOrder: 'asc' | 'desc';
    dateGranularity: string;
    startDate: string;
    endDate: string;
    dateRange: string;
  };
}

export type NotificationAsyncFunction = (
  id: string,
  message?: string
) => NotificationOptions;

export interface NotificationParams {
  pending: NotificationAsyncFunction;
  rejected: NotificationAsyncFunction;
  dispatch: DispatchType;
  id: string;
}

export type ReadParams = { params: Params };
export type ReadParamsWithPagination = { params: ParamsWithPagination };

export type ReadEndpointFnc = (
  params: Params | ParamsWithPagination
) => Promise<ApiJson>;
