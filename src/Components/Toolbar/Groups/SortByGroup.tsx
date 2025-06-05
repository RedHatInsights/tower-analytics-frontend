import { SelectOptionProps } from '@patternfly/react-core/deprecated';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { ButtonVariant } from '@patternfly/react-core/dist/dynamic/components/Button';
import { ToolbarItem } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToolbarGroup } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToolbarGroupVariant } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import SortAmountDownIcon from '@patternfly/react-icons/dist/dynamic/icons/sort-amount-down-icon';
import SortAmountUpIcon from '@patternfly/react-icons/dist/dynamic/icons/sort-amount-up-icon';
import React, { FunctionComponent } from 'react';
import { AttributeType, SetValues } from '../types';
import ToolbarInput from './ToolbarInput';

interface Props {
  filters: Record<string, AttributeType>;
  setFilters: SetValues;
  sort_options: SelectOptionProps[];
}

const SortByGroup: FunctionComponent<Props> = ({
  filters,
  setFilters,
  sort_options,
}) => (
  <ToolbarGroup variant={ToolbarGroupVariant['filter-group']}>
    <ToolbarItem>
      <ToolbarInput
        categoryKey='sort_options'
        value={filters.sort_options}
        selectOptions={sort_options}
        setValue={(value) => setFilters('sort_options', value as string)}
      />
    </ToolbarItem>
    <ToolbarItem data-cy={'sort'}>
      <Button
        variant={ButtonVariant.control}
        data-cy={filters.sort_order === 'asc' ? 'desc' : 'asc'}
        onClick={() =>
          setFilters(
            'sort_order',
            filters.sort_order === 'asc' ? 'desc' : 'asc',
          )
        }
      >
        {filters.sort_order === 'asc' && <SortAmountUpIcon />}
        {filters.sort_order === 'desc' && <SortAmountDownIcon />}
      </Button>
    </ToolbarItem>
  </ToolbarGroup>
);

export default SortByGroup;
