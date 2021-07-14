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
import {useHistory} from "react-router-dom";
import {encodeNonDefaultQueryString, parseQueryString, mergeParams, removeParams, replaceParams} from "../../Utilities/qs";

const FilterableToolbar = ({
  categories,
  filters,
  qsConfig,
  setFilters,
  pagination = null,
  hasSettings = false,
  additionalControls = [],
  hideQuickDateRange = false,
  hideSortOptions = false,
}) => {
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const { quick_date_range, sort_options, ...restCategories } = categories;
  const history = useHistory()

  // Filter out elements which are not in the option object.
  const filterCategories = Object.keys(restCategories)
    .filter((key) => Object.keys(optionsForCategories).includes(key))
    .reduce((obj, key) => {
      obj[key] = restCategories[key];
      return obj;
    }, {});

  const handleSearch = (key, value) => {
    let params = parseQueryString(qsConfig, history.location.search);
    params = replaceParams(params, { [key]: value });
    params = mergeParams(params, { [key]: value });
    if (value === '' || value.length === 0)
      params = removeParams(qsConfig, params, {[key]: params[key]});
    pushHistoryState(params, qsConfig);
  }

  const handleRemoveAll = (qsConfig) => {
    // remove everything in oldParams except for page_size and order_by
    const oldParams = parseQueryString(qsConfig, history.location.search);
    const oldParamsClone = { ...oldParams };
    delete oldParamsClone.limit;
    delete oldParamsClone.sort_by;
    pushHistoryState(removeParams(qsConfig, oldParams, oldParamsClone), qsConfig);
  }

  const pushHistoryState = (params, qsConfig) => {
    const { pathname } = history.location;
    const nonNamespacedParams = parseQueryString({}, history.location.search);
    const encodedParams = encodeNonDefaultQueryString(
      qsConfig,
      params,
      nonNamespacedParams
    );
    history.push(encodedParams ? `${pathname}?${encodedParams}` : pathname);
  }

  return (
    <>
      <Toolbar
        id={`${qsConfig.namespace}-filterable-toolbar-with-chip-groups`}
        clearAllFilters={() => {
          handleRemoveAll(qsConfig);
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
              handleSearch={handleSearch}
            />
          )}
          {!hideQuickDateRange && quick_date_range && (
            <QuickDateGroup
              filters={filters}
              setFilters={setFilters}
              values={quick_date_range}
              handleSearch={handleSearch}
            />
          )}
          {!hideSortOptions && sort_options && (
            <SortByGroup
              filters={filters}
              setFilters={setFilters}
              sort_options={sort_options}
              handleSearch={handleSearch}
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
            handleSearch={handleSearch}
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
  qsConfig: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  pagination: PropTypes.object,
  hasSettings: PropTypes.bool,
  additionalControls: PropTypes.array,
  hideSortOptions: PropTypes.bool,
  hideQuickDateRange: PropTypes.bool,
};

export default FilterableToolbar;
