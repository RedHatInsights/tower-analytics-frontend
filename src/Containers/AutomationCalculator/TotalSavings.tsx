import React, { FunctionComponent } from 'react';
import { Card, CardBody, CardTitle, Title } from '@patternfly/react-core';
import currencyFormatter from '../../Utilities/currencyFormatter';

interface Props {
  totalSavings: number;
}

const TotalSavings: FunctionComponent<Props> = ({ totalSavings = 0 }) => (
  <Card isPlain isCompact>
    <CardTitle>Total savings</CardTitle>
    <CardBody>
      <Title
        headingLevel="h3"
        size="4xl"
        style={{ color: 'var(--pf-global--success-color--200)' }}
      >
        {currencyFormatter(totalSavings)}
      </Title>
    </CardBody>
  </Card>
);

export default TotalSavings;
