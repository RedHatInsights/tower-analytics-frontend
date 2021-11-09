import React, { FunctionComponent, useState } from 'react';
import {
  Button,
  ButtonVariant,
  Modal,
  ModalVariant,
} from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';

const AutomationFormula: FunctionComponent<Record<string, never>> = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant={ButtonVariant.link}
        onClick={() => setIsOpen(true)}
        icon={<InfoCircleIcon />}
      >
        Automation formula
      </Button>
      <Modal
        title="Automation formula"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        variant={ModalVariant.medium}
        actions={[
          <Button
            key="cancel"
            variant={ButtonVariant.primary}
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>,
        ]}
      >
        <p>
          <b>Manual cost for template X</b>
          <br />
          (time for a manual run on one host in hours * (sum of all hosts across
          all job runs) ) * cost per hour
        </p>
        <br />
        <p>
          <b>Automation cost for template X</b>
          <br />
          cost of automation per hour * sum of total elapsed hours for a
          template
        </p>
        <br />
        <p>
          <b>Savings</b>
          <br />
          Sum of (manual cost - automation cost) across all templates
        </p>
      </Modal>
    </>
  );
};

export default AutomationFormula;
