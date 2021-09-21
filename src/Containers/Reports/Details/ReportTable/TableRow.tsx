/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, {
  FunctionComponent,
  useState,
} from 'react';
import styled from 'styled-components';
import { global_disabled_color_300 } from '@patternfly/react-tokens';

import {
  Tbody,
  Td,
  Tr as PFTr,
} from '@patternfly/react-table';
import { formatTotalTime } from '../../../../Utilities/helpers';

import currencyFormatter from '../../../../Utilities/currencyFormatter';

import { ReportGeneratorParams } from '../Shared/types';
import TableExpandedRow from "./TableExpandedRow";

const Tr = styled(PFTr)`
  & td:first-child {
    width: 50px;
  }
`;

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
  if (timeFields.includes(key)) return formatTotalTime(item[key]);
  if (costFields.includes(key)) return currencyFormatter(+item[key]);
  // TODO: Remove no name when api does not return empty values
  // https://issues.redhat.com/browse/AA-691
  return `${item[key]}` || 'No name';
};

const getOthersStyle = (item: Record<string, string | number>, key: string) => {
  if (isOther(item, key)) {
    return {
      backgroundColor: global_disabled_color_300.value,
    };
  }
  return {};
};

const renderRow = (
  dataApi,
  attrPairs,
  expandRows
) => {
  const [expanded, setExpanded] = useState([]);
  const handleExpansion = (row) => {
    if (expanded.some((s) => s.id === row.id)) {
      setExpanded((prevState) => [...prevState.filter((i) => i.id !== row.id)]);
    } else {
      setExpanded((prevState) => [...prevState, row]);
    }
  };

  return (
    <Tbody>
      {dataApi.result.meta?.legend.map(
        (item: Record<string, string | number>) => (
          <>
            <Tr key={item.id} style={getOthersStyle(item, 'id')}>
              {attrPairs.map(({ key, value }, index) => (
                <>
                  {expandRows && index === 0 && (
                    <Td
                      expand={{
                        rowIndex: item.id.id,
                        isExpanded: expanded.some((s) => s.id === item.id),
                        onToggle: () => handleExpansion(item),
                      }}
                    />
                  )}
                  {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
                  <Td key={`${item.id}-${key}`}>{getText(item, key)}</Td>
                </>
              ))}
            </Tr>
            {expandRows && (
              <TableExpandedRow expanded={expanded} item={item} />
            )}
          </>
        )
      )}
    </Tbody>
  );
};

const TableRow: FunctionComponent<ReportGeneratorParams> = ({
  dataApi,
  attrPairs,
  expandRows
}) => {
  return renderRow(dataApi, attrPairs, expandRows);
};

export default TableRow;
