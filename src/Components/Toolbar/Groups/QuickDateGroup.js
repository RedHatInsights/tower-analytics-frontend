import React from 'react';
import PropTypes from 'prop-types';
import {
    ToolbarGroup
} from '@patternfly/react-core';

import ToolbarFilterItem from '../CustomFormElements/ToolbarFilterItem';
import CustomDateSelector from '../CustomFormElements/CustomDateSelector';

const QuickDateGroup = ({
    filters,
    setFilters,
    values
}) => (
    <ToolbarGroup variant="filter-group">
        <ToolbarFilterItem
            categoryKey="quick_date_range"
            filter={filters.quick_date_range}
            values={values}
            setFilter={value => setFilters('quick_date_range', value)}
            hasChips={false}
        />
        {filters.quick_date_range &&
         filters.quick_date_range.includes('custom') && (
            <CustomDateSelector
                startDate={filters.start_date ? filters.start_date : ''}
                endDate={filters.end_date ? filters.end_date : ''}
                onInputChange={setFilters}
            />
        )}
    </ToolbarGroup>
);

QuickDateGroup.propTypes = {
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
    values: PropTypes.array.isRequired
};

export default QuickDateGroup;
