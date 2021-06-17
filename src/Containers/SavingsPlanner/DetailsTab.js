import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { Paths } from '../../paths';
import { stringify } from 'query-string';

import { useHistory } from 'react-router-dom';

import { Button } from '@patternfly/react-core';

import {
  CardBody as PFCardBody,
  CardFooter,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Divider,
  Label,
  TextContent,
  List,
  ListItem,
} from '@patternfly/react-core';
import CardActionsRow from '../../Components/CardActionsRow';
import {
  relatedResourceDeleteRequests,
  getRelatedResourceDeleteCounts,
} from '../../Utilities/getRelatedResourceDeleteDetails';
import { deletePlan, readPlan } from '../../Api';
import useRequest, { useDismissableError } from '../../Utilities/useRequest';
import DeleteButton from '../../Components/DeleteButton/DeleteButton';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import { formatDateTime } from '../../Utilities/helpers';
import RoutedTabs from '../../Components/RoutedTabs';
import AlertModal from '../../Components/AlertModal/AlertModal';
import ErrorDetail from '../../Components/ErrorDetail/ErrorDetail';

const CardBody = styled(PFCardBody)`
  min-height: 500px;
  padding: 0;
  padding-bottom: 20px;

  &:first-child {
    padding-top: 0;
  }
`;

const DetailsTab = ({ tabsArray, plans, canWrite }) => {
  let history = useHistory();
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
      quick_date_range: 'last_30_days',
      status: ['failed', 'successful'],
      template_id: [templateId],
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

  const labelsAndValues = {
    Name: name || undefined,
    'Automation Type': category || undefined,
    Description: description || undefined,
    'Manual Time': manual_time || undefined,
    'Run on hosts': hosts || undefined,
    Frequency: frequency_period || undefined,
    Template: template_id ? showTemplate(template_details) : undefined,
    'Automation status':
      automation_status.status === 'successful' ? (
        <Label variant="outline" color="green" icon={<CheckCircleIcon />}>
          Running
        </Label>
      ) : (
        <Label variant="outline" color="red" icon={<ExclamationCircleIcon />}>
          Not Running
        </Label>
      ),
    'Last updated': modified ? <em>{formatDateTime(modified)}</em> : undefined,
  };

  const { request: deletePlans, error: deleteError } = useRequest(
    useCallback(async () => {
      await deletePlan({ params: { id: id } });
      history.push(`/savings-planner`);
    }, [id, history])
  );

  const {
    result: { isDeleteDisabled },
    error: deleteDetailsError,
    request: fetchDeleteDetails,
  } = useRequest(
    useCallback(async () => {
      const { results: deleteDetails, error } =
        await getRelatedResourceDeleteCounts(
          relatedResourceDeleteRequests.savingsPlan(plans[0], readPlan)
        );
      if (error) {
        throw new Error(error);
      }
      if (deleteDetails) {
        return { isDeleteDisabled: true };
      }
      return { isDeleteDisabled: false };
    }, [plans[0]]),
    { isDeleteDisabled: false }
  );

  useEffect(() => {
    fetchDeleteDetails();
  }, [fetchDeleteDetails]);
  const { error, dismissError } = useDismissableError(
    deleteError || deleteDetailsError
  );

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
                <>
                  <Divider style={{ padding: '1rem' }} component="div" />
                  <DescriptionListTerm>Tasks</DescriptionListTerm>
                  <TextContent>
                    <List component="ol" type="1">
                      {tasks.map(({ id, task }) => (
                        <ListItem key={id}>{task}</ListItem>
                      ))}
                    </List>
                  </TextContent>
                </>
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
                      pathname: `${Paths.savingsPlan}${id}/edit`,
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
                  disabledTooltip={
                    isDeleteDisabled && 'This plan cannot be deleted'
                  }
                >
                  {'Delete'}
                </DeleteButton>
              </CardActionsRow>
              {error && (
                <AlertModal
                  isOpen={error}
                  onClose={dismissError}
                  title={'Error'}
                  variant="error"
                >
                  <ErrorDetail error={error} />
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
};

export default DetailsTab;
