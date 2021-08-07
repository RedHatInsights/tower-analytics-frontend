import React, { FunctionComponent } from 'react';
import { Button, Tooltip, Switch } from '@patternfly/react-core';
import {
  Card,
  CardTitle,
  CardBody,
  CardActions,
  CardHeader,
} from '@patternfly/react-core';
import { QuestionCircleIcon, TimesIcon } from '@patternfly/react-icons';
import { SetValues, AttributeType } from '../types';

interface Props {
  filters: {
    only_root_workflows_and_standalone_jobs: boolean;
    [x: string]: AttributeType | boolean;
  };
  handleSearch: SetValues;
  setFilters: SetValues;
  settingsExpanded: boolean;
  setSettingsExpanded: (expanded: boolean) => void;
}

/* TODO: For future work: make settings more modular for different pages */
const SettingsPanel: FunctionComponent<Props> = ({
  filters,
  handleSearch,
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
        isChecked={filters.only_root_workflows_and_standalone_jobs}
        onChange={(value) => {
          setFilters('only_root_workflows_and_standalone_jobs', value);
          handleSearch('only_root_workflows_and_standalone_jobs', value);
        }}
      />
      <Tooltip
        position={'top'}
        content={
          <div>
            {' '}
            If enabled, nested workflows and jobs will not be included in the
            overall totals. Enable this option to filter out duplicate entries.
          </div>
        }
      >
        <QuestionCircleIcon />
      </Tooltip>
    </CardBody>
  </Card>
);

export default SettingsPanel;
