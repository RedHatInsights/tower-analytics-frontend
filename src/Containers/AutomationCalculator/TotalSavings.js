import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardTitle, Title } from '@patternfly/react-core';
import currencyFormatter from '../../Utilities/currencyFormatter';

const TotalSavings = ({ totalSavings = 0 }) => (
  <Card style={{ borderTop: '3px solid #2B9AF3' }}>
    <CardTitle style={{ paddingBottom: '0' }}>Total savings</CardTitle>
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

TotalSavings.propTypes = {
  totalSavings: PropTypes.number,
};

export default TotalSavings;
