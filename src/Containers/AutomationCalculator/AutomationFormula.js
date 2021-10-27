import React from 'react';

import { Card, CardBody } from '@patternfly/react-core';
import { BorderedCardTitle as CardTitle } from './helpers';

const AutomationFormula = () => (
  <Card style={{ height: '100%' }}>
    <CardTitle>Automation formula</CardTitle>
    <CardBody>
      <p>
        <b>Manual cost for template x</b> =
        <em>
          (time for a manual run on one host in hours * (sum of all hosts across
          all job runs) ) * cost per hour
        </em>
      </p>
      <p>
        <b>Automation cost for template x</b> =
        <em>
          cost of automation per hour * sum of total elapsed hours for a
          template
        </em>
      </p>
      <p>
        <b>Savings</b> =
        <em>Sum of (manual cost - automation cost) across all templates</em>
      </p>
    </CardBody>
  </Card>
);

export default AutomationFormula;
