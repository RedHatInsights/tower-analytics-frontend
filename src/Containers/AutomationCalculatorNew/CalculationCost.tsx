import React, { FunctionComponent } from 'react';

import {
  Card,
  CardBody,
  InputGroup as PFInputGroup,
  InputGroupText,
  TextInput,
} from '@patternfly/react-core';
import { DollarSignIcon } from '@patternfly/react-icons';
import styled from 'styled-components';

const InputGroup = styled(PFInputGroup)`
  width: 170px;
`;

const validFloat = (value: number): number =>
  +value && +value < 0 ? NaN : value;

interface Props {
  costManual: number;
  setCostManual: (value: number) => void;
  costAutomation: number;
  setCostAutomation: (value: number) => void;
}

const CalculationCost: FunctionComponent<Props> = ({
  costManual = 0,
  setCostManual = () => ({}),
  costAutomation = 0,
  setCostAutomation = () => ({}),
}) => (
  <Card isPlain isCompact>
    <CardBody>
      <p>
        Manual cost of automation
        <span
          style={{
            color: 'var(--pf-global--Color--dark-200)',
            fontSize: '0.8em',
            display: 'block',
          }}
        >
          (e.g. average salary of mid-level Software Engineer)
        </span>
      </p>
      <InputGroup>
        <InputGroupText>
          <DollarSignIcon />
        </InputGroupText>
        <TextInput
          id="manual-cost"
          type="number"
          aria-label="manual-cost"
          value={isNaN(costManual) ? '' : costManual.toString()}
          onChange={(e) => setCostManual(validFloat(+e))}
        />
        <InputGroupText>/hr</InputGroupText>
      </InputGroup>
      <p style={{ paddingTop: '10px' }}>Automated process cost</p>
      <InputGroup>
        <InputGroupText>
          <DollarSignIcon />
        </InputGroupText>
        <TextInput
          id="automation-cost"
          type="number"
          aria-label="automation-cost"
          value={isNaN(costAutomation) ? '' : costAutomation.toString()}
          onChange={(e) => setCostAutomation(validFloat(+e))}
        />
        <InputGroupText>/hr</InputGroupText>
      </InputGroup>
    </CardBody>
  </Card>
);

export default CalculationCost;
