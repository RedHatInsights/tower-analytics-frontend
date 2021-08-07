import React, { FunctionComponent } from 'react';
import {
  ToolbarGroup,
  Button,
  SelectOptionProps,
  ButtonVariant,
} from '@patternfly/react-core';
import { SortAmountDownIcon, SortAmountUpIcon } from '@patternfly/react-icons';

import ToolbarInput from './ToolbarInput';
import { SetValues, AttributeType } from '../types';

interface Props {
  filters: {
    sort_options: string;
    sort_order: 'asc' | 'desc';
    [x: string]: AttributeType;
  };
  handleSearch: SetValues;
  setFilters: SetValues;
  sort_options: SelectOptionProps[];
}

const SortByGroup: FunctionComponent<Props> = ({
  filters,
  handleSearch,
  setFilters,
  sort_options,
}) => (
  <ToolbarGroup variant="filter-group">
    <ToolbarInput
      categoryKey="sort_options"
      value={filters.sort_options}
      selectOptions={sort_options}
      setValue={(value) => {
        setFilters('sort_options', value as string);
        handleSearch('sort_options', value as string);
      }}
    />
    <Button
      variant={ButtonVariant.control}
      onClick={() => {
        setFilters('sort_order', filters.sort_order === 'asc' ? 'desc' : 'asc');
        handleSearch(
          'sort_order',
          filters.sort_order === 'asc' ? 'desc' : 'asc'
        );
      }}
    >
      {filters.sort_order === 'asc' && <SortAmountUpIcon />}
      {filters.sort_order === 'desc' && <SortAmountDownIcon />}
    </Button>
  </ToolbarGroup>
);

export default SortByGroup;
