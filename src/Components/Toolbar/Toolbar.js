import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  Button,
  ToolbarItem,
} from '@patternfly/react-core';
import { FilterIcon, CogIcon } from '@patternfly/react-icons';

import { optionsForCategories } from './constants';
import {
  FilterCategoriesGroup,
  QuickDateGroup,
  SortByGroup,
  SettingsPanel,
} from './Groups/';
import {useLocation, useHistory} from "react-router-dom";

const FilterableToolbar = ({
  categories,
  filters,
  setFilters,
  pagination = null,
  hasSettings = false,
  additionalControls = [],
  hideQuickDateRange = false,
  hideSortOptions = false,
}) => {
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const { quick_date_range, sort_options, ...restCategories } = categories;
  const { pathname } = useLocation();
  const history = useHistory()

  // Filter out elements which are not in the option object.
  const filterCategories = Object.keys(restCategories)
    .filter((key) => Object.keys(optionsForCategories).includes(key))
    .reduce((obj, key) => {
      obj[key] = restCategories[key];
      return obj;
    }, {});

  return (
    <>
      <Toolbar
        id="filterable-toolbar-with-chip-groups"
        clearAllFilters={() => {
          history.replace({
            pathname: pathname,
            search: ''
          });
          setFilters(null, null);
        }}
        collapseListedFiltersBreakpoint="xl"
      >
        <ToolbarContent>
          <Button variant="control">
            <FilterIcon />
          </Button>
          {Object.keys(filterCategories).length > 0 && (
            <FilterCategoriesGroup
              filterCategories={filterCategories}
              filters={filters}
              setFilters={setFilters}
            />
          )}
          {!hideQuickDateRange && quick_date_range && (
            <QuickDateGroup
              filters={filters}
              setFilters={setFilters}
              values={quick_date_range}
            />
          )}
          {!hideSortOptions && sort_options && (
            <SortByGroup
              filters={filters}
              setFilters={setFilters}
              sort_options={sort_options}
            />
          )}
          {hasSettings && (
            <ToolbarItem>
              <Button
                variant="plain"
                onClick={() => setSettingsExpanded(!settingsExpanded)}
                aria-label="settings"
                isActive={settingsExpanded}
              >
                <CogIcon />
              </Button>
            </ToolbarItem>
          )}
          {additionalControls.length > 0 && (
            <ToolbarGroup>
              {additionalControls.map((control, idx) => (
                <ToolbarItem key={idx}>{control}</ToolbarItem>
              ))}
            </ToolbarGroup>
          )}
          {pagination && (
            <ToolbarItem
              variant="pagination"
              visibility={{ default: 'hidden', lg: 'visible' }}
            >
              {pagination}
            </ToolbarItem>
          )}
        </ToolbarContent>
        {settingsExpanded && (
          <SettingsPanel
            filters={filters}
            setFilters={setFilters}
            settingsExpanded={settingsExpanded}
            setSettingsExpanded={setSettingsExpanded}
          />
        )}
      </Toolbar>
    </>
  );
};

FilterableToolbar.propTypes = {
  categories: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  pagination: PropTypes.object,
  hasSettings: PropTypes.bool,
  additionalControls: PropTypes.array,
  hideSortOptions: PropTypes.bool,
  hideQuickDateRange: PropTypes.bool,
};

export default FilterableToolbar;
