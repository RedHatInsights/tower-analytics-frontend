import React, { FunctionComponent } from 'react';
import {
  SplitItem,
  ToolbarGroup,
  Split,
  SelectOptionProps,
} from '@patternfly/react-core';

import ToolbarInput from './ToolbarInput';

import { today } from '../../../Utilities/helpers';
import { SetValues, AttributeType } from '../types';

const getDateByDays = (days: number): string =>
  today(days).toISOString().split(/T/)[0];

const strToDate = (date: string): Date => {
  const nums = date.split('-');
  return new Date(+nums[0], +nums[1] - 1, +nums[2]);
};

interface Props {
  filters: {
    quick_date_range: string;
    start_date: string;
    end_date: string;
    [x: string]: AttributeType;
  };
  handleSearch: SetValues;
  setFilters: SetValues;
  values: SelectOptionProps[];
}

const QuickDateGroup: FunctionComponent<Props> = ({
  filters,
  handleSearch,
  setFilters,
  values,
}) => {
  const endDate = filters.end_date || getDateByDays(0);
  const startDate = filters.start_date || getDateByDays(-30);

  return (
    <ToolbarGroup variant="filter-group">
      <ToolbarInput
        categoryKey="quick_date_range"
        value={filters.quick_date_range}
        selectOptions={values}
        setValue={(value) => setFilters('quick_date_range', value)}
      />
      {filters.quick_date_range === 'custom' && (
        <Split hasGutter>
          <SplitItem>
            <ToolbarInput
              categoryKey="start_date"
              value={startDate}
              setValue={(e) => {
                setFilters('start_date', e);
                handleSearch('start_date', e);
              }}
              validators={[
                (date: Date) =>
                  date > strToDate(endDate) ? 'Must not be after end date' : '',
              ]}
            />
          </SplitItem>
          <SplitItem style={{ paddingTop: '6px' }}>to</SplitItem>
          <SplitItem>
            <ToolbarInput
              categoryKey="end_date"
              value={endDate}
              setValue={(e) => {
                setFilters('end_date', e);
                handleSearch('end_date', e);
              }}
              validators={[
                (date: Date) => {
                  if (date < strToDate(startDate))
                    return 'Must not be before start date';
                  if (date > today()) return 'Must not be after today';
                  return '';
                },
              ]}
            />
          </SplitItem>
        </Split>
      )}
    </ToolbarGroup>
  );
};

export default QuickDateGroup;
