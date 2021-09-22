import React, { FunctionComponent, useState } from 'react';
import {
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  Button,
  ToolbarItem,
  ToolbarItemVariant,
  ButtonVariant,
  ToolbarToggleGroup,
} from '@patternfly/react-core';
import { FilterIcon, CogIcon } from '@patternfly/react-icons';

import { optionsForCategories } from './constants';
import {
  FilterCategoriesGroup,
  QuickDateGroup,
  SortByGroup,
  SettingsPanel,
} from './Groups';
import { useHistory } from 'react-router-dom';
import { handleSearch } from '../../Utilities/qs';
import { ApiOptionsType, AttributeType, SetValues } from './types';

interface Props {
  categories: ApiOptionsType;
  // Todo: update to use the QueryParams type after known
  filters: Record<string, AttributeType>;
  qsConfig: {
    namespace: string;
    [x: string]: any;
  }; // TODO: Update the type when figured out what is going on in qs.
  setFilters: SetValues;
  pagination: FunctionComponent;
  hasSettings: boolean;
  additionalControls: FunctionComponent[];
}

const FilterableToolbar: FunctionComponent<Props> = ({
  categories,
  filters,
  qsConfig,
  setFilters: setQueryParams,
  pagination = null,
  hasSettings = false,
  additionalControls = [],
}) => {
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const { quick_date_range, sort_options, granularity, ...restCategories } =
    categories;
  const history = useHistory();

  // Filter out elements which are not in the option object.
  const filterCategories = Object.keys(restCategories)
    .filter((key) => Object.keys(optionsForCategories).includes(key))
    .reduce((obj: ApiOptionsType, key) => {
      obj[key] = restCategories[key];
      return obj;
    }, {});

  const setFilters = (
    key: string | undefined,
    value: AttributeType | undefined
  ) => {
    setQueryParams(key, value);
    // Todo: this is temporary solution This call probably will not be here.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    handleSearch(key, value, qsConfig, history);
  };

  return (
    <Toolbar
      className="pf-m-toggle-group-container"
      id={`${qsConfig.namespace}-filterable-toolbar-with-chip-groups`}
      clearAllFilters={() => setFilters(undefined, undefined)}
      collapseListedFiltersBreakpoint="xl"
    >
      <ToolbarContent>
        <ToolbarToggleGroup
          toggleIcon={
            <Button variant={ButtonVariant.control}>
              <FilterIcon />
            </Button>
          }
          breakpoint="xl"
        >
          {Object.keys(filterCategories).length > 0 && (
            <FilterCategoriesGroup
              filterCategories={filterCategories}
              filters={filters}
              setFilters={setFilters}
            />
          )}
          {(quick_date_range || granularity) && (
            <QuickDateGroup
              filters={filters}
              values={{ quick_date_range, granularity }}
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
        </ToolbarToggleGroup>
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

export default FilterableToolbar;
