import React from 'react';
import PropTypes from 'prop-types';
import { ToolbarGroup } from '@patternfly/react-core';

import ToolbarItem from '../ToolbarItems/';

const QuickDateGroup = ({ filters, setFilters, values }) => (
  <ToolbarGroup variant="filter-group">
    <ToolbarItem
      categoryKey="quick_date_range"
      value={filters.quick_date_range}
      selectOptions={values}
      setValue={(value) => setFilters('quick_date_range', value)}
    />
    {filters.quick_date_range && filters.quick_date_range.includes('custom') && (
      <>
        <ToolbarItem
          categoryKey="start_date"
          value={filters.start_date}
          setValue={(e) => setFilters('start_date', e)}
        />
        <ToolbarItem
          categoryKey="end_date"
          value={filters.end_date}
          setValue={(e) => setFilters('end_date', e)}
        />
      </>
    )}
  </ToolbarGroup>
);

QuickDateGroup.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  values: PropTypes.array.isRequired,
};

export default QuickDateGroup;
