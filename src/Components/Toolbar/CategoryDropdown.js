import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ToolbarItem, Select, SelectOption } from '@patternfly/react-core';

const CategoryDropdown = ({
    selected,
    setSelected = () => {},
    categories = []
}) => {
    const [ isExpanded, setIsExpanded ] = useState(false);

    return (
        <ToolbarItem>
            <Select
                isOpen={isExpanded}
                variant={'single'}
                aria-label={'Categories'}
                onToggle={() => setIsExpanded(!isExpanded)}
                onSelect={(_event, selection) => {
                    setSelected(selection);
                    setIsExpanded(false);
                }}
                selections={selected}
                placeholderText={'Filter by'}
            >
                {categories.map(({ key, name }) => (
                    <SelectOption key={key} value={key}>
                        {name}
                    </SelectOption>
                ))}
            </Select>
        </ToolbarItem>
    );
};

CategoryDropdown.propTypes = {
    categories: PropTypes.array,
    selected: PropTypes.string,
    setSelected: PropTypes.func
};

export default CategoryDropdown;
