import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Toolbar,
    ToolbarContent,
    ToolbarGroup,
    Button,
    ToolbarItem,
    Tooltip,
    Switch
} from '@patternfly/react-core';
import { Card, CardTitle, CardBody, CardActions, CardHeader } from '@patternfly/react-core';
import {
    FilterIcon,
    SortAmountDownIcon,
    CogIcon,
    QuestionCircleIcon,
    TimesIcon
} from '@patternfly/react-icons';

import CategoryDropdown from './CategoryDropdown';
import CustomDateSelector from './CustomDateSelector';
import { optionsForCategories } from './constants';
import ToolbarFilterItem from './ToolbarFilterItem';

const FilterableToolbar = ({
    categories,
    filters,
    setFilters,
    pagination = null,
    hasSettings = false
}) => {
    const [ currentCategory, setCurrentCategory ] = useState(
        Object.keys(categories)[0]
    );
    const [ settingsExpanded, setSettingsExpanded ] = useState(false);

    const { quick_date_range, sort_by, ...filterCategories } = categories;

    const onInputChange = (type, value) => {
        setFilters(type, value);
    };

    const FilterCategoriesGroup = () => (
        <ToolbarGroup variant="filter-group">
            <CategoryDropdown
                selected={ currentCategory }
                setSelected={ setCurrentCategory }
                categories={
                    Object.keys(filterCategories).map(el => ({
                        key: el,
                        name: optionsForCategories[el].name
                    }))
                }
            />
            { Object.keys(filterCategories).map(key =>
                <ToolbarFilterItem
                    key={ key }
                    categoryKey={ key }
                    filter={ filters[key] }
                    values={ categories[key] }
                    isVisible={ currentCategory === key }
                    setFilter={ value => setFilters(key, value) }
                />
            ) }
        </ToolbarGroup>
    );

    const QuickDateGroup = () => (
        <ToolbarGroup variant="filter-group">
            <ToolbarFilterItem
                categoryKey='quick_date_range'
                filter={ filters.quick_date_range }
                values={ quick_date_range }
                setFilter={ value => setFilters('quick_date_range', value) }
                hasChips={ false }
            />
            { filters.quick_date_range === 'custom' && (
                <CustomDateSelector
                    startDate={ filters.start_date }
                    endDate={ filters.end_date }
                    onInputChange={ onInputChange }
                />
            ) }
        </ToolbarGroup>
    );

    const SortByGroup = () => (
        <ToolbarGroup variant="filter-group">
            <ToolbarFilterItem
                categoryKey='sort_by'
                filter={ filters.sort_by }
                values={ sort_by }
                setFilter={ value => setFilters('sort_by', value) }
                hasChips={ false }
            />
            <Button variant="control">
                <SortAmountDownIcon />
            </Button>
        </ToolbarGroup>
    );

    /* TODO: For future work: make settings more modular for different pages */
    const Settings = () => (
        <Card isFlat style={ { backgroundColor: '#EEEEEE' } }>
            <CardHeader>
                <CardActions>
                    <Button
                        variant='plain'
                        onClick={ () => setSettingsExpanded(!settingsExpanded) }
                    >
                        <TimesIcon />
                    </Button>
                </CardActions>
                <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardBody>
                <Switch
                    id="showRootWorkflowJobs"
                    label="Ignore nested workflows and jobs"
                    labelOff="Ignore nested workflows and jobs"
                    isChecked={ filters.only_root_workflows_and_standalone_jobs }
                    onChange={ val => {
                        setFilters('only_root_workflows_and_standalone_jobs', val);
                    } }
                />
                <Tooltip
                    position={ 'top' }
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
            </CardBody>
        </Card>
    );

    return (
        <>
            <Toolbar
                id="filterable-toolbar-with-chip-groups"
                clearAllFilters={ () => { setFilters(null, null); } }
                collapseListedFiltersBreakpoint="xl"
            >
                <ToolbarContent>
                    <Button variant="control">
                        <FilterIcon />
                    </Button>
                    { Object.keys(filterCategories).length > 0 && <FilterCategoriesGroup /> }
                    { quick_date_range && <QuickDateGroup /> }
                    { sort_by && <SortByGroup /> }
                    {
                        hasSettings &&
                        <ToolbarItem>
                            <Button
                                variant="plain"
                                onClick={ () => setSettingsExpanded(!settingsExpanded) }
                                aria-label="settings"
                                isActive={ settingsExpanded }
                            >
                                <CogIcon />
                            </Button>
                        </ToolbarItem>
                    }
                    {
                        pagination &&
                        <ToolbarItem variant="pagination" visibility={ { default: 'hidden', lg: 'visible' } }>
                            { pagination }
                        </ToolbarItem>
                    }
                </ToolbarContent>
                { settingsExpanded && <Settings /> }
            </Toolbar>
        </>
    );
};

FilterableToolbar.propTypes = {
    categories: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
    pagination: PropTypes.object,
    hasSettings: PropTypes.bool
};

export default FilterableToolbar;
