import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  Button,
  Card,
  CardBody,
  InputGroup,
  InputGroupText,
  TextInput,
  Tooltip,
  Popover,
} from '@patternfly/react-core';
import {
  InfoCircleIcon,
  ToggleOnIcon,
  ToggleOffIcon,
} from '@patternfly/react-icons';

import { capitalize } from '../../Utilities/helpers';

import currencyFormatter from '../../Utilities/currencyFormatter';

const TemplateDetail = styled.div`
  em {
    display: block;
    padding: 5px 0;
  }

  @media (max-width: 1490px) {
    display: block;

    em {
      padding: 10px 0;
      display: block;
    }
  }
`;

const TemplateDetailSubTitle = styled.em`
  color: var(--pf-global--Color--dark-200);
`;

const TooltipWrapper = styled.div`
  p {
    text-align: left;
  }
`;

const IconGroup = styled.div`
  & svg {
    fill: var(--pf-global--Color--dark-200);

    :hover {
      cursor: pointer;
    }

    :first-of-type {
      margin-right: 10px;
      margin-left: 10px;

      @media (max-width: 1350px) {
        margin-left: 0;
      }
    }
  }
`;

const InputAndText = styled.div`
  flex: 1;
`;

const showSortAttr = (details, sortBy) => {
  const trimmed = sortBy.split(':')[0];
  const sortAttribute = Object.keys(details).map((k) =>
    k === trimmed ? `${details[k]}` : null
  );

  return (
    <TemplateDetailSubTitle>
      {capitalize(trimmed.split('_').join(' '))}: {sortAttribute}
    </TemplateDetailSubTitle>
  );
};

const QuestionIconTooltip = ({ details }) => (
  <Popover
    aria-label="template detail popover"
    position="left"
    bodyContent={
      <TooltipWrapper>
        {Object.keys(details).map((k, i) => (
          <p key={i}>
            <b>{capitalize(k.split('_').join(' '))}</b>: {details[k]}
          </p>
        ))}
      </TooltipWrapper>
    }
  >
    <InfoCircleIcon />
  </Popover>
);

QuestionIconTooltip.propTypes = {
  details: PropTypes.object,
};

const TopTemplates = ({
  data = [],
  sortBy = '',
  setDataRunTime = () => {},
  setEnabled = () => {},
  redirectToJobExplorer = () => {},
}) => (
  <Card>
    <CardBody>
      <p>Enter the time it takes to run the following templates manually.</p>
      {data.map((d) => (
        <div key={d.id}>
          <Tooltip content={'List of jobs for this template for past 30 days'}>
            <Button
              style={{ padding: '15px 0 10px' }}
              component="a"
              onClick={() => redirectToJobExplorer(d.id)}
              variant="link"
            >
              {d.name}
            </Button>
          </Tooltip>
          <TemplateDetail>
            <InputAndText key={d.id}>
              <InputGroup>
                <TextInput
                  id={d.id}
                  type="number"
                  aria-label="time run manually"
                  value={d.avgRunTime / 60}
                  onChange={(minutes) => setDataRunTime(minutes * 60, d.id)}
                />
                <InputGroupText>min</InputGroupText>
              </InputGroup>
            </InputAndText>
            <TemplateDetailSubTitle>
              x {d.successful_hosts_total} host runs
            </TemplateDetailSubTitle>
            {showSortAttr(d, sortBy)}
            <IconGroup>
              <QuestionIconTooltip details={d} />
              {!d.enabled && (
                <ToggleOffIcon onClick={() => setEnabled(d.id)(true)} />
              )}
              {d.enabled && (
                <ToggleOnIcon onClick={() => setEnabled(d.id)(false)} />
              )}
            </IconGroup>
          </TemplateDetail>
          <p style={{ color: '#486B00' }}>{currencyFormatter(+d.delta)}</p>
        </div>
      ))}
    </CardBody>
  </Card>
);

TopTemplates.propTypes = {
  data: PropTypes.array,
  setDataRunTime: PropTypes.func,
  redirectToJobExplorer: PropTypes.func,
  deselectedIds: PropTypes.array,
  setDeselectedIds: PropTypes.func,
  setEnabled: PropTypes.func,
  sortBy: PropTypes.string,
};

export default TopTemplates;
