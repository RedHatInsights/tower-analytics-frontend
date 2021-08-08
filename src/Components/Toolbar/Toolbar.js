import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  Button,
  ToolbarItem,
  ToolbarItemVariant,
  ButtonVariant,
} from '@patternfly/react-core';
import { FilterIcon, CogIcon } from '@patternfly/react-icons';

import { optionsForCategories } from './constants';
import {
  FilterCategoriesGroup,
  QuickDateGroup,
  SortByGroup,
  SettingsPanel,
} from './Groups/';
import { useHistory } from 'react-router-dom';
import { handleSearch } from '../../Utilities/qs';

const FilterableToolbar = ({
  categories,
  filters,
  qsConfig,
  setFilters: setQueryParams,
  pagination = null,
  hasSettings = false,
  additionalControls = [],
}) => {
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const { quick_date_range, sort_options, ...restCategories } = categories;
  const history = useHistory();

  // Filter out elements which are not in the option object.
  const filterCategories = Object.keys(restCategories)
    .filter((key) => Object.keys(optionsForCategories).includes(key))
    .reduce((obj, key) => {
      obj[key] = restCategories[key];
      return obj;
    }, {});

  const setFilters = (key, value) => {
    setQueryParams(key, value);
    // Todo: this is temporary solution.
    handleSearch(key, value, qsConfig, history);
  };

  return (
    <Toolbar
      id={`${qsConfig.namespace}-filterable-toolbar-with-chip-groups`}
      clearAllFilters={() => setFilters(null, null)}
      collapseListedFiltersBreakpoint="xl"
    >
      <ToolbarContent>
        <Button variant={ButtonVariant.control}>
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
            values={quick_date_range}
            setFilters={setFilters}
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
              variant={ButtonVariant.plain}
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
            variant={ToolbarItemVariant.pagination}
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
  );
};

FilterableToolbar.propTypes = {
  categories: PropTypes.object.isRequired,
  qsConfig: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  pagination: PropTypes.object,
  hasSettings: PropTypes.bool,
  additionalControls: PropTypes.array,
};

export default FilterableToolbar;
