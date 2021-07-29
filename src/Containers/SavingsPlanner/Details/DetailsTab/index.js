import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { Paths } from '../../../../paths';
import { stringify } from 'query-string';

import { useHistory, useLocation } from 'react-router-dom';

import { Button } from '@patternfly/react-core';

import {
  CardBody as PFCardBody,
  CardFooter,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Divider as PFDivider,
  Label,
  List,
  ListItem,
} from '@patternfly/react-core';
import CardActionsRow from '../../../../Components/CardActionsRow';
import { deletePlan } from '../../../../Api/';
import useRequest, {
  useDismissableError,
} from '../../../../Utilities/useRequest';
import DeleteButton from '../../../../Components/DeleteButton/DeleteButton';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { formatDateTime } from '../../../../Utilities/helpers';
import RoutedTabs from '../../../../Components/RoutedTabs';
import AlertModal from '../../../../Components/AlertModal/AlertModal';
import ErrorDetail from '../../../../Components/ErrorDetail/ErrorDetail';
import JobStatus from '../../../../Components/JobStatus';

const CardBody = styled(PFCardBody)`
  min-height: 500px;
  padding: 0;
  padding-bottom: 20px;

  &:first-child {
    padding-top: 0;
  }
`;

const Divider = styled(PFDivider)`
  padding-top: 24px;
`;

const DetailsTab = ({ tabsArray, plans, canWrite, options }) => {
  const { pathname } = useLocation();
  const history = useHistory();
  const {
    id,
    automation_status,
    category,
    description,
    frequency_period,
    hosts,
    manual_time,
    modified,
    name,
    tasks,
    template_details,
    template_id,
  } = plans[0];

  const redirectToJobExplorer = (templateId) => {
    const { jobExplorer } = Paths;
    const initialQueryParams = {
      'job-explorer.quick_date_range': 'last_30_days',
      'job-explorer.status': ['failed', 'successful'],
      'job-explorer.template_id': templateId,
    };
    const search = stringify(initialQueryParams, { arrayFormat: 'bracket' });
    history.push({
      pathname: jobExplorer,
      search,
    });
  };

  const showTemplate = (template_details) => {
    if (!template_details.id) {
      return;
    }

    return (
      <a onClick={() => redirectToJobExplorer(template_details.id)}>
        {template_details.name}
      </a>
    );
  };

  const renderOptionsBasedValue = (key, val) => {
    const fromOptionsValue = (options[key] || []).find(
      ({ key: apiValue }) => apiValue === val
    );
    return (fromOptionsValue || {}).value;
  };

  const labelsAndValues = {
    Name: name || undefined,
    'Automation type': category
      ? renderOptionsBasedValue('category', category)
      : undefined,
    Description: description || undefined,
    'Manual time': manual_time
      ? renderOptionsBasedValue('manual_time', manual_time)
      : undefined,
    'Run on hosts': hosts || undefined,
    Frequency: frequency_period
      ? renderOptionsBasedValue('frequency_period', frequency_period)
      : undefined,
    Template: template_id ? showTemplate(template_details) : undefined,
    'Last job status':
      automation_status.status && automation_status.status !== 'None' ? (
        <JobStatus status={automation_status.status} />
      ) : (
        <Label variant="outline" color="red" icon={<ExclamationCircleIcon />}>
          Not Running
        </Label>
      ),
    'Last updated': modified ? (
      <span>{formatDateTime(modified)}</span>
    ) : undefined,
  };

  const { request: deletePlans, error: deleteError } = useRequest(
    useCallback(async () => {
      await deletePlan({ id });
      history.push(`/savings-planner`);
    }, [id, history])
  );

  const { error, dismissError } = useDismissableError(deleteError);

  return (
    <>
      {plans && (
        <>
          <CardBody>
            <RoutedTabs tabsArray={tabsArray} />
            <div style={{ padding: '1rem' }}>
              <DescriptionList isHorizontal columnModifier={{ lg: '3Col' }}>
                {Object.keys(labelsAndValues).map(
                  (key, i) =>
                    labelsAndValues[key] !== undefined && (
                      <DescriptionListGroup key={i}>
                        <DescriptionListTerm>{key}</DescriptionListTerm>
                        <DescriptionListDescription>
                          {labelsAndValues[key]}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    )
                )}
              </DescriptionList>
              {tasks.length > 0 && (
                <DescriptionList>
                  <Divider component="div" />
                  <DescriptionListGroup key={tasks}>
                    <DescriptionListTerm>Tasks</DescriptionListTerm>
                    <DescriptionListDescription>
                      <List component="ol" type="1">
                        {tasks.map(({ id, task }) => (
                          <ListItem key={id}>{task}</ListItem>
                        ))}
                      </List>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              )}
            </div>
          </CardBody>
          {canWrite && (
            <CardFooter>
              <CardActionsRow>
                <Button
                  key="edit-plan-button"
                  variant="primary"
                  aria-label="Edit plan"
                  onClick={() => {
                    history.push({
                      pathname: `${pathname.split('/details')[0]}/edit`,
                    });
                  }}
                >
                  Edit
                </Button>
                <DeleteButton
                  key={'delete-plan-button'}
                  name={name}
                  modalTitle={'Delete Plan'}
                  onConfirm={deletePlans}
                >
                  {'Delete'}
                </DeleteButton>
              </CardActionsRow>
              {error && (
                <AlertModal
                  isOpen={!!error}
                  onClose={dismissError}
                  title={'Error'}
                  variant="error"
                >
                  <ErrorDetail error={error.detail} />
                </AlertModal>
              )}
            </CardFooter>
          )}
        </>
      )}
    </>
  );
};

DetailsTab.propTypes = {
  plans: PropTypes.array,
  tabsArray: PropTypes.array,
  canWrite: PropTypes.bool.isRequired,
  options: PropTypes.object.isRequired,
};

export default DetailsTab;
