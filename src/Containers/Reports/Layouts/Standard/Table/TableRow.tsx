import React, { FunctionComponent, useState } from 'react';
import { global_disabled_color_300 } from '@patternfly/react-tokens';

import { Td, Tr } from '@patternfly/react-table';
import { formatTotalTime } from '../../../../../Utilities/helpers';

import currencyFormatter from '../../../../../Utilities/currencyFormatter';

import { LegendEntry, TableHeaders } from '../types';
import { ExpandedTableRowName, getExpandedRowComponent } from '../Components';

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
  expandedRowName?: ExpandedTableRowName;
}

const TableRow: FunctionComponent<Params> = ({
  legendEntry,
  headers,
  expandedRowName,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderExpandedRow = () => {
    const Component = getExpandedRowComponent(expandedRowName);

    return Component ? (
      <Component item={legendEntry} isExpanded={isExpanded} />
    ) : null;
  };

  return (
    <>
      <Tr style={getOthersStyle(legendEntry, 'id')}>
        {expandedRowName && (
          <Td
            expand={{
              rowIndex: +legendEntry.id,
              isExpanded,
              onToggle: () => setIsExpanded(!isExpanded),
            }}
          />
        )}
        {headers.map(({ key }) => (
          <Td key={`${legendEntry.id}-${key}`}>{getText(legendEntry, key)}</Td>
        ))}
      </Tr>
      {renderExpandedRow()}
    </>
  );
};

export default TableRow;
