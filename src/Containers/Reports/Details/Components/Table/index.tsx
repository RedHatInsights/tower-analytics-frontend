import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import {
  TableComposable,
  TableVariant,
  Tbody,
  Th,
  Thead,
  Tr as PFTr,
} from '@patternfly/react-table';

import TableRow from './TableRow';
import { LegendEntry, TableHeaders, TableSortParams } from '../types';

const Tr = styled(PFTr)`
  & td:first-child {
    width: 50px;
  }
`;

interface Props {
  headers: TableHeaders;
  legend: LegendEntry[];
  expandRows: boolean;
  getSortParams: (currKey: string) => TableSortParams;
}

const ReportTable: FunctionComponent<Props> = ({
  legend,
  headers,
  getSortParams,
  expandRows,
}) => (
  <TableComposable aria-label="Report Table" variant={TableVariant.compact}>
    <Thead>
      <Tr>
        {expandRows && <Th></Th>}
        {headers.map(({ key, value }) => (
          <Th key={key} {...getSortParams(key)}>
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
          expandRows={expandRows}
        />
      ))}
    </Tbody>
  </TableComposable>
);

export default ReportTable;
