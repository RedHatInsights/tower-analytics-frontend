import React, { FunctionComponent, useState } from 'react';
import {
  Button,
  InputGroup,
  InputGroupText,
  TextInput,
  Tooltip,
  InputGroupTextVariant,
  Switch,
  ButtonVariant,
} from '@patternfly/react-core';
import { Tr, Td } from '@patternfly/react-table';
import { global_success_color_200 as globalSuccessColor200 } from '@patternfly/react-tokens';

import currencyFormatter from '../../../../../Utilities/currencyFormatter';
import { Template } from './types';
import ExpandedRowContents from './ExplandedRowContents';

interface Props {
  template: Template;
  setDataRunTime: (delta: number, id: number) => void;
  setEnabled: (enabled: boolean) => void;
  redirectToJobExplorer: (id: number) => void;
}

const Row: FunctionComponent<Props> = ({
  template,
  setDataRunTime,
  setEnabled,
  redirectToJobExplorer,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <Tr>
        <Td
          expand={{
            rowIndex: template.id,
            isExpanded: isExpanded,
            onToggle: () => setIsExpanded(!isExpanded),
          }}
        />
        <Td>
          <Tooltip content={'List of jobs for this template for past 30 days'}>
            <Button
              onClick={() => redirectToJobExplorer(template.id)}
              variant={ButtonVariant.link}
            >
              {template.name}
            </Button>
          </Tooltip>
        </Td>
        <Td>
          <InputGroup>
            <TextInput
              style={{ maxWidth: '150px' }}
              type="number"
              aria-label="time run manually"
              value={template.avgRunTime / 60}
              onChange={(minutes) => setDataRunTime(+minutes * 60, template.id)}
            />
            <InputGroupText>min</InputGroupText>
            <InputGroupText variant={InputGroupTextVariant.plain}>
              x {template.successful_hosts_total} host runs
            </InputGroupText>
          </InputGroup>
        </Td>
        <Td style={{ color: globalSuccessColor200.value }}>
          {currencyFormatter(+template.delta)}
        </Td>
        <Td>
          <Switch
            label="Show"
            labelOff="Hide"
            isChecked={template.enabled}
            onChange={(checked) => setEnabled(checked)}
          />
        </Td>
      </Tr>
      <Tr isExpanded={isExpanded}>
        <ExpandedRowContents template={template} />
      </Tr>
    </>
  );
};
export default Row;
