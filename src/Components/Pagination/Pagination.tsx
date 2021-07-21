import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { Pagination as PFPagination } from '@patternfly/react-core';
import {
  encodeNonDefaultQueryString,
  parseQueryString,
} from '../../Utilities/qs';
import { useHistory } from 'react-router-dom';

const perPageOptions = [
  { title: '5', value: 5 },
  { title: '10', value: 10 },
  { title: '15', value: 15 },
  { title: '20', value: 20 },
  { title: '25', value: 25 },
];

type SetPagination = (offset: number, limit?: number) => void;
type ApiParams = Record<
  string,
  string | boolean | number | string[] | number[]
>;

interface Props {
  count?: number;
  params: {
    offset: number;
    limit: number;
  };
  setPagination: SetPagination;
  qsConfig: ApiParams;
  [x: string]: unknown;
}

const Pagination: FunctionComponent<Props> = ({
  count = 0,
  qsConfig,
  params,
  setPagination,
  ...props
}) => {
  const { offset, limit } = params;
  const currentPage = Math.floor(offset / limit + 1);
  const returnOffsetVal = (page: number) => (page - 1) * limit;
  const history = useHistory();

  const pushHistoryState = (params: Record<string, number> = {}) => {
    const { pathname, search } = history.location;
    const nonNamespacedParams = parseQueryString({}, search);
    const encodedParams = encodeNonDefaultQueryString(
      qsConfig,
      params,
      nonNamespacedParams
    );
    history.push(encodedParams ? `${pathname}?${encodedParams}` : pathname);
  };

  const handleSetPage = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    pageNumber: number
  ) => {
    const oldParams = parseQueryString(qsConfig, history.location.search);
    pushHistoryState({ ...oldParams, limit: pageNumber });
  };

  const handleSetPageSize = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    page: number
  ) => {
    const oldParams = parseQueryString(qsConfig, history.location.search);
    pushHistoryState({ ...oldParams, offset: page });
  };

  return (
    <PFPagination
      itemCount={count}
      widgetId="aa-pagination"
      perPageOptions={perPageOptions}
      perPage={limit}
      page={currentPage}
      onPerPageSelect={(event, perPage: number, page: number) => {
        setPagination(returnOffsetVal(page), perPage);
        handleSetPage(event, perPage);
      }}
      onSetPage={(event, page: number) => {
        setPagination(returnOffsetVal(page));
        handleSetPageSize(event, returnOffsetVal(page));
      }}
      {...props}
    />
  );
};

Pagination.propTypes = {
  count: PropTypes.number,
  qsConfig: PropTypes.any,
  params: PropTypes.exact({
    offset: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
  }).isRequired,
  setPagination: PropTypes.func.isRequired,
};

export default Pagination;
