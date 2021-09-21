/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, {FunctionComponent} from 'react';
import styled from 'styled-components';

import ChartBuilder, {
  ApiReturnType,
  functions,
} from 'react-json-chart-builder';

import {
  TableComposable,
  TableVariant,
  Th,
  Thead,
  Tr as PFTr,
} from '@patternfly/react-table';

import EmptyList from '../../../../Components/EmptyList';
import TableRow from "./TableRow";

const Tr = styled(PFTr)`
  & td:first-child {
    width: 50px;
  }
`;

const customFunctions = (data: ApiReturnType) => ({
  ...functions,
  axisFormat: {
    ...functions.axisFormat,
    formatAsYear: (tick: string) =>
      Intl.DateTimeFormat('en', { year: 'numeric' }).format(new Date(tick)),
    formatAsMonth: (tick: string) =>
      Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(tick)),
  },
  fetchFnc: () =>
    new Promise<ApiReturnType>((resolve) => {
      resolve(data);
    }),
});

const ReportTable: FunctionComponent<ReportGeneratorParams> = ({
  dataApi,
  chartSchema,
  attrPairs,
  getSortParams,
  expandRows
}) => {
  if (dataApi.isSuccess && dataApi.result.meta?.count === 0)
    return <EmptyList />;

  return (
    <>
      <ChartBuilder
        schema={chartSchema}
        functions={customFunctions(dataApi.result as unknown as ApiReturnType)}
      />
      <TableComposable aria-label="Report Table" variant={TableVariant.compact}>
        <Thead>
          <Tr>
            {expandRows && <Th></Th>}
            {attrPairs.map(({ key, value }) => (
              <Th key={key} {...getSortParams(key)}>
                {value}
              </Th>
            ))}
          </Tr>
        </Thead>
        <TableRow dataApi={dataApi} attrPairs={attrPairs} expandRows={expandRows} />
      </TableComposable>
    </>
  );
};

export default ReportTable;