import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Toolbar,
  ToolbarContent,
  Button,
  ToolbarItem,
} from '@patternfly/react-core';
import { FilterIcon, CogIcon } from '@patternfly/react-icons';

import { optionsForCategories } from './constants';
import FilterCategoriesGroup from './Groups/FiltersCategoriesGroup';
import QuickDateGroup from './Groups/QuickDateGroup';
import SortByGroup from './Groups/SortByGroup';
import SettingsPanel from './Groups/SettingsPanel';

const FilterableToolbar = ({
  categories,
  filters,
  setFilters,
  pagination = null,
  hasSettings = false,
}) => {
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const { quick_date_range, sort_options, ...restCategories } = categories;

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
          {quick_date_range && (
            <QuickDateGroup
              filters={filters}
              setFilters={setFilters}
              values={quick_date_range}
            />
          )}
          {sort_options && (
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
};

export default FilterableToolbar;
