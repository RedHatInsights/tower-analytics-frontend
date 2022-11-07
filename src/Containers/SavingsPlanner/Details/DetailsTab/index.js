import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

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
  Tooltip,
  TooltipPosition,
} from '@patternfly/react-core';
import CardActionsRow from '../../../../Components/CardActionsRow';
import { deletePlan, readPlanOptions } from '../../../../Api/';
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

import { useRedirect, DEFAULT_NAMESPACE } from '../../../../QueryParams/';
import { jobExplorer } from '../../../../Utilities/constants';
import { Paths } from '../../../../paths';

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

const DetailsTab = ({ tabsArray, plan, canWrite }) => {
  const { pathname } = useLocation();
  const redirect = useRedirect();
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
  } = plan;

  const {
    result: options,
    isSuccess: optionsSuccess,
    request: fetchOptions,
  } = useRequest(readPlanOptions, {});

  useEffect(() => {
    fetchOptions({});
  }, []);

  const redirectToJobExplorer = (templateId) => {
    const initialQueryParams = {
      [DEFAULT_NAMESPACE]: {
        ...jobExplorer.defaultParams,
        quick_date_range: 'last_30_days',
        status: ['failed', 'successful'],
        template_id: [templateId],
      },
    };

    redirect(Paths.jobExplorer, initialQueryParams);
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

  const renderOptionsBasedValue = (name, val) => {
    // Return if no options yet or no key in the options is found.
    if (!optionsSuccess || !options[name]) return '';

    // Search for the key and return the value if exists.
    const fromOptionsValue = options[name].find(({ key }) => key === val);
    return fromOptionsValue?.value ?? '';
  };

  const jobStatusLabel = (item, index) => {
    return item !== 'None' ? (
      <JobStatus key={index} status={item} />
    ) : (
      <Label
        key={index}
        variant="outline"
        color="red"
        icon={<ExclamationCircleIcon />}
        style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}
      >
        Not Running
      </Label>
    );
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
    'Last job status': Array.isArray(automation_status.status)
      ? automation_status.status.map((item, index) =>
          jobStatusLabel(item, index)
        )
      : jobStatusLabel(automation_status.status),
    'Last updated': modified ? (
      <span>{formatDateTime(modified)}</span>
    ) : undefined,
  };

  const { request: deletePlans, error: deleteError } = useRequest(
    async (props) => {
      await deletePlan(props);
      redirect(Paths.savingsPlanner);
    }
  );

  const { error, dismissError } = useDismissableError(deleteError);

  return (
    <>
      {plan && (
        <>
          <CardBody>
            <RoutedTabs tabsArray={tabsArray} />
            <div style={{ padding: '1rem' }}>
              <DescriptionList isHorizontal columnModifier={{ lg: '3Col' }}>
                {Object.keys(labelsAndValues).map(
                  (key, i) =>
                    labelsAndValues[key] !== undefined && (
                      <DescriptionListGroup key={i}>
                        {key === 'Last job status' ? (
                          <Tooltip
                            key={'last_job_status_tooltip'}
                            position={TooltipPosition.top}
                            content={
                              automation_status.last_known_day
                                ? `Status last reported on: ${automation_status.last_known_day}`
                                : automation_status.last_known_month
                                ? `Status last reported on: ${automation_status.last_known_month}`
                                : automation_status.last_known_year
                                ? `Status last reported on: ${automation_status.last_known_year}`
                                : `Status last reported on: ${automation_status.last_known_date}`
                            }
                          >
                            <DescriptionListTerm>{key}</DescriptionListTerm>
                          </Tooltip>
                        ) : (
                          <DescriptionListTerm>{key}</DescriptionListTerm>
                        )}
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
                    redirect(`${pathname.split('/details')[0]}/edit`);
                  }}
                >
                  Edit
                </Button>
                <DeleteButton
                  key={'delete-plan-button'}
                  name={name}
                  modalTitle={'Delete Plan'}
                  onConfirm={() => deletePlans(id)}
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
  plan: PropTypes.object,
  tabsArray: PropTypes.array,
  canWrite: PropTypes.bool.isRequired,
};

export default DetailsTab;
