import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { ButtonVariant } from '@patternfly/react-core/dist/dynamic/components/Button';
import { ToolbarToggleGroup } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { Toolbar } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToolbarContent } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToolbarGroup } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToolbarItem } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToolbarItemVariant } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import CogIcon from '@patternfly/react-icons/dist/dynamic/icons/cog-icon';
import FilterIcon from '@patternfly/react-icons/dist/dynamic/icons/filter-icon';
import React, { FunctionComponent, ReactNode, useState } from 'react';
import { FilterCategoriesGroup, QuickDateGroup, SortByGroup } from './Groups';
import { optionsForCategories } from './constants';
import { ApiOptionsType, AttributeType, SetValues } from './types';

interface Props {
  categories: ApiOptionsType;
  // Todo: update to use the QueryParams type after known
  filters: Record<string, AttributeType>;
  defaultSelected?: string;
  setFilters: SetValues;
  pagination?: ReactNode | null;
  settingsPanel?: (
    setSettingsExpanded: (arg0: boolean) => void,
    settingsExpanded: boolean,
  ) => ReactNode;
  hasSettings?: boolean;
  additionalControls?: ReactNode[];
}

const FilterableToolbar: FunctionComponent<Props> = ({
  categories,
  filters,
  defaultSelected = '',
  setFilters: setQueryParams,
  pagination = null,
  hasSettings = false,
  settingsPanel = null,
  additionalControls = [],
}) => {
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const { quick_date_range, sort_options, granularity, ...restCategories } =
    categories;

  // Sets name attribute as a dropdown if it has predefined values
  if (Object.keys(categories).includes('name')) {
    optionsForCategories.name.type =
      categories.name[0].value !== null ? 'select' : 'text';
  }

  // Filter out elements which are not in the option object and in defaultParams
  const filterCategories = Object.keys(restCategories)
    .filter(
      (key) =>
        Object.keys(optionsForCategories).includes(key) &&
        Object.keys(filters).includes(key),
    )
    .reduce((obj: ApiOptionsType, key) => {
      obj[key] = restCategories[key];
      return obj;
    }, {});

  const setFilters = (key: string | null, value: AttributeType | null) => {
    setQueryParams(key, value);
  };

  return (
    <Toolbar
      className='pf-m-toggle-group-container'
      clearAllFilters={() => setFilters(null, null)}
      collapseListedFiltersBreakpoint='xl'
      data-cy={'filter-toolbar'}
    >
      <ToolbarContent>
        <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint='xl'>
          {Object.keys(filterCategories).length > 0 && (
            <FilterCategoriesGroup
              filterCategories={filterCategories}
              defaultSelected={defaultSelected}
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
        </ToolbarToggleGroup>
        {hasSettings && (
          <ToolbarItem>
            <Button
              variant={ButtonVariant.plain}
              onClick={() => setSettingsExpanded(!settingsExpanded)}
              aria-label='settings'
              data-cy={'settings'}
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
            data-cy={'top_pagination'}
            variant={ToolbarItemVariant.pagination}
            visibility={{ default: 'hidden', lg: 'visible' }}
          >
            {pagination}
          </ToolbarItem>
        )}
      </ToolbarContent>
      {settingsExpanded &&
        settingsPanel &&
        settingsPanel(setSettingsExpanded, settingsExpanded)}
    </Toolbar>
  );
};

export default FilterableToolbar;
