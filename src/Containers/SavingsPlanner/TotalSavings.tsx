import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardTitle, Title } from '@patternfly/react-core';

const floatToStringWithCommas = (total: number): string =>
  total
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

interface Props {
  value?: number,
  isMoney?: boolean
}

const TotalSavings: FunctionComponent<Props> = ({ value = 0, isMoney = true }) => (
  <Card>
    <CardTitle style={{ paddingBottom: '0' }}>Total savings</CardTitle>
    <CardBody>
      <Title
        headingLevel="h3"
        size="4xl"
        style={{ color: 'var(--pf-global--success-color--200)' }}
      >
        {isMoney ? `$ ${floatToStringWithCommas(value)}` : `${value.toFixed(0)} hours`}
      </Title>
    </CardBody>
  </Card>
);

TotalSavings.propTypes = {
  value: PropTypes.number,
  isMoney: PropTypes.bool
};

export default TotalSavings;
