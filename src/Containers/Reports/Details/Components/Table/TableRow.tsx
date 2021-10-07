import React, { FunctionComponent, useState } from 'react';
import { global_disabled_color_300 } from '@patternfly/react-tokens';

import { Td, Tr } from '@patternfly/react-table';
import { formatTotalTime } from '../../../../../Utilities/helpers';

import currencyFormatter from '../../../../../Utilities/currencyFormatter';

import TableExpandedRow from './TableExpandedRow';
import { LegendEntry, TableHeaders } from '../types';

const timeFields: string[] = ['elapsed'];
const costFields: string[] = [];

const isOther = (item: Record<string, string | number>, key: string) =>
  key === 'id' && item[key] === -1;

const isNoName = (item: Record<string, string | number>, key: string) =>
  key === 'id' && item[key] === -2;

const getText = (
  item: Record<string, string | number>,
  key: string
): string => {
  if (isNoName(item, key)) return '-';
  if (isOther(item, key)) return '-';
  if (timeFields.includes(key)) return formatTotalTime(+item[key]);
  if (costFields.includes(key)) return currencyFormatter(+item[key]);
  return `${item[key]}`;
};

const getOthersStyle = (item: Record<string, string | number>, key: string) => {
  if (isOther(item, key)) {
    return {
      backgroundColor: global_disabled_color_300.value,
    };
  }
  return {};
};

interface Params {
  legendEntry: LegendEntry;
  headers: TableHeaders;
  expandRows: boolean;
}

const TableRow: FunctionComponent<Params> = ({
  legendEntry,
  headers,
  expandRows,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <Tr style={getOthersStyle(legendEntry, 'id')}>
        {headers.map(({ key }, index) => (
          <>
            {expandRows && index === 0 && (
              <Td
                expand={{
                  rowIndex: +legendEntry.id,
                  isExpanded,
                  onToggle: () => setIsExpanded(!isExpanded),
                }}
              />
            )}
            <Td key={`${legendEntry.id}-${key}`}>
              {getText(legendEntry, key)}
            </Td>
          </>
        ))}
      </Tr>
      {expandRows && (
        <TableExpandedRow isExpanded={isExpanded} item={legendEntry} />
      )}
    </>
  );
};

export default TableRow;
