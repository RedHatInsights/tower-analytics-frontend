import PropTypes from 'prop-types';
import { perPageOptions } from './constants';

import { Pagination as PFPagination } from '@patternfly/react-core';

const Pagination = ({
  limit,
  count,
  variant = 'top',
  handleSetOffset,
  handleSetLimit,
  currPage,
  handleSetCurrPage,
  ...props
}) => {
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
      variant={variant}
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
  handleSetOffset: PropTypes.func.isRequired,
  variant: PropTypes.string,
};

export default Pagination;
