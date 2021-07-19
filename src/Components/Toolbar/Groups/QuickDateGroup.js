import React from 'react';
import PropTypes from 'prop-types';
import { ToolbarGroup } from '@patternfly/react-core';

import ToolbarInput from './ToolbarInput/';

const QuickDateGroup = ({ filters, handleSearch, setFilters, values }) => (
  <ToolbarGroup variant="filter-group">
    <ToolbarInput
      categoryKey="quick_date_range"
      value={filters.quick_date_range}
      selectOptions={values}
      setValue={(value) => {
        setFilters('quick_date_range', value);
        handleSearch('quick_date_range', value);
      }}
    />
    {filters.quick_date_range && filters.quick_date_range.includes('custom') && (
      <>
        <ToolbarInput
          categoryKey="start_date"
          value={filters.start_date}
          setValue={(e) => {
            setFilters('start_date', e);
            handleSearch('start_date', e);
          }}
        />
        <ToolbarInput
          categoryKey="end_date"
          value={filters.end_date}
          setValue={(e) => {
            setFilters('end_date', e);
            handleSearch('end_date', e);
          }}
        />
      </>
    )}
  </ToolbarGroup>
);

QuickDateGroup.propTypes = {
  filters: PropTypes.object.isRequired,
  handleSearch: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  values: PropTypes.array.isRequired,
};

export default QuickDateGroup;
