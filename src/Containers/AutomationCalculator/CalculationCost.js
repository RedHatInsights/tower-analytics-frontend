import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
    Card,
    CardBody,
    InputGroup,
    InputGroupText,
    TextInput
} from '@patternfly/react-core';
import { DollarSignIcon } from '@patternfly/react-icons';
import { BorderedCardTitle as CardTitle } from './helpers';

const InputAndText = styled.div`
  flex: 1;
`;

const CalculationCost = ({
    costManual = 0,
    setCostManual = () => {},
    costAutomation = 0,
    setCostAutomation = () => {}
}) => (
    <Card>
        <CardTitle style={ { paddingBottom: '10px' } }>
                Calculate your automation
        </CardTitle>
        <CardBody>
            <InputAndText>
                <p>Manual cost of automation</p>
                <em style={ { color: 'var(--pf-global--Color--dark-200)' } }>
                        (e.g. average salary of mid-level Software Engineer)
                </em>
                <InputGroup style={ { width: '50%' } }>
                    <InputGroupText>
                        <DollarSignIcon />
                    </InputGroupText>
                    <TextInput
                        id="manual-cost"
                        type="number"
                        step="any"
                        min="0"
                        aria-label="manual-cost"
                        value={ costManual }
                        onChange={ (e) => setCostManual(parseFloat(e)) }
                    />
                    <InputGroupText>/hr</InputGroupText>
                </InputGroup>
            </InputAndText>
            <InputAndText style={ { paddingTop: '10px' } }>
                <p>Automated process cost</p>
                <InputGroup style={ { width: '50%' } }>
                    <InputGroupText>
                        <DollarSignIcon />
                    </InputGroupText>
                    <TextInput
                        id="automation-cost"
                        type="number"
                        step="any"
                        min="0"
                        aria-label="automation-cost"
                        value={ costAutomation }
                        onChange={ (e) => setCostAutomation(parseFloat(e)) }
                    />
                    <InputGroupText>/hr</InputGroupText>
                </InputGroup>
            </InputAndText>
        </CardBody>
    </Card>
);

CalculationCost.propTypes = {
    costManual: PropTypes.number,
    setCostManual: PropTypes.func,
    costAutomation: PropTypes.number,
    setCostAutomation: PropTypes.func
};

export default CalculationCost;
