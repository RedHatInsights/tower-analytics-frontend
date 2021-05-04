import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ToolbarGroup } from '@patternfly/react-core';

import CategoryDropdown from '../CustomFormElements/CategoryDropdown';
import ToolbarFilterItem from '../CustomFormElements/ToolbarFilterItem';
import { optionsForCategories } from '../constants';

const FilterCategoriesGroup = ({ filterCategories, filters, setFilters }) => {
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
        <ToolbarFilterItem
          key={key}
          categoryKey={key}
          filter={filters[key]}
          values={filterCategories[key]}
          isVisible={currentCategory === key}
          setFilter={(value) => setFilters(key, value)}
        />
      ))}
    </ToolbarGroup>
  );
};

FilterCategoriesGroup.propTypes = {
  filterCategories: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
};

export default FilterCategoriesGroup;
