import React, { FunctionComponent, useState } from 'react';
import { SelectOptionProps, ToolbarGroup } from '@patternfly/react-core';

import CategoryDropdown from './CategoryDropdown';
import ToolbarInput from './ToolbarInput';
import { optionsForCategories } from '../constants';
import { SetValues, AttributeType } from '../types';

interface Props {
  filterCategories: Record<string, SelectOptionProps[]>;
  filters: Record<string, AttributeType>;
  setFilters: SetValues;
}

const FilterCategoriesGroup: FunctionComponent<Props> = ({
  filterCategories,
  filters,
  setFilters,
}) => {
  const [currentCategory, setCurrentCategory] = useState(
    Object.keys(filterCategories)[0]
  );

  return (
    <ToolbarGroup variant="filter-group">
      <CategoryDropdown
        categoryKey="category_selector"
        selected={currentCategory}
        setSelected={setCurrentCategory}
        categories={Object.keys(filterCategories).map((el) => {
          return {
            key: el,
            name: optionsForCategories[el].name,
          };
        })}
      />
      {Object.keys(filterCategories).map((key) => {
        const val =
          filters.task_action_name && key === 'task_action_id'
            ? [
                filterCategories.task_action_id
                  .filter((obj) => obj.value === filters.task_action_name)[0]
                  .key?.toString(),
              ]
            : null;

        // if (val && filters.task_action_name && key === 'task_action_id') {
        //   console.log('set filters', key, val);
        //   setFilters(key, val ?? 0);
        // }

        return (
          <ToolbarInput
            key={key}
            categoryKey={key}
            value={val ?? filters[key]}
            selectOptions={filterCategories[key]}
            isVisible={currentCategory === key}
            setValue={(value) => setFilters(key, value)}
          />
        );
      })}
    </ToolbarGroup>
  );
};

export default FilterCategoriesGroup;
