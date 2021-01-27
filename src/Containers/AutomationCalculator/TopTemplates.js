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
    Popover
} from '@patternfly/react-core';
import {
    InfoCircleIcon
} from '@patternfly/react-icons';

import {
    convertSecondsToMins,
    convertMinsToSeconds
} from '../../Utilities/helpers';

const TemplateDetail = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  div,
  em {
    padding-right: 5px;
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

export const QuestionIconTooltip = ({ data }) => (
    <Popover
        aria-label="template detail popover"
        position="left"
        bodyContent={
            <TooltipWrapper>
                <p>
                    <b>Success elapsed sum</b>:{ ' ' }
                    { data.elapsed.toFixed(2) }s
                </p>
                <p>
                    <b>Number of associated organizations</b>:{ ' ' }
                    { data.totalOrgCount }
                </p>
                <p>
                    <b>Number of associated clusters</b>:{ ' ' }
                    { data.totalClusterCount }
                </p>
            </TooltipWrapper>
        }
    >
        <InfoCircleIcon />
    </Popover>
);

QuestionIconTooltip.propTypes = {
    data: PropTypes.object
};

const TopTemplates = ({
    data = [],
    setDataRunTime = () => {},
    redirectToJobExplorer = () => {}
}) => (
    <Card style={ { overflow: 'auto', flex: '1 1 0' } } className="top-templates">
        <CardBody>
            <p>Enter the time it takes to run the following templates manually.</p>
            { data.map((data) => (
                <div key={ data.id }>
                    <Tooltip content={ 'List of jobs for this template for past 30 days' } >
                        <Button
                            style={ { padding: '15px 0 10px' } }
                            component="a"
                            onClick={ () => redirectToJobExplorer(data.id) }
                            variant="link"
                        >
                            { data.name }
                        </Button>
                    </Tooltip>
                    <TemplateDetail>
                        <InputAndText key={ data.id }>
                            <InputGroup>
                                <TextInput
                                    id={ data.id }
                                    type="number"
                                    aria-label="time run manually"
                                    value={ convertSecondsToMins(data.avgRunTime) }
                                    onChange={ minutes =>
                                        setDataRunTime(convertMinsToSeconds(minutes), data.id)
                                    }
                                />
                                <InputGroupText>min</InputGroupText>
                            </InputGroup>
                        </InputAndText>
                        <TemplateDetailSubTitle>
                                    x { data.hostTaskCount } runs, { data.hostCount } hosts
                        </TemplateDetailSubTitle>
                        <IconGroup>
                            <QuestionIconTooltip data={ data }/>
                        </IconGroup>
                    </TemplateDetail>
                    <p style={ { color: '#486B00' } }>
                            ${ data.delta.toFixed(2) }
                    </p>
                </div>
            )) }
        </CardBody>
    </Card>
);

TopTemplates.propTypes = {
    data: PropTypes.array,
    setDataRunTime: PropTypes.func,
    redirectToJobExplorer: PropTypes.func,
    deselectedIds: PropTypes.array,
    setDeselectedIds: PropTypes.func
};

export default TopTemplates;
