import { RouteComponentProps } from 'react-router-dom';
import { stringifyQueryParams } from './helpers';

// TODO move it elsewhere when doing qp --> ts
interface NamespacedQueryParams {
  [key: string]: Record<string, any>;
}

export type RedirectWithQueryParamsProps = (
  path: string,
  queryParams: NamespacedQueryParams | undefined
) => void;

type TopLevelRedirectParams = (
  history: RouteComponentProps['history']
) => RedirectWithQueryParamsProps;

/**
 * The function helps to serielize query params to string and
 * redirecting with query params.
 *
 * @param path The path to redirect to
 * @param queryParams The namespaced query params. The top leve keys are the namespaces.
 */
const redirectWithQueryParams: TopLevelRedirectParams =
  (history) =>
  (path, queryParams = undefined) => {
    const search = queryParams
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        (stringifyQueryParams(queryParams) as string)
      : '';

    history.push(`${path}${search ? '?' : ''}${search}`);
  };

export default redirectWithQueryParams;
