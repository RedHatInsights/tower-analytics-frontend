import React from 'react';
import PropTypes from 'prop-types';

import { Pagination as PFPagination } from '@patternfly/react-core';
import { perPageOptions } from './constants';

const Pagination = ({ count = 0, params, setPagination, ...props }) => {
  const { offset, limit } = params;
  const currentPage = Math.floor(offset / limit + 1);
  const returnOffsetVal = (page) => (page - 1) * limit;

  return (
    <PFPagination
      itemCount={count}
      widgetId="aa-pagination"
      perPageOptions={perPageOptions}
      perPage={limit}
      page={currentPage}
      onPerPageSelect={(_event, perPage, page) => {
        setPagination(returnOffsetVal(page), perPage);
      }}
      onSetPage={(_event, page) => {
        setPagination(returnOffsetVal(page));
      }}
      {...props}
    />
  );
};

Pagination.propTypes = {
  count: PropTypes.number,
  params: PropTypes.object.isRequired,
  setPagination: PropTypes.func.isRequired,
};

export default Pagination;
