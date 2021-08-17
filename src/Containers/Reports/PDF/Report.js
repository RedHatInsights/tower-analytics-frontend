import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ChartBuilder, { functions } from 'react-json-chart-builder';

import { Card, CardBody as PFCardBody } from '@patternfly/react-core';
import {
  TableComposable,
  TableVariant,
  Tbody,
  Td,
  Th,
  Thead,
  Tr as PFTr,
} from '@patternfly/react-table';

import { getText, getOthersStyle } from './helpers';

const CardBody = styled(PFCardBody)`
  & .pf-c-toolbar,
  & .pf-c-toolbar__content {
    padding: 0;
  }
`;

const Tr = styled(PFTr)`
  & td:first-child {
    width: 50px;
  }
`;

const customFunctions = (data) => ({
  ...functions,
  fetchFnc: () => data,
});

const Report = ({ tableHeaders, data, schema }) => (
  <Card>
    <CardBody>
      <ChartBuilder schema={schema} functions={customFunctions(data)} />
      <TableComposable aria-label="Report Table" variant={TableVariant.compact}>
        <Thead>
          <Tr>
            {tableHeaders.map(({ key, value }) => (
              <Th key={key}>{value}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.meta?.legend.map((item) => (
            <Tr key={item.id} style={getOthersStyle(item, 'id')}>
              {tableHeaders.map(({ key }) => (
                <Td key={`${item.id}-${key}`}>{getText(item, key)}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </TableComposable>
    </CardBody>
  </Card>
);

Report.propTypes = {
  tableHeaders: PropTypes.arrayOf(
    PropTypes.exact({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  data: PropTypes.shape({
    meta: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
  }).isRequired,
  schema: PropTypes.array.isRequired,
};

export default Report;
