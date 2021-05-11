import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { Paths } from '../../paths';
import { stringify } from 'query-string';

import { useHistory } from 'react-router-dom';

import {
  Card,
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

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import { formatDateTime } from '../../Utilities/helpers';
import RoutedTabs from '../../Components/RoutedTabs';

const TopCard = styled(Card)`
  min-height: 500px;
`;

const DetailsTab = ({ tabsArray, plans }) => {
  let history = useHistory();
  const {
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

  return (
    <React.Fragment>
      {plans && (
        <TopCard>
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
                    {tasks.map((task) => (
                      <ListItem key={task.id}>{task.task}</ListItem>
                    ))}
                  </List>
                </TextContent>
              </>
            )}
          </div>
        </TopCard>
      )}
    </React.Fragment>
  );
};

DetailsTab.propTypes = {
  plans: PropTypes.array,
  tabsArray: PropTypes.array,
};

export default DetailsTab;
