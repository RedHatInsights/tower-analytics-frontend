import React from 'react';
import PropTypes from 'prop-types';

import { Pagination as PFPagination } from '@patternfly/react-core';

const Pagination = ({
  limit,
  count,
  handleSetOffset,
  handleSetLimit,
  currPage,
  handleSetCurrPage,
  ...props
}) => {
  const perPageOptions = [
    { title: '5', value: 5 },
    { title: '10', value: 10 },
    { title: '15', value: 15 },
    { title: '20', value: 20 },
    { title: '25', value: 25 },
  ];

  const returnOffsetVal = (page) => (page - 1) * limit;

  const handleSetPage = (page) => {
    const nextOffset = returnOffsetVal(page);
    handleSetOffset(nextOffset);
    handleSetCurrPage(page);
  };

  const handlePerPageSelect = (perPage, page) => {
    handleSetLimit(perPage);
    const nextOffset = returnOffsetVal(page);
    handleSetOffset(nextOffset);
    handleSetCurrPage(page);
  };

  return (
    <PFPagination
      itemCount={count}
      widgetId="aa-pagination"
      perPageOptions={perPageOptions}
      perPage={limit}
      page={currPage}
      onPerPageSelect={(_event, perPage, page) => {
        handlePerPageSelect(perPage, page);
      }}
      onSetPage={(_event, pageNumber) => {
        handleSetPage(pageNumber);
      }}
      {...props}
    />
  );
};

Pagination.propTypes = {
  limit: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  currPage: PropTypes.number.isRequired,
  handleSetCurrPage: PropTypes.func.isRequired,
  handleSetLimit: PropTypes.func.isRequired,
  handleSetOffset: PropTypes.func.isRequired
};

export default Pagination;
