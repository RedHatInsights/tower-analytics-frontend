import React, { FunctionComponent, useState } from 'react';
import { SelectOptionProps, ToolbarGroup } from '@patternfly/react-core';

import CategoryDropdown from './CategoryDropdown';
import ToolbarInput from './ToolbarInput';
import { optionsForCategories } from '../constants';
import { AttributeType } from './ToolbarInput/types';
import { SetValues } from './types';

interface Props {
  filterCategories: Record<string, SelectOptionProps[]>;
  filters: Record<string, AttributeType>;
  handleSearch: SetValues;
  setFilters: SetValues;
}

const FilterCategoriesGroup: FunctionComponent<Props> = ({
  filterCategories,
  filters,
  handleSearch,
  setFilters,
}) => {
  const [currentCategory, setCurrentCategory] = useState(
    Object.keys(filterCategories)[0]
  );

  return (
    <ToolbarGroup variant="filter-group">
      <CategoryDropdown
        selected={currentCategory}
        setSelected={setCurrentCategory}
        categories={Object.keys(filterCategories).map((el) => ({
          key: el,
          name: optionsForCategories[el].name,
        }))}
      />
      {Object.keys(filterCategories).map((key) => (
        <ToolbarInput
          key={key}
          categoryKey={key}
          value={filters[key]}
          selectOptions={filterCategories[key]}
          isVisible={currentCategory === key}
          setValue={(value) => {
            setFilters(key, value);
            handleSearch(key, value);
          }}
        />
      ))}
    </ToolbarGroup>
  );
};

export default FilterCategoriesGroup;
