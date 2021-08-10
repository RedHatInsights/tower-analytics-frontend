import React, { useState } from 'react';
import styled from 'styled-components';
import { stringify } from 'query-string';
import { useHistory, Link, useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  Card,
  CardHeader,
  CardHeaderMain,
  CardActions,
  CardTitle as PFCardTitle,
  CardBody,
  CardFooter,
  Checkbox as PFCheckbox,
  Dropdown,
  DropdownItem,
  KebabToggle,
  Label,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

import { Paths } from '../../../../paths';

import currencyFormatter from '../../../../Utilities/currencyFormatter';
import { formatDateTime } from '../../../../Utilities/helpers';

import JobStatus from '../../../../Components/JobStatus';

const CardTitle = styled(PFCardTitle)`
  word-break: break-word;
`;

const CardLabel = styled.span`
  margin-right: 5px;
  font-weight: bold;
`;

const Small = styled.small`
  display: block;
  margin-bottom: 10px;
  color: #6a6e73;
`;

const Checkbox = styled(PFCheckbox)`
  &.pf-c-check.pf-m-standalone {
    margin-top: -3px;
  }
`;

const CardDetail = styled.div`
  display: flex;
  min-height: 30px;
  align-items: center;
`;

const ListItem = ({
  isSuccess,
  plan,
  selected = [],
  handleSelect = () => {},
  canWrite,
  options,
}) => {
  const {
    id,
    automation_status,
    category,
    description,
    frequency_period,
    modified,
    name,
    template_details,
    projections,
  } = plan;

  const projectedSavings =
    projections?.monetary_stats?.cumulative_net_benefits?.year3;

  const [isCardKebabOpen, setIsCardKebabOpen] = useState(false);
  const match = useRouteMatch();
  let history = useHistory();

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

  const renderTemplateLink = (template) => {
    return template && isSuccess ? (
      <a onClick={() => redirectToJobExplorer(template.id)}>{template.name}</a>
    ) : null;
  };

  const renderOptionsBasedValue = (key, val) => {
    return options[key].find(({ key: apiValue }) => apiValue === val).value;
  };

  const kebabDropDownItems = [
    <React.Fragment key={id}>
      <DropdownItem
        key="edit"
        onClick={() => history.push(`${match.url}/${id}/edit`)}
        position="right"
      >
        Edit
      </DropdownItem>
      <DropdownItem
        key="link"
        onClick={() => history.push(`${match.url}/${id}/edit#tasks`)}
        position="right"
      >
        Manage tasks
      </DropdownItem>
      <DropdownItem
        key="link"
        onClick={() => history.push(`${match.url}/${id}/edit#link_template`)}
        position="right"
      >
        Link template
      </DropdownItem>
    </React.Fragment>,
  ];

  return (
    <Card>
      <CardHeader>
        <CardHeaderMain>
          <CardTitle>
            <Link to={`${match.url}/${id}`}>{name}</Link>
          </CardTitle>
        </CardHeaderMain>
        {canWrite && (
          <CardActions>
            <Dropdown
              onSelect={() => {}}
              toggle={
                <KebabToggle
                  onToggle={() => setIsCardKebabOpen(!isCardKebabOpen)}
                />
              }
              isOpen={isCardKebabOpen}
              isPlain
              dropdownItems={kebabDropDownItems}
              position={'right'}
            />
            <Checkbox
              onChange={() => handleSelect(plan)}
              isChecked={selected.some((row) => row.id === plan.id)}
              aria-label="card checkbox"
              id="check-1"
              name="check1"
            />
          </CardActions>
        )}
      </CardHeader>
      <CardBody>
        {description ? <Small>{description}</Small> : null}
        <CardDetail>
          <CardLabel>Frequency</CardLabel>{' '}
          {frequency_period ? (
            renderOptionsBasedValue('frequency_period', frequency_period)
          ) : (
            <span>None</span>
          )}
        </CardDetail>
        <CardDetail>
          <CardLabel>Template</CardLabel>{' '}
          {Object.keys(template_details || {}).length !== 0 ? (
            renderTemplateLink(template_details)
          ) : (
            <span>
              None -{' '}
              <a
                onClick={() =>
                  history.push(`${match.url}/${id}/edit#link_template`)
                }
              >
                Link template
              </a>
            </span>
          )}
        </CardDetail>
        <CardDetail>
          <CardLabel>Last job status</CardLabel>
          {automation_status.status !== 'None' ? (
            <JobStatus status={automation_status.status} />
          ) : (
            <Label
              variant="outline"
              color="red"
              icon={<ExclamationCircleIcon />}
            >
              Not Running
            </Label>
          )}
        </CardDetail>
        {projectedSavings && (
          <CardDetail>
            <CardLabel>Projected savings</CardLabel>
            <a onClick={() => history.push(`${match.url}/${id}/statistics`)}>
              {currencyFormatter(+projectedSavings)}
            </a>
          </CardDetail>
        )}
        <CardDetail>
          <CardLabel>Last updated</CardLabel>{' '}
          <span>{formatDateTime(modified)}</span>
        </CardDetail>
      </CardBody>
      <CardFooter>
        <Label>{renderOptionsBasedValue('category', category)}</Label>
      </CardFooter>
    </Card>
  );
};

ListItem.propTypes = {
  isSuccess: PropTypes.bool.isRequired,
  canWrite: PropTypes.bool.isRequired,
  selected: PropTypes.array,
  handleSelect: PropTypes.func,
  plan: PropTypes.object,
  options: PropTypes.object,
};

export default ListItem;
