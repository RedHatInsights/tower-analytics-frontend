export type QueryParams = Record<
  string,
  (string | boolean)[] | string | boolean | null
>;
export type NamespacedQueryParams = Record<string, QueryParams>;

export type UpdateFunction = ({
  newQueryParams,
  namespace,
  removeDefault,
}: {
  newQueryParams: QueryParams;
  namespace: string;
  removeDefault: boolean;
}) => void;

export interface ContextProps {
  queryParams: NamespacedQueryParams;
  update: UpdateFunction;
}
