import React, { FunctionComponent, useState } from 'react';

import {
  TableComposable,
  TableVariant,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';

import TableRow from './TableRow';
import { LegendEntry, TableHeaders, TableSortParams } from '../types';
import { ExpandedTableRowName } from '../Components';
import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core';
import { useQueryParams } from '../../../../../QueryParams';
import { reportDefaultParams } from '../../../../../Utilities/constants';

interface Props {
  headers: TableHeaders;
  legend: LegendEntry[];
  expandedRowName?: ExpandedTableRowName;
  clickableLinking?: boolean;
  showKebab?: boolean;
  getSortParams?: (currKey: string) => TableSortParams;
}

const ReportTable: FunctionComponent<Props> = ({
  legend,
  headers,
  getSortParams = () => ({}),
  expandedRowName,
  clickableLinking,
  showKebab,
}) => {
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const defaultParams = reportDefaultParams('host_anomalies_scatter');
  const { setFromToolbar } = useQueryParams(defaultParams);

  const kebabDropdownItems = [
    <DropdownItem
      key="showAll"
      component="button"
      onClick={() => setFromToolbar('anomaly', undefined)}
    >
      Display all host rows
    </DropdownItem>,
    <DropdownItem
      key="showAnomalousHosts"
      component="button"
      onClick={() => setFromToolbar('anomaly', true)}
    >
      Display only slow host rows
    </DropdownItem>,
    <DropdownItem
      key="showNonAnomalousHosts"
      component="button"
      onClick={() => setFromToolbar('anomaly', false)}
    >
      Display only non-slow host rows
    </DropdownItem>,
  ];

  return (
    <TableComposable aria-label="Report Table" variant={TableVariant.compact}>
      <Thead>
        <Tr>
          {expandedRowName && <Th />}
          {headers.map(({ key, value }) =>
            showKebab && key === 'anomaly' ? (
              <Th
                key={key}
                style={{
                  overflow: 'visible',
                  zIndex: 1,
                }}
              >
                Slow
                <Dropdown
                  onSelect={() => {
                    setIsKebabOpen(true);
                  }}
                  toggle={
                    <KebabToggle
                      style={{ paddingBottom: '0px' }}
                      id="table-kebab"
                      onToggle={() => setIsKebabOpen(!isKebabOpen)}
                    />
                  }
                  isOpen={isKebabOpen}
                  isPlain
                  dropdownItems={kebabDropdownItems}
                  position={'right'}
                />
              </Th>
            ) : (key === 'total_elapsed_per_org' &&
                typeof legend[0].total_elapsed_per_org == 'undefined') ||
              (key === 'total_job_count_per_org' &&
                typeof legend[0].total_job_count_per_org == 'undefined') ||
              (key === 'total_host_count_per_org' &&
                typeof legend[0].total_host_count_per_org == 'undefined') ||
              (key === 'total_task_count_per_org' &&
                typeof legend[0].total_task_count_per_org ==
                  'undefined') ? null : (
              <Th key={key} {...getSortParams(key)} data-cy={key}>
                {value}
              </Th>
            )
          )}
        </Tr>
      </Thead>
      <Tbody>
        {legend.map((entry) => (
          <TableRow
            key={entry.id}
            legendEntry={entry}
            headers={headers}
            expandedRowName={expandedRowName}
            clickableLinking={clickableLinking}
          />
        ))}
      </Tbody>
    </TableComposable>
  );
};
export default ReportTable;
