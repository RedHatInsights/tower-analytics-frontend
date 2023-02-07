import { stringifyQueryParams } from './helpers';
import { prefixPath } from '../paths';
/**
 * The function helps to serialize query params to string.
 *
 * @param path The path to redirect to
 * @param queryParams The namespaced query params. The top level keys are the namespaces.
 */

export const createUrl = (
  path: string,
  newPage = false,
  queryParams: any = undefined
): string => {
  const search: string = queryParams ? stringifyQueryParams(queryParams) : '';
  return `${newPage ? prefixPath + path : path}${search ? '?' : ''}${search}`;
};
