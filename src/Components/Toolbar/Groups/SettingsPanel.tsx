import React, { FunctionComponent } from 'react';
import { Button, Switch, Popover } from '@patternfly/react-core';
import {
  Card,
  CardTitle,
  CardBody,
  CardActions,
  CardHeader,
} from '@patternfly/react-core';
import {
  OutlinedQuestionCircleIcon as PFOutlinedQuestionCircleIcon,
  TimesIcon,
} from '@patternfly/react-icons';
import { SetValues, AttributeType } from '../types';
import styled from 'styled-components';

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
}

/* TODO: For future work: make settings more modular for different pages */
const SettingsPanel: FunctionComponent<Props> = ({
  filters,
  setFilters,
  settingsExpanded,
  setSettingsExpanded,
}) => (
  <Card isFlat style={{ backgroundColor: '#EEEEEE' }}>
    <CardHeader>
      <CardActions>
        <Button
          variant="plain"
          onClick={() => setSettingsExpanded(!settingsExpanded)}
        >
          <TimesIcon />
        </Button>
      </CardActions>
      <CardTitle>Settings</CardTitle>
    </CardHeader>
    <CardBody>
      <Switch
        id="showRootWorkflowJobs"
        label="Ignore nested workflows and jobs"
        labelOff="Ignore nested workflows and jobs"
        isChecked={!!filters.only_root_workflows_and_standalone_jobs}
        onChange={(value) =>
          setFilters('only_root_workflows_and_standalone_jobs', value)
        }
      />
      <PopoverButton variant="plain">
        <Popover
          aria-label="ignore nested workflow popover"
          position={'top'}
          bodyContent={
            <div>
              If enabled, nested workflows and jobs will not be included in the
              overall totals. Enable this option to filter out duplicate
              entries.
            </div>
          }
        >
          <OutlinedQuestionCircleIcon />
        </Popover>
      </PopoverButton>
    </CardBody>
  </Card>
);

export default SettingsPanel;
