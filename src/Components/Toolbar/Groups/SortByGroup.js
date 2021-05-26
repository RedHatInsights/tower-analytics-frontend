import React from 'react';
import PropTypes from 'prop-types';
import { ToolbarGroup, Button } from '@patternfly/react-core';
import { SortAmountDownIcon, SortAmountUpIcon } from '@patternfly/react-icons';

import ToolbarItem from './ToolbarItem/ToolbarItem';

const SortByGroup = ({ filters, setFilters, sort_options }) => (
  <ToolbarGroup variant="filter-group">
    <ToolbarItem
      categoryKey="sort_options"
      value={filters.sort_options}
      selectOptions={sort_options}
      setValue={(value) => setFilters('sort_options', value)}
    />
    <Button
      variant="control"
      onClick={() =>
        setFilters('sort_order', filters.sort_order === 'asc' ? 'desc' : 'asc')
      }
    >
      {filters.sort_order === 'asc' && <SortAmountUpIcon />}
      {filters.sort_order === 'desc' && <SortAmountDownIcon />}
    </Button>
  </ToolbarGroup>
);

SortByGroup.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  sort_options: PropTypes.array.isRequired,
};

export default SortByGroup;
