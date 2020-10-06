import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
    Toolbar,
    ToolbarContent as PFToolbarContent,
    ToolbarFilter,
    ToolbarToggleGroup,
    ToolbarGroup as PFToolbarGroup,
    Select as PFSelect,
    SelectOption,
    Switch as PFSwitch,
    Tooltip,
    TooltipPosition
} from '@patternfly/react-core';
import {
    FilterIcon,
    QuestionCircleIcon
} from '@patternfly/react-icons';

import CategoryDropdown from './CategoryDropdown';
import CustomDateSelector from './CustomDateSelector';
import {
    handleCheckboxChips,
    handleSingleChips
} from './helpers';

const ToolbarGroup = styled(PFToolbarGroup)`
  button {
    .pf-c-select__toggle-wrapper {
      flex-wrap: nowrap;
    }
  }
`;

const ToolbarContent = styled(PFToolbarContent)`
  .pf-c-toolbar__content-section {
    justify-content: space-between;
  }
`;

const Switch = styled(PFSwitch)`
    &&& {
        margin: 0 15px;
    }
`;

const Select = styled(PFSelect)`
    .pf-c-select__menu {
        max-height: 500px;
        overflow: auto;
    }
`;

const optionsForCategories = {
    status: {
        single: false,
        name: 'Status',
        placeholder: 'Filter by job status'
    },
    quickDateRange: {
        single: true,
        name: 'Date',
        placeholder: 'Filter by date'
    },
    jobType: {
        single: false,
        name: 'Job',
        placeholder: 'Filter by job type'
    },
    orgId: {
        single: false,
        name: 'Organization',
        placeholder: 'Filter by organization'
    },
    clusterId: {
        single: false,
        name: 'Cluster',
        placeholder: 'Filter by cluster'
    },
    templateId: {
        single: false,
        name: 'Template',
        placeholder: 'Filter by template'
    },
    sortBy: {
        single: true,
        name: 'Sort by',
        placeholder: 'Sort by attribute'
    }
};

const optionsFindByName = value =>
    Object.keys(optionsForCategories).find(
        el => optionsForCategories[el].name === value
    );

const FilterableToolbar = ({
    categories,
    filters,
    setFilters
}) => {
    const [ expandedItems, setExpandedItems ] = useState({});
    const [ currentCategory, setCurrentCategory ] = useState(
        Object.keys(categories)[0]
    );

    const onDelete = (name, val) => {
        if (!name) {
            setFilters(null);
            return;
        }

        const categoryKey = optionsFindByName(name);
        const single = optionsForCategories[categoryKey].single;

        if (single) {
            setFilters(categoryKey, null);
        } else {
            const filteredArr = filters[categoryKey].filter(value =>
                value !== categories[categoryKey].find((
                    { value }) => value === val).key
            );
            setFilters(categoryKey, filteredArr);
        }
    };

    const onInputChange = (type, value) => {
        setFilters(type, value);
    };

    const buildFilterDropdown = () => {
        const onToggle = type => {
            setExpandedItems({
                ...expandedItems,
                [type]: !expandedItems[type]
            });
        };

        const onSelectCheckbox = (type, event, selection) => {
            setFilters(type, event.target.checked
                ? [ ...filters[type], selection ]
                : filters[type].filter(value => value !== selection)
            );
        };

        const onSelectSingle = (type, event, selection) => {
            setFilters(type, selection);
            onToggle(type);
        };

        const toolbarFilterRender = categoryKey  => {
            const options = optionsForCategories[categoryKey];

            const handleChips = () => {
                if (options.single) {
                    return handleSingleChips(
                        filters[categoryKey],
                        categories[categoryKey]
                    );
                } else {
                    return handleCheckboxChips(
                        filters[categoryKey],
                        categories[categoryKey]);
                }
            };

            const onSelect = (event, selection) => {
                if (options.single) {
                    onSelectSingle(categoryKey, event, selection);
                } else {
                    onSelectCheckbox(categoryKey, event, selection);
                }
            };

            return (
                <ToolbarFilter
                    key = { categoryKey }
                    showToolbarItem={ currentCategory === categoryKey }
                    chips={ handleChips() }
                    categoryName={ options.name }
                    deleteChip={ onDelete }
                >
                    <Select
                        variant={ options.single ? 'single' : 'checkbox' }
                        aria-label={ categoryKey }
                        onToggle={ () => onToggle(categoryKey) }
                        onSelect={ onSelect }
                        selections={ filters[categoryKey] }
                        isOpen={ !!expandedItems[categoryKey] }
                        placeholderText={ options.placeholder }
                    >
                        {
                            categories[categoryKey] &&
                            categories[categoryKey].map(({ key, value }) => (
                                <SelectOption key={ key } value={ key }>
                                    { value }
                                </SelectOption>
                            ))
                        }
                    </Select>
                </ToolbarFilter>
            );
        };

        return (
            <React.Fragment>
                { Object.keys(categories).map(key => toolbarFilterRender(key)) }
            </React.Fragment>
        );
    };

    return (
        <Toolbar
            id="filterable-toolbar-with-chip-groups"
            clearAllFilters={ onDelete }
            collapseListedFiltersBreakpoint="xl"
        >
            <ToolbarContent>
                <ToolbarToggleGroup toggleIcon={ <FilterIcon /> } breakpoint="xl">
                    <ToolbarGroup variant="filter-group">
                        <CategoryDropdown
                            selected={ currentCategory }
                            setSelected={ setCurrentCategory }
                            categories={
                                Object.keys(categories).map(el => ({
                                    key: el,
                                    name: optionsForCategories[el].name
                                }))
                            }
                        />
                        { buildFilterDropdown() }
                        { (currentCategory === 'quickDateRange' && filters.quickDateRange === 'custom') && (
                            <CustomDateSelector
                                startDate={ filters.startDate }
                                endDate={ filters.endDate }
                                onInputChange={ onInputChange }
                            />
                        ) }
                    </ToolbarGroup>
                </ToolbarToggleGroup>
                <div>
                    <Switch
                        id="showRootWorkflowJobs"
                        label="Ignore nested workflows and jobs"
                        labelOff="Ignore nested workflows and jobs"
                        isChecked={ filters.onlyRootWorkflowsAndStandaloneJobs }
                        onChange={ val => {
                            setFilters('onlyRootWorkflowsAndStandaloneJobs', val);
                        } }
                    />
                    <Tooltip
                        position={ TooltipPosition.top }
                        content={
                            <div>
                                { ' ' }
                                If enabled, nested workflows and jobs will not be included in
                                the overall totals. Enable this option to filter out duplicate
                                entries.
                            </div>
                        }
                    >
                        <QuestionCircleIcon />
                    </Tooltip>
                </div>
            </ToolbarContent>
        </Toolbar>
    );
};

FilterableToolbar.propTypes = {
    categories: PropTypes.object,
    filters: PropTypes.object,
    setFilters: PropTypes.func
};

export default FilterableToolbar;
