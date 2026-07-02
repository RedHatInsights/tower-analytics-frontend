import { ToolbarGroup } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import React, { FunctionComponent, useState } from 'react';
import { optionsForCategories } from '../constants';
import { AttributeType, SelectOptionProps, SetValues } from '../types';
import CategoryDropdown from './CategoryDropdown';
import TextInput from './ToolbarInput/Text';
import ToolbarInput from './ToolbarInput';

// Sentinel key used when the "Search" (keyword) option is selected
const SEARCH_KEY = '__search__';

interface Props {
  filterCategories: Record<string, SelectOptionProps[]>;
  defaultSelected: string;
  filters: Record<string, AttributeType>;
  setFilters: SetValues;
  // When provided, prepends a "Search" option as the first entry that maps to
  // this category key (e.g. 'name'). The Search option is selected by default.
  searchFirst?: string;
}

const FilterCategoriesGroup: FunctionComponent<Props> = ({
  filterCategories,
  defaultSelected,
  filters,
  setFilters,
  searchFirst,
}) => {
  const initialCategory = searchFirst
    ? SEARCH_KEY
    : defaultSelected || Object.keys(filterCategories)[0];

  const [currentCategory, setCurrentCategory] = useState(initialCategory);

  // The key used by the "Search" entry's underlying input
  const searchKey = searchFirst ?? '';

  // When searchFirst is set, exclude its key from the regular list to avoid
  // showing both "Search" and "Name" (or whichever key) as separate options.
  const regularKeys = Object.keys(filterCategories).filter(
    (k) => k !== searchFirst,
  );

  // Build the ordered category list: Search first (if requested), then the rest
  const dropdownCategories = [
    ...(searchFirst ? [{ key: SEARCH_KEY, name: 'Search' }] : []),
    ...regularKeys.map((el) => ({
      key: el,
      name: optionsForCategories[el].name,
    })),
  ];

  return (
    <ToolbarGroup variant='filter-group'>
      <CategoryDropdown
        categoryKey='category_selector'
        selected={currentCategory}
        setSelected={setCurrentCategory}
        categories={dropdownCategories}
      />

      {/* Always a plain text input when "Search" (keyword) is active —
          bypasses ToolbarInput so it never becomes a select dropdown */}
      {searchFirst && (
        <TextInput
          key={SEARCH_KEY}
          categoryKey={searchKey}
          label='Search'
          value={
            // Default param for name is [] — normalize to a string
            Array.isArray(filters[searchKey])
              ? (filters[searchKey] as string[])[0] ?? ''
              : (filters[searchKey] as string) ?? ''
          }
          isVisible={currentCategory === SEARCH_KEY}
          setValue={(value) => setFilters(searchKey, value)}
        />
      )}

      {/* Existing per-category inputs — exclude the searchFirst key since
          the Search entry above already handles it */}
      {regularKeys.map((key) => (
        <ToolbarInput
          key={key}
          categoryKey={key}
          value={filterCategories[key].length > 0 ? filters[key] : ''}
          selectOptions={filterCategories[key]}
          isVisible={currentCategory === key}
          setValue={(value) => setFilters(key, value)}
        />
      ))}
    </ToolbarGroup>
  );
};

export default FilterCategoriesGroup;
