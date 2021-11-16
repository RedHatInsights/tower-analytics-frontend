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

interface Props {
  data: Template[];
  variableRow: { key: string; value: string };
  setDataRunTime: (delta: number, id: number) => void;
  setEnabled: (id: number | undefined) => (enabled: boolean) => void;
  redirectToJobExplorer: (id: number) => void;
}

const TopTemplates: FunctionComponent<Props> = ({
  data = [],
  variableRow,
  setDataRunTime = () => ({}),
  setEnabled = () => () => ({}),
  redirectToJobExplorer = () => ({}),
}) => (
  <>
    <p>Enter the time it takes to run the following templates manually.</p>
    <TableComposable aria-label="ROI Table" variant={TableVariant.compact}>
      <Thead>
        <Tr>
          <Th />
          <Th>Name</Th>
          <Th>{variableRow.value}</Th>
          <Th>Time</Th>
          <Th>Savings</Th>
          <Th>
            <Switch
              label="Show all"
              labelOff="Show all"
              isChecked={!data.find((d) => !d.enabled)}
              onChange={(checked) => setEnabled(undefined)(checked)}
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
          />
        ))}
      </Tbody>
    </TableComposable>
  </>
);

export default TopTemplates;
