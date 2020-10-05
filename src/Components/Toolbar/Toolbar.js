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
    handleSingleChips,
    camelToSentence,
    sentenceToCamel
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
        placeholder: 'Filter by job status'
    },
    date: {
        single: true,
        placeholder: 'Filter by date'
    },
    job: {
        single: false,
        placeholder: 'Filter by job type'
    },
    organization: {
        single: false,
        placeholder: 'Filter by organization'
    },
    cluster: {
        single: false,
        placeholder: 'Filter by cluster'
    },
    template: {
        single: false,
        placeholder: 'Filter by template'
    },
    sortBy: {
        single: true,
        placeholder: 'Sort by attribute'
    }
};

const FilterableToolbar = ({
    categories,
    filters,
    setFilters
}) => {
    const [ expandedItems, setExpandedItems ] = useState({});
    const [ currentCategory, setCurrentCategory ] = useState('status');

    const onDelete = (type, val) => {
        if (!type) {
            setFilters({
                status: [],
                job: [],
                organization: [],
                cluster: [],
                template: [],
                sortBy: null,
                date: null,
                startDate: null,
                endDate: null,
                showRootWorkflows: false
            });
            return;
        }

        const categoryKey = sentenceToCamel(type);
        const single = optionsForCategories[categoryKey].single;

        if (single) {
            setFilters({
                ...filters,
                [categoryKey]: null
            });
        } else {
            const filteredArr = filters[categoryKey].filter(value =>
                value !== categories[categoryKey].find((
                    { value }) => value === val).key
            );
            setFilters({
                ...filters,
                [categoryKey]: filteredArr
            });
        }
    };

    const onInputChange = (type, value) => {
        setFilters({
            ...filters,
            [type]: value
        });
    };

    const buildFilterDropdown = () => {
        const onToggle = type => {
            setExpandedItems({
                ...expandedItems,
                [type]: !expandedItems[type]
            });
        };

        const onSelectCheckbox = (type, event, selection) => {
            setFilters({
                ...filters,
                [type]: event.target.checked
                    ? [ ...filters[type], selection ]
                    : filters[type].filter(value => value !== selection)
            });
        };

        const onSelectSingle = (type, event, selection) => {
            setFilters({
                ...filters,
                [type]: selection
            });
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
                    categoryName={ camelToSentence(categoryKey) }
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
                                    name: camelToSentence(el)
                                }))
                            }
                        />
                        { buildFilterDropdown() }
                        { (currentCategory === 'date' && filters.date === 'custom') && (
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
                        isChecked={ filters.showRootWorkflows }
                        onChange={ val => {
                            setFilters({
                                ...filters,
                                showRootWorkflows: val
                            });
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
