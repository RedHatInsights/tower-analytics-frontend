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

const renderValues = values =>
    values && values.map(({ key, value, description }) => (
        <SelectOption key={ key } value={ key } description={ description }>
            { value }
        </SelectOption>
    ));

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
            const keyToDelete = values.find(({ value }) => value === valueToDelete)
            .key;
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
            setFilter(!filter.includes(selection)
                ? [ ...filter, selection ]
                : filter.filter(value => value !== selection)
            );
        }
    };

    const onFilter = event => {
        const textInput = event.target.value;
        if (textInput === '') {
            return renderValues(values);
        } else {
            return renderValues(
                values.filter(({ value }) =>
                    value.toLowerCase().includes(textInput.toLowerCase())
                )
            );
        }
    };

    return (
        <ToolbarFilter
            data-cy={categoryKey}
            key={categoryKey}
            showToolbarItem={isVisible}
            chips={hasChips ? handleChips() : []}
            categoryName={options.name}
            deleteChip={hasChips ? onDelete : null}
        >
            <Select
                variant={ options.isSingle ? 'single' : 'checkbox' }
                aria-label={ categoryKey }
                onToggle={ () => setExpanded(!expanded) }
                onSelect={ onSelect }
                selections={ filter }
                isOpen={ expanded }
                onFilter={ onFilter }
                hasInlineFilter
                placeholderText={ options.placeholder }
            >
                { renderValues(values) }
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
