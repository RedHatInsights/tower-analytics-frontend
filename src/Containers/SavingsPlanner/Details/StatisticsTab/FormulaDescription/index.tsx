import React, { FunctionComponent, useState } from 'react';
import {
  Button,
  ButtonVariant,
  CodeBlock,
  CodeBlockCode,
  Modal,
  ModalVariant,
} from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';

const CostsText: FunctionComponent<Record<string, never>> = () => (
  <>
    <p>
      <strong>Cost</strong>
    </p>
    <p>
      The cost includes the hours spent in implementation, deployment, training
      and other expenditures for creating, maintaining and running the
      automation. These hours (cost of investment) are usually higher at the
      onset, and will be greatly reduced once the automation has been created
      and only maintenance is required.
    </p>
    <br />

    <p>
      For the initial period and the first year, we assume approximately 10
      hours spent on each host, as well as some buffer time and a 40% risk
      adjustment to account for unforeseen situations.
    </p>
    <br />

    <p>
      For the next two years after the first year, we assume 4 hours spent on
      each host, as well as a 40% risk adjustment to account for unforeseen
      situations.
    </p>
    <br />

    <p>The formula used to calculate cost for the initial period and year 1:</p>
    <CodeBlock>
      <CodeBlockCode>
        {`C1 = (time for a manual run on one host in hours * 10) + buffer time\nC2 = C1 * 40% risk adjustment\ninitial cost = (C1 + C2) * (cost per hour in USD if applicable, based on display)\nyear 1 cost = (C1 + C2) * (cost per hour in USD if applicable, based on display)`}
      </CodeBlockCode>
    </CodeBlock>
    <br />

    <p>The formula used to calculate cost for years 2 and 3:</p>
    <CodeBlock>
      <CodeBlockCode>{`C1 = (time for a manual run on one host in hours * 4)\nC2 = C1 * 40% risk adjustment\nyear 2 cost = (C1 + C2) * (cost per hour in USD if applicable, based on display)\nyear 3 cost = (C1 + C2) * (cost per hour in USD if applicable, based on display)`}</CodeBlockCode>
    </CodeBlock>
  </>
);

const SavingsText: FunctionComponent<Record<string, never>> = () => (
  <>
    <p>
      <strong>Savings</strong>
    </p>
    <p>
      The savings indicates the time and money saved as a result of automating
      the plan.
    </p>
    <br />

    <p>
      We assume 50% productivity recapture to account for the productivity that
      is usually gained by repeated manual implementation of a task over a
      period of time. We also add a -5% risk adjustment for unforeseen
      situations that might arise and need to be handled. We also assume a 15%
      year over year growth in savings.
    </p>
    <br />

    <p>
      Money savings for the initial period is 0, so there is no formula
      necessary.
    </p>
    <br />

    <p>The formula used to calculate savings for year 0:</p>
    <CodeBlock>
      <CodeBlockCode>{`initial period savings = 0 - initial cost`}</CodeBlockCode>
    </CodeBlock>
    <br />

    <p>The formula used for savings for year 1:</p>
    <CodeBlock>
      <CodeBlockCode>{`S1 = (number of hosts * (manual time in minutes / 60) * yearly frequency of automation)\nS2 = S1 * 50% productivity recapture\nS3 = S2 * 5% risk adjustment * (cost per hour in USD if applicable, based on display)\nyear 1 savings = S2 - S3 - year 1 cost`}</CodeBlockCode>
    </CodeBlock>
    <br />

    <p>The formula used to calculate savings for year 2:</p>
    <CodeBlock>
      <CodeBlockCode>{`S1 = year 1 savings * 15% growth\nyear 2 savings = year 1 savings + S1 - year 2 cost`}</CodeBlockCode>
    </CodeBlock>
    <br />

    <p>The formula used to calculate savings for year 3:</p>
    <CodeBlock>
      <CodeBlockCode>{`S2 = year 2 savings * 15% growth\nyear 3 savings = year 2 savings + S2 - year 3 cost`}</CodeBlockCode>
    </CodeBlock>
  </>
);

const FormulaDescription: FunctionComponent<Record<string, never>> = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="link"
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
          We use risk-adjusted factors to create the 3-year projection of cost
          and savings related to automation. While we aim to provide as accurate
          an account of the cost and savings as possible, actual values may
          differ in practice. The following information breaks down where we get
          the data, the risk-adjustment factors we use, the assumptions we make,
          and the formula used to compute the values as displayed in the chart.
        </p>
        <br />

        <CostsText />
        <br />

        <SavingsText />
      </Modal>
    </>
  );
};

export default FormulaDescription;
