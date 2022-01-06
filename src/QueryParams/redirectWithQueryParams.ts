import { History } from 'history';
import { stringifyQueryParams } from './helpers';
import { RedirectWithQueryParamsProps } from './types';

type TopLevelRedirectParams = (
  history: History
) => RedirectWithQueryParamsProps;

/**
 * The function helps to serielize query params to string and
 * redirecting with query params.
 *
 * @param path The path to redirect to
 * @param queryParams The namespaced query params. The top level keys are the namespaces.
 */
const redirectWithQueryParams: TopLevelRedirectParams =
  (history) =>
  (path, queryParams = undefined) => {
    const search: string = queryParams ? stringifyQueryParams(queryParams) : '';

    history.push(`${path}${search ? '?' : ''}${search}`);
  };

export default redirectWithQueryParams;
