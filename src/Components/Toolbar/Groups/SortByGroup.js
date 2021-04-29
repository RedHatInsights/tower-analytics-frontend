import React from 'react';
import PropTypes from 'prop-types';
import {
    ToolbarGroup,
    Button
} from '@patternfly/react-core';
import {
    SortAmountDownIcon,
    SortAmountUpIcon
} from '@patternfly/react-icons';

import ToolbarFilterItem from '../CustomFormElements/ToolbarFilterItem';

const SortByGroup = ({
    filters,
    setFilters,
    sort_options
}) => (
    <ToolbarGroup variant="filter-group">
        <ToolbarFilterItem
            categoryKey="sort_options"
            filter={filters.sort_options}
            values={sort_options}
            setFilter={value =>
                setFilters('sort_options', value)
            }
            hasChips={false}
        />
        <Button variant="control"
            onClick={() => setFilters(
                'sort_order',
                filters.sort_order === 'asc' ? 'desc' : 'asc'
            )}
        >
            {filters.sort_order === 'asc' && (<SortAmountUpIcon />)}
            {filters.sort_order === 'desc' && (<SortAmountDownIcon />)}
        </Button>
    </ToolbarGroup>
);

SortByGroup.propTypes = {
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
    sort_options: PropTypes.array.isRequired
};

export default SortByGroup;
