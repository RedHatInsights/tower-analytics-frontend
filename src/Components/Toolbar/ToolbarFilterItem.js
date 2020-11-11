import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    ToolbarFilter,
    Select,
    SelectOption
} from '@patternfly/react-core';
import {
    handleCheckboxChips,
    handleSingleChips
} from './helpers';
import { optionsForCategories } from './constants';

const ToolbarFilterItem = ({
    categoryKey,
    filter = null,
    values = [],
    visible = false,
    setFilter
}) => {
    const [ expanded, setExpanded ] = useState(false);
    const options = optionsForCategories[categoryKey];

    const onDelete = (name, valueToDelete) => {
        const single = optionsForCategories[categoryKey].single;

        if (single) {
            setFilter(null);
        } else {
            const keyToDelete = values.find(({ value }) => value === valueToDelete).key;
            const filteredArr = filter.filter(value => value !== keyToDelete);
            setFilter(filteredArr);
        }
    };

    const handleChips = () => {
        if (options.single) {
            return handleSingleChips(filter, values
            );
        } else {
            return handleCheckboxChips(filter, values);
        }
    };

    const onSelect = (event, selection) => {
        if (options.single) {
            setFilter(selection);
        } else {
            setFilter(event.target.checked
                ? [ ...filter, selection ]
                : filter.filter(value => value !== selection)
            );
        }
    };

    return (
        <ToolbarFilter
            key = { categoryKey }
            showToolbarItem={ visible }
            chips={ handleChips() }
            categoryName={ options.name }
            deleteChip={ onDelete }
        >
            <Select
                variant={ options.single ? 'single' : 'checkbox' }
                aria-label={ categoryKey }
                onToggle={ () => setExpanded(!expanded) }
                onSelect={ onSelect }
                selections={ filter }
                isOpen={ expanded }
                placeholderText={ options.placeholder }
            >
                {
                    values && values.map(({ key, value }) => (
                        <SelectOption key={ key } value={ key }>
                            { value }
                        </SelectOption>
                    ))
                }
            </Select>
        </ToolbarFilter>
    );
};

ToolbarFilterItem.propTypes = {
    categoryKey: PropTypes.string.isRequired,
    filter: PropTypes.any,
    values: PropTypes.array,
    visible: PropTypes.bool,
    setFilter: PropTypes.func.isRequired
};

export default ToolbarFilterItem;
