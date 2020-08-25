import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
    Dropdown,
    DropdownToggle,
    DropdownItem,
    InputGroup,
    InputGroupText,
    TextInput,
    Toolbar,
    ToolbarContent as PFToolbarContent,
    ToolbarFilter,
    ToolbarToggleGroup,
    ToolbarItem,
    ToolbarGroup as PFToolbarGroup,
    Select,
    SelectOption,
    Switch as PFSwitch,
    Tooltip,
    TooltipPosition
} from '@patternfly/react-core';
import {
    FilterIcon,
    CalendarAltIcon,
    QuestionCircleIcon
} from '@patternfly/react-icons';

import { toolbarCategories } from '../Utilities/constants';

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

const handleChips = (item, comparator) => {
    return item.reduce((acc, i) => {
        Number.isInteger(parseInt(i)) ? (i = parseInt(i)) : i;
        comparator.forEach(item => {
            if (item.key === i) {
                acc.push(item.value);
            }
        });
        return acc;
    }, []);
};

const handleDateChips = (date, comparator) => {
    if (date && typeof date === 'string') {
        let val;
        comparator.forEach(i => {
            if (i.key === date) {
                val = i.value;
            }
        });
        return new Array(val);
    }

    return new Array();
};

const FilterableToolbar = ({
    orgs,
    statuses,
    types,
    clusters,
    templates,
    sortables,
    dateRanges,
    onDelete,
    passedFilters,
    handleFilters
}) => {
    const [ statusIsExpanded, setStatusIsExpanded ] = useState(false);
    const [ dateRangeIsExpanded, setDateRangeIsExpanded ] = useState(false);
    const [ jobTypeIsExpanded, setJobTypeIsExpanded ] = useState(false);
    const [ orgIsExpanded, setOrgIsExpanded ] = useState(false);
    const [ isCategoryExpanded, setIsCategoryExpanded ] = useState(false);
    const [ clusterIsExpanded, setClusterIsExpanded ] = useState(false);
    const [ templateIsExpanded, setTemplateIsExpanded ] = useState(false);
    const [ sortByIsExpanded, setSortByIsExpanded ] = useState(false);
    const [ currentCategory, setCurrentCategory ] = useState('Status');

    const handleStartDate = e => {
        handleFilters({
            ...passedFilters,
            startDate: e
        });
    };

    const handleEndDate = e => {
        handleFilters({
            ...passedFilters,
            endDate: e
        });
    };

    const buildCategoryDropdown = categories => {
        return (
            <ToolbarItem>
                <Dropdown
                    onSelect={ e => {
                        setCurrentCategory(e.target.innerText);
                        setIsCategoryExpanded(!isCategoryExpanded);
                    } }
                    position={ 'left' }
                    toggle={
                        <DropdownToggle
                            onToggle={ () => {
                                setIsCategoryExpanded(!isCategoryExpanded);
                            } }
                            style={ { width: '100%' } }
                        >
                            <FilterIcon />
            &nbsp;{ currentCategory }
                        </DropdownToggle>
                    }
                    isOpen={ isCategoryExpanded }
                    dropdownItems={ categories.map(category => (
                        <DropdownItem key={ category.id }>{ category.name }</DropdownItem>
                    )) }
                    style={ { width: '100%' } }
                />
            </ToolbarItem>
        );
    };

    const buildFilterDropdown = () => {
        const organizationIdMenuItems = orgs.map(({ key, value }) => (
            <SelectOption key={ key } value={ `${key}` }>
                { value }
            </SelectOption>
        ));

        const statusMenuItems = statuses.map(({ key, value }) => (
            <SelectOption key={ key } value={ key }>
                { value }
            </SelectOption>
        ));

        const jobTypeMenuItems = types.map(({ key, value }) => (
            <SelectOption key={ key } value={ key }>
                { value }
            </SelectOption>
        ));

        const clusterIdMenuItems = clusters.map(({ key, value }) => (
            <SelectOption key={ key } value={ `${key}` }>
                { value }
            </SelectOption>
        ));

        const templateIdMenuItems = templates.map(({ key, value }) => (
            <SelectOption key={ key } value={ `${key}` }>
                { value }
            </SelectOption>
        ));

        const sortByMenuItems = sortables.map(({ key, value }) => (
            <SelectOption key={ key } value={ key }>
                { value }
            </SelectOption>
        ));

        const dateRangeMenuItems = dateRanges.map(({ key, value }) => (
            <SelectOption key={ key } value={ key }>
                { value }
            </SelectOption>
        ));

        const onSelect = (type, event, selection) => {
            const checked = event.target.checked;

            handleFilters({
                ...passedFilters,
                [type]: checked
                    ? [ ...passedFilters[type], selection ]
                    : passedFilters[type].filter(value => value !== selection)
            });
        };

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Fix: sort by filter converted to select instead of multiselect
        const onSortSelect = (_event, selection) => {
            handleFilters({
                ...passedFilters,
                sortby: selection
            });
            setSortByIsExpanded(!sortByIsExpanded);
        };

<<<<<<< HEAD
=======
>>>>>>> Break out filterable toolbar into it's own component.
=======
>>>>>>> Fix: sort by filter converted to select instead of multiselect
        const onDateSelect = (_event, selection) => {
            handleFilters({
                ...passedFilters,
                date: selection
            });
            setDateRangeIsExpanded(!dateRangeIsExpanded);
        };

        return (
            <React.Fragment>
                <ToolbarFilter
                    showToolbarItem={ currentCategory === 'Status' }
                    chips={ handleChips(passedFilters.status, statuses) }
                    categoryName="Status"
                    deleteChip={ onDelete }
                >
                    <Select
                        isOpen={ statusIsExpanded }
                        variant={ 'checkbox' }
                        aria-label="Status"
                        onToggle={ () => {
                            setStatusIsExpanded(!statusIsExpanded);
                        } }
                        onSelect={ (event, selection) => {
                            onSelect('status', event, selection);
                        } }
                        selections={ passedFilters.status }
                        isExpanded={ statusIsExpanded }
                        placeholderText="Filter by job status"
                    >
                        { statusMenuItems }
                    </Select>
                </ToolbarFilter>
                <ToolbarFilter
                    showToolbarItem={ currentCategory === 'Date' }
                    categoryName="Date"
                    chips={ handleDateChips(passedFilters.date, dateRanges) }
                    deleteChip={ onDelete }
                >
                    <Select
                        isOpen={ dateRangeIsExpanded }
                        variant={ 'single' }
                        aria-label="Date"
                        onToggle={ () => {
                            setDateRangeIsExpanded(!dateRangeIsExpanded);
                        } }
                        onSelect={ (event, selection) => {
                            onDateSelect(event, selection);
                        } }
                        selections={ passedFilters.date }
                        isExpanded={ dateRangeIsExpanded }
                        placeholderText="Filter by date range"
                    >
                        { dateRangeMenuItems }
                    </Select>
                </ToolbarFilter>
                <ToolbarFilter
<<<<<<< HEAD
<<<<<<< HEAD
                    showToolbarItem={ currentCategory === 'Job' }
=======
                    showToolbarItem={ currentCategory === 'Job type' }
>>>>>>> Break out filterable toolbar into it's own component.
=======
                    showToolbarItem={ currentCategory === 'Job' }
>>>>>>> Fix job type category dropdown not showing.
                    categoryName="Type"
                    chips={ handleChips(passedFilters.type, types) }
                    deleteChip={ onDelete }
                >
                    <Select
                        isOpen={ jobTypeIsExpanded }
                        aria-label="Type"
                        variant={ 'checkbox' }
                        onToggle={ () => {
                            setJobTypeIsExpanded(!jobTypeIsExpanded);
                        } }
                        onSelect={ (event, selection) => {
                            onSelect('type', event, selection);
                        } }
                        selections={ passedFilters.type }
                        isExpanded={ jobTypeIsExpanded }
                        placeholderText="Filter by job type"
                    >
                        { jobTypeMenuItems }
                    </Select>
                </ToolbarFilter>
                <ToolbarFilter
                    showToolbarItem={ currentCategory === 'Organization' }
                    categoryName="Org"
                    chips={ handleChips(passedFilters.org, orgs) }
                    deleteChip={ onDelete }
                >
                    <Select
                        isOpen={ orgIsExpanded }
                        aria-label="Filter by Org"
                        variant={ 'checkbox' }
                        onToggle={ () => {
                            setOrgIsExpanded(!orgIsExpanded);
                        } }
                        onSelect={ (event, selection) => {
                            onSelect('org', event, selection);
                        } }
                        selections={ passedFilters.org }
                        isExpanded={ orgIsExpanded }
                        placeholderText="Filter by organization"
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Add style to select inline instead of using styled component.
                        style={ {
                            maxHeight: 500,
                            overflow: 'auto'
                        } }
<<<<<<< HEAD
=======
>>>>>>> Break out filterable toolbar into it's own component.
=======
>>>>>>> Add style to select inline instead of using styled component.
                    >
                        { organizationIdMenuItems }
                    </Select>
                </ToolbarFilter>
                <ToolbarFilter
                    showToolbarItem={ currentCategory === 'Cluster' }
                    categoryName="Cluster"
                    chips={ handleChips(passedFilters.cluster, clusters) }
                    deleteChip={ onDelete }
                >
                    <Select
                        isOpen={ clusterIsExpanded }
                        aria-label="Filter by Cluster"
                        variant={ 'checkbox' }
                        onToggle={ () => {
                            setClusterIsExpanded(!clusterIsExpanded);
                        } }
                        onSelect={ (event, selection) => {
                            onSelect('cluster', event, selection);
                        } }
                        selections={ passedFilters.cluster }
                        isExpanded={ clusterIsExpanded }
                        placeholderText="Filter by cluster"
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Add style to select inline instead of using styled component.
                        style={ {
                            maxHeight: 500,
                            overflow: 'auto'
                        } }
<<<<<<< HEAD
=======
>>>>>>> Break out filterable toolbar into it's own component.
=======
>>>>>>> Add style to select inline instead of using styled component.
                    >
                        { clusterIdMenuItems }
                    </Select>
                </ToolbarFilter>
                <ToolbarFilter
                    showToolbarItem={ currentCategory === 'Template' }
                    categoryName="Template"
                    chips={ handleChips(passedFilters.template, templates) }
                    deleteChip={ onDelete }
                >
                    <Select
                        isOpen={ templateIsExpanded }
                        aria-label="Filter by template"
                        variant={ 'checkbox' }
                        onToggle={ () => setTemplateIsExpanded(!templateIsExpanded) }
                        onSelect={ (event, selection) => {
                            onSelect('template', event, selection);
                        } }
                        selections={ passedFilters.template }
                        isExpanded={ templateIsExpanded }
<<<<<<< HEAD
<<<<<<< HEAD
                        placeholderText="Filter by template"z
=======
                        placeholderText="Filter by template"
<<<<<<< HEAD
>>>>>>> Break out filterable toolbar into it's own component.
=======
                        style={ {
                            maxHeight: 500,
                            overflow: 'auto'
                        } }
>>>>>>> Add style to select inline instead of using styled component.
=======
                        placeholderText="Filter by template"z
>>>>>>> Remove comment. Vertically align datalist row content.
                    >
                        { templateIdMenuItems }
                    </Select>
                </ToolbarFilter>
                <ToolbarFilter
                    showToolbarItem={ currentCategory === 'Sort by' }
                    categoryName="SortBy"
<<<<<<< HEAD
<<<<<<< HEAD
                    chips={ handleDateChips(passedFilters.sortby, sortables) }
=======
                    chips={ handleChips(passedFilters.sortby, sortables) }
>>>>>>> Break out filterable toolbar into it's own component.
=======
                    chips={ handleDateChips(passedFilters.sortby, sortables) }
>>>>>>> Fix: sort by filter converted to select instead of multiselect
                    deleteChip={ onDelete }
                >
                    <Select
                        isOpen={ sortByIsExpanded }
                        aria-label="Sort by"
<<<<<<< HEAD
<<<<<<< HEAD
                        variant={ 'single' }
=======
                        variant={ 'checkbox' }
>>>>>>> Break out filterable toolbar into it's own component.
=======
                        variant={ 'single' }
>>>>>>> Fix: sort by filter converted to select instead of multiselect
                        onToggle={ () => {
                            setSortByIsExpanded(!sortByIsExpanded);
                        } }
                        onSelect={ (event, selection) => {
<<<<<<< HEAD
<<<<<<< HEAD
                            onSortSelect(event, selection);
=======
                            onSelect('sortby', event, selection);
>>>>>>> Break out filterable toolbar into it's own component.
=======
                            onSortSelect(event, selection);
>>>>>>> Fix: sort by filter converted to select instead of multiselect
                        } }
                        selections={ passedFilters.sortby }
                        isExpanded={ sortByIsExpanded }
                        placeholderText="Sort by attribute"
                    >
                        { sortByMenuItems }
                    </Select>
                </ToolbarFilter>
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
                    { dateRanges.length > 0 && (
                        <ToolbarGroup variant="filter-group">
                            { buildCategoryDropdown(toolbarCategories) }
                            { buildFilterDropdown() }
                            { passedFilters.date === 'custom' && (
                <>
                  <InputGroup>
                      <InputGroupText component="label" htmlFor="startDate">
                          <CalendarAltIcon />
                      </InputGroupText>
                      <TextInput
                          name="startDate"
                          id="startDate"
                          type="date"
                          aria-label="Start Date"
<<<<<<< HEAD
<<<<<<< HEAD
                          value={ passedFilters.startDate || '' }
=======
                          value={ passedFilters.startDate }
>>>>>>> Break out filterable toolbar into it's own component.
=======
                          value={ passedFilters.startDate || '' }
>>>>>>> Fix: No default value to date picker causing errors fixed
                          onChange={ e => handleStartDate(e) }
                      />
                  </InputGroup>
                  <InputGroup>
                      <InputGroupText component="label" htmlFor="endDate">
                          <CalendarAltIcon />
                      </InputGroupText>
                      <TextInput
                          name="endDate"
                          id="endDate"
                          type="date"
                          aria-label="End Date"
<<<<<<< HEAD
<<<<<<< HEAD
                          value={ passedFilters.endDate || '' }
=======
                          value={ passedFilters.endDate }
>>>>>>> Break out filterable toolbar into it's own component.
=======
                          value={ passedFilters.endDate || '' }
>>>>>>> Fix: No default value to date picker causing errors fixed
                          onChange={ e => handleEndDate(e) }
                      />
                  </InputGroup>
                </>
                            ) }
                        </ToolbarGroup>
                    ) }
                </ToolbarToggleGroup>
                <div>
                    <Switch
                        id="showRootWorkflowJobs"
                        label="Ignore nested workflows and jobs"
                        labelOff="Ignore nested workflows and jobs"
<<<<<<< HEAD
<<<<<<< HEAD
                        isChecked={ !!passedFilters.showRootWorkflows }
=======
                        isChecked={ passedFilters.showRootWorkflows }
>>>>>>> Break out filterable toolbar into it's own component.
=======
                        isChecked={ !!passedFilters.showRootWorkflows }
>>>>>>> Fix: Fixed hard-refresh switch default value error by passing bool
                        onChange={ val => {
                            handleFilters({
                                ...passedFilters,
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
    orgs: PropTypes.array,
    statuses: PropTypes.array,
    types: PropTypes.array,
    clusters: PropTypes.array,
    templates: PropTypes.array,
    sortables: PropTypes.array,
    dateRanges: PropTypes.array,
    onDelete: PropTypes.func,
    passedFilters: PropTypes.object,
    handleFilters: PropTypes.func
};

export default FilterableToolbar;
