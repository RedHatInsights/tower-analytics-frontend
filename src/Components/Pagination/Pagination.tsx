import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { Pagination as PFPagination } from '@patternfly/react-core';

const defaultPerPageOptions = [
  { title: '5', value: 5 },
  { title: '10', value: 10 },
  { title: '15', value: 15 },
  { title: '20', value: 20 },
  { title: '25', value: 25 },
];

type SetPagination = (offset: number, limit?: number) => void;

interface Props {
  count?: number;
  perPageOptions?: { title: string; value: number }[];
  params: {
    offset: number;
    limit: number;
  };
  setPagination: SetPagination;
  [x: string]: unknown;
}

const Pagination: FunctionComponent<Props> = ({
  count = 0,
  perPageOptions = null,
  params,
  setPagination,
  ...props
}) => {
  const { offset, limit } = params;
  const currentPage = Math.floor(offset / limit + 1);
  const returnOffsetVal = (page: number) => (page - 1) * limit;

  return (
    <PFPagination
      data-cy={props.isCompact ? 'pagination_top' : 'pagination_bottom'}
      itemCount={count}
      widgetId='aa-pagination'
      perPageOptions={perPageOptions ?? defaultPerPageOptions}
      perPage={limit}
      page={currentPage}
      onPerPageSelect={(_e, perPage: number, page: number) => {
        setPagination(returnOffsetVal(page), perPage);
      }}
      onSetPage={(_e, page: number) => {
        setPagination(returnOffsetVal(page));
      }}
      {...props}
    />
  );
};

Pagination.propTypes = {
  count: PropTypes.number,
  params: PropTypes.exact({
    offset: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
  }).isRequired,
  setPagination: PropTypes.func.isRequired,
  perPageOptions: PropTypes.arrayOf(
    PropTypes.exact({
      title: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    }).isRequired
  ),
};

export default Pagination;
