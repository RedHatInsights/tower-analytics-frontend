export type QueryParams = Record<
  string,
  (string | boolean)[] | string | boolean | null
>;
export type NamespacedQueryParams = Record<string, QueryParams>;

export type UpdateFunction = ({
  newQueryParams,
  namespace,
}: {
  newQueryParams: QueryParams;
  namespace: string;
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
  update: UpdateFunction;
  addInitialParams: InitialParamsFunction;
  removeInitialParams: InitialParamsFunction;
  redirectWithQueryParams: RedirectWithQueryParamsProps;
}
