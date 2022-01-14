import React, { FunctionComponent } from 'react';

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

interface Props {
  headers: TableHeaders;
  legend: LegendEntry[];
  expandedRowName?: ExpandedTableRowName;
  getSortParams?: (currKey: string) => TableSortParams;
}

const ReportTable: FunctionComponent<Props> = ({
  legend,
  headers,
  getSortParams = () => ({}),
  expandedRowName,
}) => {
  headers.map(({ key, value }) => {});
  return (
    <TableComposable aria-label="Report Table" variant={TableVariant.compact}>
      <Thead>
        <Tr>
          {expandedRowName && <Th />}
          {headers.map(({ key, value }) => (
            <Th key={key} {...getSortParams(key)} data-testid={key}>
              {value}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {legend.map((entry) => (
          <TableRow
            key={entry.id}
            legendEntry={entry}
            headers={headers}
            expandedRowName={expandedRowName}
          />
        ))}
      </Tbody>
    </TableComposable>
  );
};
export default ReportTable;
