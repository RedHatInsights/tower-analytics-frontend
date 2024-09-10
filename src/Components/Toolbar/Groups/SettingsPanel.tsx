import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { CardHeader } from '@patternfly/react-core/dist/dynamic/components/Card';
import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardTitle } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { Popover } from '@patternfly/react-core/dist/dynamic/components/Popover';
import { Switch } from '@patternfly/react-core/dist/dynamic/components/Switch';
import PFOutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/outlined-question-circle-icon';
import TimesIcon from '@patternfly/react-icons/dist/dynamic/icons/times-icon';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { AttributeType, SetValues } from '../types';

const OutlinedQuestionCircleIcon = styled(PFOutlinedQuestionCircleIcon)`
  color: #151515;
`;

const PopoverButton = styled(Button)`
  vertical-align: middle;
`;

interface Props {
  filters: Record<string, AttributeType>;
  setFilters: SetValues;
  settingsExpanded: boolean;
  setSettingsExpanded: (expanded: boolean) => void;
  id?: string;
  label?: string;
  labelOff?: string;
  isChecked?: AttributeType;
  onChange?: (
    event: React.FormEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
  ariaLabel?: string;
  bodyContent?: string;
}

const SettingsPanel: FunctionComponent<Props> = ({
  settingsExpanded,
  setSettingsExpanded,
  id,
  label,
  labelOff,
  isChecked,
  onChange,
  ariaLabel,
  bodyContent,
}) => (
  <Card isFlat style={{ backgroundColor: '#EEEEEE' }}>
    <CardHeader
      actions={{
        actions: (
          <>
            <Button
              variant='plain'
              onClick={() => setSettingsExpanded(!settingsExpanded)}
            >
              <TimesIcon />
            </Button>
          </>
        ),
        hasNoOffset: false,
        className: undefined,
      }}
    >
      <CardTitle>Settings</CardTitle>
    </CardHeader>
    <CardBody>
      <Switch
        id={id}
        label={label}
        labelOff={labelOff}
        isChecked={!!isChecked}
        onChange={onChange}
      />
      <PopoverButton variant='plain'>
        <Popover
          aria-label={ariaLabel}
          position={'top'}
          bodyContent={<div> {bodyContent} </div>}
        >
          <OutlinedQuestionCircleIcon />
        </Popover>
      </PopoverButton>
    </CardBody>
  </Card>
);

export default SettingsPanel;
