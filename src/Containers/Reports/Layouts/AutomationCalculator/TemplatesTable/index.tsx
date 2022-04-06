import React, { FunctionComponent } from 'react';

import { Switch } from '@patternfly/react-core';
import {
  TableComposable,
  TableVariant,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import { Template } from './types';
import Row from './Row';
import { TableSortParams } from '../../Standard/types';

interface Props {
  data: Template[];
  variableRow: { key: string; value: string };
  setDataRunTime: (delta: number, id: number) => void;
  setEnabled: (id: number | undefined) => (enabled: boolean) => void;
  redirectToJobExplorer: (id: number) => void;
  getSortParams?: () => TableSortParams;
  readOnly: boolean;
}

const TopTemplates: FunctionComponent<Props> = ({
  data = [],
  variableRow,
  setDataRunTime = () => ({}),
  setEnabled = () => () => ({}),
  redirectToJobExplorer = () => ({}),
  getSortParams = () => ({}),
  readOnly = true,
}) => (
  <TableComposable aria-label="ROI Table" variant={TableVariant.compact}>
    <Thead>
      <Tr>
        <Th />
        <Th>Name</Th>
        {variableRow && <Th {...getSortParams()}>{variableRow.value}</Th>}
        <Th>Manual time</Th>
        <Th>Savings</Th>
        <Th>
          <Switch
            label="Show all"
            labelOff="Show all"
            isChecked={!data.find((d) => !d.enabled)}
            onChange={(checked) => setEnabled(undefined)(checked)}
            isDisabled={readOnly}
          />
        </Th>
      </Tr>
    </Thead>
    <Tbody>
      {data.map((template) => (
        <Row
          key={template.id}
          template={template}
          variableRow={variableRow}
          setDataRunTime={setDataRunTime}
          redirectToJobExplorer={redirectToJobExplorer}
          setEnabled={setEnabled(template.id)}
          readOnly={readOnly}
        />
      ))}
    </Tbody>
  </TableComposable>
);

export default TopTemplates;
