import React from 'react';
import PropTypes from 'prop-types';
import { SplitItem, ToolbarGroup, Split } from '@patternfly/react-core';

import ToolbarInput from './ToolbarInput/';

const getDateByDays = (days, format = true) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return format ? date.toISOString().split(/T/)[0] : date;
};

const QuickDateGroup = ({ filters, handleSearch, setFilters, values }) => {
  const endDate = filters.end_date || getDateByDays(0, true);
  const startDate = filters.start_date || getDateByDays(-30, true);

  return (
    <ToolbarGroup variant="filter-group">
      <ToolbarInput
        categoryKey="quick_date_range"
        value={filters.quick_date_range}
        selectOptions={values}
        setValue={(value) => setFilters('quick_date_range', value)}
      />
      {filters.quick_date_range && filters.quick_date_range.includes('custom') && (
        <Split hasGutter>
          <SplitItem>
            <ToolbarInput
              categoryKey="start_date"
              value={startDate}
              setValue={(e) => {
                setFilters('start_date', e);
                handleSearch('start_date', e);
              }}
              validators={[
                (date) =>
                  date > new Date(endDate) ? 'Must be before end date' : '',
              ]}
            />
          </SplitItem>
          <SplitItem style={{ paddingTop: '6px' }}>to</SplitItem>
          <SplitItem>
            <ToolbarInput
              categoryKey="end_date"
              value={endDate}
              setValue={(e) => {
                setFilters('end_date', e);
                handleSearch('end_date', e);
              }}
              validators={[
                (date) =>
                  date < new Date(startDate) ? 'Must be after start date' : '',
              ]}
            />
          </SplitItem>
        </Split>
      )}
    </ToolbarGroup>
  );
};

QuickDateGroup.propTypes = {
  filters: PropTypes.object.isRequired,
  handleSearch: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  values: PropTypes.array.isRequired,
};

export default QuickDateGroup;
