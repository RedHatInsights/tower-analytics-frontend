import React, { FunctionComponent, useState } from 'react';
import {
  Button,
  InputGroup,
  InputGroupText,
  TextInput,
  Tooltip,
  Switch,
  ButtonVariant, InputGroupItem,
} from '@patternfly/react-core';
import { Tr, Td } from '@patternfly/react-table';
import { global_success_color_200 as globalSuccessColor200 } from '@patternfly/react-tokens';
import { global_disabled_color_200 as globalDisabledColor200 } from '@patternfly/react-tokens';
import { global_palette_red_200 } from '@patternfly/react-tokens';

import currencyFormatter from '../../../../../Utilities/currencyFormatter';
import timeFormatter from '../../../../../Utilities/timeFormatter';
import percentageFormatter from '../../../../../Utilities/percentageFormatter';
import { Template } from './types';
import ExpandedRowContents from './ExplandedRowContents';
import hoursFormatter from '../../../../../Utilities/hoursFormatter';

interface Props {
  template: Template;
  variableRow: { key: string; value: string };
  setDataRunTime: (delta: number, id: number) => void;
  setEnabled: (enabled: boolean) => void;
  navigateToJobExplorer: (id: number) => void;
  readOnly: boolean;
  isMoney: boolean;
}

const setLabeledValue = (key: string, value: number) => {
  let label;
  switch (key) {
    case 'elapsed':
      label = timeFormatter(value) + ' seconds';
      break;
    case 'successful_hosts_saved_hours':
      label = hoursFormatter(value);
      break;
    case 'template_automation_percentage':
      label = percentageFormatter(value) + '%';
      break;
    case 'successful_hosts_savings':
    case 'failed_hosts_costs':
    case 'monetary_gain':
      label = currencyFormatter(value);
      break;
    default:
      label = (+value).toFixed(2);
  }
  return label;
};

const setColumnColor = (key: string, template: Template) => {
  if (
    key === 'successful_hosts_savings' ||
    key === 'successful_hosts_saved_hours'
  ) {
    if (
      template.successful_hosts_savings > 0 &&
      template.successful_hosts_saved_hours > 0
    )
      return globalSuccessColor200.value;
    else return global_palette_red_200.value;
  }
};

const Row: FunctionComponent<Props> = ({
  template,
  variableRow,
  setDataRunTime,
  setEnabled,
  navigateToJobExplorer,
  readOnly = true,
  isMoney,
}) => {
  const [isExpanded, setIsExpanded] = useState(
    window.localStorage.getItem(template.id.toString()) === 'true' || false
  );
  const expandedRow = (value: boolean, id: number) => {
    window.localStorage.setItem(id.toString(), value ? 'true' : 'false');
    setIsExpanded(value);
  };
  return (
    <>
      <Tr>
        <Td
          expand={{
            rowIndex: template.id,
            isExpanded: isExpanded,
            onToggle: () => expandedRow(!isExpanded, template.id),
          }}
        />
        <Td>
          <Tooltip content={'List of jobs for this template for past 30 days'}>
            <Button
              onClick={() => navigateToJobExplorer(template.id)}
              variant={ButtonVariant.link}
              style={{ padding: '0px' }}
            >
              {template.name}
            </Button>
          </Tooltip>
        </Td>
        {variableRow && (
          <Td
            style={{
              color: setColumnColor(variableRow.key, template),
            }}
          >
            {setLabeledValue(variableRow.key, +template[variableRow.key])}
          </Td>
        )}
        <Td>
          <InputGroup>
            <InputGroupItem isFill ><TextInput
              autoFocus={
                window.localStorage.getItem('focused') ===
                'manual-time-' + template.id.toString()
              }
              id={'manual-time-' + template.id.toString()}
              data-cy={'manual-time'}
              style={{ maxWidth: '150px' }}
              type="number"
              aria-label="time run manually"
              defaultValue={template.avgRunTime / 60}
              onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                const minutes = +event.target.value;
                if (minutes <= 0 || isNaN(minutes)) {
                  event.target.value = '60';
                  setDataRunTime(+event.target.value * 60, template.id);
                } else {
                  setDataRunTime(minutes * 60, template.id);
                }
                window.localStorage.setItem('focused', '');
              }}
              onChange={() => {
                window.localStorage.setItem(
                  'focused',
                  'manual-time-' + template.id.toString()
                );
              }}
              isDisabled={readOnly}
            /></InputGroupItem>
            <InputGroupText>min</InputGroupText>
            <InputGroupText >
              x {template.successful_hosts_total} host runs
            </InputGroupText>
          </InputGroup>
        </Td>
        <Td
          data-cy={'savings'}
          style={{
            color: template.enabled
              ? template.successful_hosts_savings > 0 ||
                template.successful_hosts_saved_hours > 0
                ? globalSuccessColor200.value
                : global_palette_red_200.value
              : globalDisabledColor200.value,
          }}
        >
          {isMoney
            ? currencyFormatter(+template.successful_hosts_savings)
            : hoursFormatter(+template.successful_hosts_saved_hours)}
        </Td>
        <Td>
          <Switch
            label="Show"
            labelOff="Hide"
            isChecked={template.enabled}
            onChange={(_event, checked) => setEnabled(checked)}
            isDisabled={readOnly}
          />
        </Td>
      </Tr>
      <Tr isExpanded={isExpanded}>
        <ExpandedRowContents template={template} isMoney={isMoney} />
      </Tr>
    </>
  );
};
export default Row;
