import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardTitle } from '@patternfly/react-core';

interface Props {
  isMoney?: boolean
}

const FormulaDescription: FunctionComponent<Props> = ({ isMoney = true }) => (
  <Card isPlain>
    <CardTitle>Automation formula</CardTitle>
    <CardBody>
      <p>
        <b>Manual cost for template x</b> =
        <em>
          {`(time for a manual run on one host in hours * (sum of all hosts across all job runs) ) ${isMoney ? '* cost per hour' : ''}`}
        </em>
      </p>
      <p>
        <b>Automation cost for template x</b> =
        <em>
          cost of automation per hour * sum of total elapsed hours for a template
        </em>
      </p>
      <p>
        <b>Savings</b> =
        <em>Sum of (manual cost - automation cost) across all templates</em>
      </p>
    </CardBody>
  </Card>
);

FormulaDescription.propTypes = {
  isMoney: PropTypes.bool
}

export default FormulaDescription;
