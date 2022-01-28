import React, { FunctionComponent } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Spinner,
  Title,
} from '@patternfly/react-core';
import currencyFormatter from '../../../../Utilities/currencyFormatter';

interface Props {
  totalSavings: number;
  isLoading: boolean;
}

const TotalSavings: FunctionComponent<Props> = ({
  totalSavings = 0,
  isLoading = false,
}) => (
  <Card isPlain isCompact>
    <CardTitle>Total savings</CardTitle>
    <CardBody>
      <Title
        headingLevel="h3"
        size="4xl"
        style={{ color: 'var(--pf-global--success-color--200)' }}
      >
        {isLoading ? (
          <div style={{ height: '46.8px', paddingLeft: '100px' }}>
            <Spinner isSVG size="lg" />
          </div>
        ) : (
          currencyFormatter(totalSavings)
        )}
      </Title>
    </CardBody>
  </Card>
);

export default TotalSavings;
