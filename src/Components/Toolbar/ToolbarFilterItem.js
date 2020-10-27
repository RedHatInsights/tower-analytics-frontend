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
    isVisible = true,
    hasChips = true,
    setFilter
}) => {
    const [ expanded, setExpanded ] = useState(false);
    const options = optionsForCategories[categoryKey];

    const onDelete = (name, valueToDelete) => {
        const single = optionsForCategories[categoryKey].isSingle;

        if (single) {
            setFilter(null);
        } else {
            const keyToDelete = values.find(({ value }) => value === valueToDelete).key;
            const filteredArr = filter.filter(value => value !== keyToDelete);
            setFilter(filteredArr);
        }
    };

    const handleChips = () => {
        if (options.isSingle) {
            return handleSingleChips(filter, values);
        } else {
            return handleCheckboxChips(filter, values);
        }
    };

    const onSelect = (event, selection) => {
        if (options.isSingle) {
            setFilter(selection);
            setExpanded(false);
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
            showToolbarItem={ isVisible }
            chips={ hasChips ? handleChips() : [] }
            categoryName={ options.name }
            deleteChip={ hasChips ? onDelete : null }
        >
            <Select
                variant={ options.isSingle ? 'single' : 'checkbox' }
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
    isVisible: PropTypes.bool,
    hasChips: PropTypes.bool,
    setFilter: PropTypes.func.isRequired
};

export default ToolbarFilterItem;
