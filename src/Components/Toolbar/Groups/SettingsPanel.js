import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip, Switch } from '@patternfly/react-core';
import {
  Card,
  CardTitle,
  CardBody,
  CardActions,
  CardHeader,
} from '@patternfly/react-core';
import { QuestionCircleIcon, TimesIcon } from '@patternfly/react-icons';

/* TODO: For future work: make settings more modular for different pages */
const SettingsPanel = ({
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
        onChange={(val) => {
          setFilters('only_root_workflows_and_standalone_jobs', val);
          handleSearch('only_root_workflows_and_standalone_jobs', val)
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

SettingsPanel.propTypes = {
  filters: PropTypes.object.isRequired,
  handleSearch: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  settingsExpanded: PropTypes.bool.isRequired,
  setSettingsExpanded: PropTypes.func.isRequired,
};

export default SettingsPanel;
