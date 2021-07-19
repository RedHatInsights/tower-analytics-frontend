import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { Pagination as PFPagination } from '@patternfly/react-core';

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
type HandleSearch = (
  offset: number,
  limit: number,
  qsConfig?: ApiParams,
  history?: ApiParams
) => void;

interface Props {
  count?: number;
  params: {
    offset: number;
    limit: number;
  };
  setPagination: SetPagination;
  qsConfig: ApiParams;
  history: ApiParams;
  handleSearch: HandleSearch;
  [x: string]: unknown;
}

const Pagination: FunctionComponent<Props> = ({
  count = 0,
  handleSearch,
  history,
  qsConfig,
  params,
  setPagination,
  ...props
}) => {
  const { offset, limit } = params;
  const currentPage = Math.floor(offset / limit + 1);
  const returnOffsetVal = (page: number) => (page - 1) * limit;

  return (
    <PFPagination
      itemCount={count}
      widgetId="aa-pagination"
      perPageOptions={perPageOptions}
      perPage={limit}
      page={currentPage}
      onPerPageSelect={(_event: unknown, perPage: number, page: number) => {
        setPagination(returnOffsetVal(page), perPage);
        handleSearch(returnOffsetVal(page), perPage, qsConfig, history);
      }}
      onSetPage={(_event: unknown, page: number) => {
        setPagination(returnOffsetVal(page));
        handleSearch(returnOffsetVal(page), page, qsConfig, history);
      }}
      {...props}
    />
  );
};

Pagination.propTypes = {
  count: PropTypes.number,
  handleSearch: PropTypes.func.isRequired,
  history: PropTypes.any,
  qsConfig: PropTypes.any,
  params: PropTypes.exact({
    offset: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
  }).isRequired,
  setPagination: PropTypes.func.isRequired,
};

export default Pagination;
