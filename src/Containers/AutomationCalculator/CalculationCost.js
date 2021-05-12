import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  Card,
  CardBody,
  InputGroup,
  InputGroupText,
  TextInput,
} from '@patternfly/react-core';
import { DollarSignIcon } from '@patternfly/react-icons';
import { BorderedCardTitle as CardTitle } from './helpers';

const InputAndText = styled.div`
  flex: 1;
`;

const validFloat = (value) => {
  const floatValue = parseFloat(value);
  return floatValue && floatValue >= 0 ? value : '';
};

const CalculationCost = ({
  costManual = '0',
  setCostManual = () => {},
  costAutomation = '0',
  setCostAutomation = () => {},
}) => (
  <Card>
    <CardTitle>Calculate your automation</CardTitle>
    <CardBody>
      <InputAndText>
        <p>Manual cost of automation</p>
        <em style={{ color: 'var(--pf-global--Color--dark-200)' }}>
          (e.g. average salary of mid-level Software Engineer)
        </em>
        <InputGroup style={{ width: '50%' }}>
          <InputGroupText>
            <DollarSignIcon />
          </InputGroupText>
          <TextInput
            id="manual-cost"
            type="number"
            aria-label="manual-cost"
            value={costManual}
            onChange={(e) => setCostManual(validFloat(e))}
          />
          <InputGroupText>/hr</InputGroupText>
        </InputGroup>
      </InputAndText>
      <InputAndText style={{ paddingTop: '10px' }}>
        <p>Automated process cost</p>
        <InputGroup style={{ width: '50%' }}>
          <InputGroupText>
            <DollarSignIcon />
          </InputGroupText>
          <TextInput
            id="automation-cost"
            type="number"
            aria-label="automation-cost"
            value={costAutomation}
            onChange={(e) => setCostAutomation(validFloat(e))}
          />
          <InputGroupText>/hr</InputGroupText>
        </InputGroup>
      </InputAndText>
    </CardBody>
  </Card>
);

CalculationCost.propTypes = {
  costManual: PropTypes.string,
  setCostManual: PropTypes.func,
  costAutomation: PropTypes.string,
  setCostAutomation: PropTypes.func,
};

export default CalculationCost;
