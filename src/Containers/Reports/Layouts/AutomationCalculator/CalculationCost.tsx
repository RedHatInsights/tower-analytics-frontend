import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { InputGroup } from '@patternfly/react-core/dist/dynamic/components/InputGroup';
import { InputGroupText } from '@patternfly/react-core/dist/dynamic/components/InputGroup';
import { TextInput } from '@patternfly/react-core/dist/dynamic/components/TextInput';
import DollarSignIcon from '@patternfly/react-icons/dist/dynamic/icons/dollar-sign-icon';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

const WInputGroup = styled(InputGroup)`
  width: 170px;
`;

const validFloat = (value: number): number =>
  +value && +value < 0 ? NaN : value;

interface Props {
  costManual: number;
  setFromCalculation: (varName: string, value: number) => void;
  costAutomation: number;
  readOnly: boolean;
}

const CalculationCost: FunctionComponent<Props> = ({
  costManual = 0,
  setFromCalculation = () => ({}),
  costAutomation = 0,
  readOnly = true,
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
      <WInputGroup>
        <InputGroupText>
          <DollarSignIcon />
        </InputGroupText>
        <TextInput
          id='manual-cost'
          key='manual-cost'
          type='number'
          aria-label='manual-cost'
          value={isNaN(costManual) ? '' : costManual.toString()}
          onChange={(e) => setFromCalculation('manual_cost', validFloat(+e))}
          isDisabled={readOnly}
        />
        <InputGroupText>/hr</InputGroupText>
      </WInputGroup>
      <p style={{ paddingTop: '10px' }}>Automated process cost</p>
      <WInputGroup>
        <InputGroupText>
          <DollarSignIcon />
        </InputGroupText>
        <TextInput
          id='automation-cost'
          key='automation-cost'
          type='number'
          aria-label='automation-cost'
          value={isNaN(costAutomation) ? '' : costAutomation.toString()}
          onChange={(e) =>
            setFromCalculation('automation_cost', validFloat(+e))
          }
          isDisabled={readOnly}
        />
        <InputGroupText>/hr</InputGroupText>
      </WInputGroup>
    </CardBody>
  </Card>
);

export default CalculationCost;
