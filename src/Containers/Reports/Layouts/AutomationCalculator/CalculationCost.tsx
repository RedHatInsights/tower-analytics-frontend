import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { InputGroup } from '@patternfly/react-core/dist/dynamic/components/InputGroup';
import { InputGroupText } from '@patternfly/react-core/dist/dynamic/components/InputGroup';
import { TextInput } from '@patternfly/react-core/dist/dynamic/components/TextInput';
import DollarSignIcon from '@patternfly/react-icons/dist/dynamic/icons/dollar-sign-icon';
import OutlinedClockIcon from '@patternfly/react-icons/dist/dynamic/icons/outlined-clock-icon';
import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import AlertModal from '../../../../Components/AlertModal';

const WInputGroup = styled(InputGroup)`
  width: 170px;
`;

const validFloat = (value: number): number =>
  +value && +value < 0 ? NaN : value;

const MAX_PG_INT = 2147483646;

const validNonNegativeInt = (value: number): number =>
  !Number.isFinite(value) ||
  value < 0 ||
  !Number.isInteger(value) ||
  value > MAX_PG_INT
    ? NaN
    : value;

interface Props {
  costManual: number;
  setFromCalculation: (varName: string, value: number) => void;
  costAutomation: number;
  defaultManualEffort: number;
  onApplyDefault: () => Promise<void>;
  readOnly: boolean;
}

const CalculationCost: FunctionComponent<Props> = ({
  costManual = 0,
  setFromCalculation = () => ({}),
  costAutomation = 0,
  defaultManualEffort = 0,
  onApplyDefault = () => Promise.resolve(),
  readOnly = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  return (
    <Card isPlain isCompact>
      <CardBody>
        <p>
          Manual cost of automation
          <span
            style={{
              color: 'var(--pf-t--global--text--color--200)',
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
            onChange={(_event, value) =>
              setFromCalculation('manual_cost', validFloat(+value))
            }
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
            onChange={(_event, value) =>
              setFromCalculation('automation_cost', validFloat(+value))
            }
            isDisabled={readOnly}
          />
          <InputGroupText>/hr</InputGroupText>
        </WInputGroup>
        <p style={{ paddingTop: '10px' }}>
          Default manual time per template (minutes)
        </p>
        <WInputGroup>
          <InputGroupText>
            <OutlinedClockIcon />
          </InputGroupText>
          <TextInput
            id='default-manual-effort'
            key='default-manual-effort'
            type='number'
            aria-label='default-manual-effort'
            value={
              isNaN(defaultManualEffort) ? '' : defaultManualEffort.toString()
            }
            onChange={(_event, value) =>
              setFromCalculation(
                'default_manual_effort_minutes',
                validNonNegativeInt(+value),
              )
            }
            isDisabled={readOnly}
          />
          <InputGroupText>min</InputGroupText>
        </WInputGroup>
        <Button
          variant='secondary'
          style={{ marginTop: '10px' }}
          data-cy='apply_default_button'
          isDisabled={readOnly}
          onClick={() => setIsOpen(true)}
        >
          Apply default to all unreviewed
        </Button>
        <AlertModal
          isOpen={isOpen}
          title='Apply default manual time'
          variant='warning'
          data-cy='apply_default_modal'
          onClose={() => {
            // don't let escape/backdrop dismiss while a request is in flight
            if (!isApplying) {
              setIsOpen(false);
            }
          }}
          actions={[
            <Button
              key='confirm'
              data-cy='apply_default_confirm_button'
              variant='primary'
              isLoading={isApplying}
              isDisabled={isApplying}
              onClick={async () => {
                setIsApplying(true);
                try {
                  await onApplyDefault();
                } finally {
                  setIsApplying(false);
                  setIsOpen(false);
                }
              }}
            >
              Continue
            </Button>,
            <Button
              key='cancel'
              data-cy='apply_default_cancel_button'
              variant='link'
              isDisabled={isApplying}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>,
          ]}
        >
          {`This will set ${defaultManualEffort} minutes as the manual time ` +
            `for all templates you haven't individually reviewed. Continue?`}
        </AlertModal>
      </CardBody>
    </Card>
  );
};

export default CalculationCost;
