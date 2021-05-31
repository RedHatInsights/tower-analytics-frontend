import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Paths } from '../../paths';

import { formatDateTime } from '../../Utilities/helpers';

import {
  Card,
  CardHeader,
  CardHeaderMain,
  CardActions,
  CardTitle,
  CardBody,
  CardFooter,
  Checkbox,
  Dropdown,
  DropdownItem,
  KebabToggle,
  Label,
} from '@patternfly/react-core';

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import styled from 'styled-components';
import { stringify } from 'query-string';

import { Link, useRouteMatch } from 'react-router-dom';
// import useSelected from "../../Utilities/useSelected";

const CardLabel = styled.span`
  margin-right: 5px;
`;

const PlanCard = ({
  isSuccess,
  plan,
  selected = [],
  handleSelect = () => {},
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
  } = plan;
  const [isCardKebabOpen, setIsCardKebabOpen] = useState(false);

  const match = useRouteMatch();
  let history = useHistory();

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

  const renderTemplateLink = (template) => {
    return template && isSuccess ? (
      <a onClick={() => redirectToJobExplorer(template.id)}>{template.name}</a>
    ) : null;
  };

  const kebabDropDownItems = [
    <React.Fragment key={id}>
      <DropdownItem key="edit" onClick={() => {}} position="right">
        Edit
      </DropdownItem>
      <DropdownItem key="link" onClick={() => {}} position="right">
        Link template
      </DropdownItem>
    </React.Fragment>,
  ];

  return (
    <Card isHoverable isCompact>
      <CardHeader>
        <CardHeaderMain>
          <CardTitle>
            <Link to={`${match.url}/${id}`}>{name}</Link>
          </CardTitle>
        </CardHeaderMain>
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
            isChecked={selected.some(row => row.id === plan.id)}
            aria-label="card checkbox"
            id="check-1"
            name="check1"
          />
        </CardActions>
      </CardHeader>
      <CardBody>
        {description ? <p>{description}</p> : null}
        <div>
          <CardLabel>Frequency</CardLabel>{' '}
          {frequency_period ? frequency_period : <em>None</em>}
        </div>
        <div>
          <CardLabel>Template</CardLabel>{' '}
          {template_details ? (
            renderTemplateLink(template_details)
          ) : (
            <em>None</em>
          )}
        </div>
        <div>
          <CardLabel>Automation status</CardLabel>
          {automation_status.status === 'successful' ? (
            <Label variant="outline" color="green" icon={<CheckCircleIcon />}>
              Running
            </Label>
          ) : (
            <Label
              variant="outline"
              color="red"
              icon={<ExclamationCircleIcon />}
            >
              Not Running
            </Label>
          )}
        </div>
        <div>
          <CardLabel>Last updated</CardLabel>{' '}
          <em>{formatDateTime(modified)}</em>
        </div>
      </CardBody>
      <CardFooter>
        <Label>{category}</Label>
      </CardFooter>
    </Card>
  );
};

PlanCard.propTypes = {
  isSuccess: PropTypes.bool.isRequired,
  selected: PropTypes.array,
  handleSelect: PropTypes.func,
  plan: PropTypes.object,
};

export default PlanCard;
