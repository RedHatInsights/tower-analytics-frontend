export type QueryParams = Record<
  string,
  (string | boolean)[] | string | boolean | null
>;
export type NamespacedQueryParams = Record<string, QueryParams>;

type UpdateInsideFunction = (curr: QueryParams) => QueryParams;

export type UpdateFunction = ({
  namespace,
  fnc,
}: {
  namespace: string;
  fnc: UpdateInsideFunction;
}) => void;

export type InitialParamsFunction = ({
  params,
  namespace,
}: {
  params: QueryParams;
  namespace: string;
}) => void;

export type RedirectWithQueryParamsProps = (
  path: string,
  queryParams: NamespacedQueryParams | undefined
) => void;

export interface ContextProps {
  queryParams: NamespacedQueryParams;
  initialParams: NamespacedQueryParams;
  update: DispatchFunction;
  addInitialParams: InitialParamsFunction;
  removeInitialParams: InitialParamsFunction;
  redirectWithQueryParams: RedirectWithQueryParamsProps;
}

////////////////////////////////////////////////////////////////////////////////
export interface ActionItem<T> {
  namespace: string;
  action: (arg: T) => (qp: QueryParams) => QueryParams;
  props: T;
}

interface DispatchFunctionProps<T> {
  actionFnc: (arg: T) => (qp: QueryParams) => QueryParams;
  namespace?: string;
}

export type DispatchFunction = <T>({
  actionFnc,
  namespace,
}: DispatchFunctionProps<T>) => (arg: T) => void;
