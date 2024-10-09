import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardFooter } from '@patternfly/react-core/dist/dynamic/components/Card';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core/dist/dynamic/components/DescriptionList';
import { Divider } from '@patternfly/react-core/dist/dynamic/components/Divider';
import { Label } from '@patternfly/react-core/dist/dynamic/components/Label';
import {
  List,
  ListItem,
} from '@patternfly/react-core/dist/dynamic/components/List';
import {
  Tooltip,
  TooltipPosition,
} from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/exclamation-circle-icon';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { deletePlan, readPlanOptions } from '../../../../Api/';
import AlertModal from '../../../../Components/AlertModal/AlertModal';
import CardActionsRow from '../../../../Components/CardActionsRow';
import DeleteButton from '../../../../Components/DeleteButton/DeleteButton';
import ErrorDetail from '../../../../Components/ErrorDetail/ErrorDetail';
import JobStatus from '../../../../Components/JobStatus';
import RoutedTabs from '../../../../Components/RoutedTabs';
import { DEFAULT_NAMESPACE, createUrl } from '../../../../QueryParams/';
import { jobExplorer } from '../../../../Utilities/constants';
import { formatDateTime } from '../../../../Utilities/helpers';
import useRequest, {
  useDismissableError,
} from '../../../../Utilities/useRequest';
import { Paths } from '../../../../paths';

const DCardBody = styled(CardBody)`
  min-height: 500px;
  padding: 0;
  padding-bottom: 20px;

  &:first-child {
    padding-top: 0;
  }
`;

const DDivider = styled(Divider)`
  padding-top: 24px;
`;

const DetailsTab = ({ tabsArray, plan, canWrite }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
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

  const navigateToJobExplorer = (templateId) => {
    const initialQueryParams = {
      [DEFAULT_NAMESPACE]: {
        ...jobExplorer.defaultParams,
        quick_date_range: 'last_30_days',
        status: ['failed', 'successful'],
        template_id: [templateId],
      },
    };

    navigate(
      createUrl(Paths.jobExplorer.replace('/', ''), true, initialQueryParams)
    );
  };

  const showTemplate = (template_details) => {
    if (!template_details.id) {
      return;
    }

    return (
      <a onClick={() => navigateToJobExplorer(template_details.id)}>
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
        variant='outline'
        color='red'
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
      navigate(createUrl(Paths.savingsPlanner, true));
    }
  );

  const { error, dismissError } = useDismissableError(deleteError);

  return (
    <>
      {plan && (
        <>
          <DCardBody>
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
                  <DDivider component='div' />
                  <DescriptionListGroup key={tasks}>
                    <DescriptionListTerm>Tasks</DescriptionListTerm>
                    <DescriptionListDescription>
                      <List component='ol' type='1'>
                        {tasks.map(({ id, task }) => (
                          <ListItem key={id}>{task}</ListItem>
                        ))}
                      </List>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              )}
            </div>
          </DCardBody>
          {canWrite && (
            <CardFooter>
              <CardActionsRow>
                <Button
                  key='edit-plan-button'
                  variant='primary'
                  aria-label='Edit plan'
                  onClick={() => {
                    navigate(
                      createUrl(`${pathname.split('/details')[0]}/edit`)
                    );
                  }}
                >
                  Edit
                </Button>{' '}
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
                  variant='error'
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
