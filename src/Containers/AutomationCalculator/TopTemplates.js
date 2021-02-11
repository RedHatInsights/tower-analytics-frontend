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
    InfoCircleIcon,
    ToggleOnIcon,
    ToggleOffIcon
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

export const QuestionIconTooltip = ({
    successfulElapsedTotal,
    totalOrgCount,
    totalClusterCount
}) => (
    <Popover
        aria-label="template detail popover"
        position="left"
        bodyContent={
            <TooltipWrapper>
                <p>
                    <b>Success elapsed sum</b>: {successfulElapsedTotal.toFixed(2)}
                </p>
                <p>
                    <b>Number of associated organizations</b>: {totalOrgCount}
                </p>
                <p>
                    <b>Number of associated clusters</b>: {totalClusterCount}
                </p>
            </TooltipWrapper>
        }
    >
        <InfoCircleIcon />
    </Popover>
);

QuestionIconTooltip.propTypes = {
    successfulElapsedTotal: PropTypes.number,
    totalOrgCount: PropTypes.number,
    totalClusterCount: PropTypes.number
};

const TopTemplates = ({
    data = [],
    setDataRunTime = () => {},
    setEnabled = () => {},
    redirectToJobExplorer = () => {}
}) => (
    <Card style={{ overflow: 'auto', flex: '1 1 0' }} className="top-templates">
        <CardBody>
            <p>Enter the time it takes to run the following templates manually.</p>
            {data.map(({
                id,
                name,
                avgRunTime,
                enabled,
                delta,
                successful_hosts_total,
                successful_elapsed_total,
                total_org_count,
                total_cluster_count
            }) => (
                <div key={id}>
                    <Tooltip content={'List of jobs for this template for past 30 days'}>
                        <Button
                            style={{ padding: '15px 0 10px' }}
                            component="a"
                            onClick={() => redirectToJobExplorer(id)}
                            variant="link"
                        >
                            {name}
                        </Button>
                    </Tooltip>
                    <TemplateDetail>
                        <InputAndText key={id}>
                            <InputGroup>
                                <TextInput
                                    id={id}
                                    type="number"
                                    aria-label="time run manually"
                                    value={convertSecondsToMins(avgRunTime)}
                                    onChange={minutes =>
                                        setDataRunTime(convertMinsToSeconds(minutes), id)
                                    }
                                />
                                <InputGroupText>min</InputGroupText>
                            </InputGroup>
                        </InputAndText>
                        <TemplateDetailSubTitle>
                            x {successful_hosts_total} host runs
                        </TemplateDetailSubTitle>
                        <IconGroup>
                            <QuestionIconTooltip
                                successfulElapsedTotal={successful_elapsed_total}
                                totalOrgCount={total_org_count}
                                totalClusterCount={total_cluster_count}
                            />
                            { !enabled && <ToggleOffIcon onClick={ () => setEnabled(id)(true) } /> }
                            { enabled && <ToggleOnIcon onClick={ () => setEnabled(id)(false) } /> }
                        </IconGroup>
                    </TemplateDetail>
                    <p style={{ color: '#486B00' }}>${delta.toFixed(2)}</p>
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
    setEnabled: PropTypes.func
};

export default TopTemplates;
