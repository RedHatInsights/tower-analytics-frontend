import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardTitle, Title } from '@patternfly/react-core';
import formatCurrency from '../../../Shared/currencyFormatter';
import formatHours from '../../../Shared/hoursFormatter';
interface Props {
  value?: number,
  isMoney?: boolean
}

const TotalSavings: FunctionComponent<Props> = ({
  value = 0,
  isMoney = true,
}) => (
  <Card isPlain>
    <CardTitle style={{ paddingBottom: '0' }}>Total savings</CardTitle>
    <CardBody>
      <Title
        headingLevel="h3"
        size="4xl"
        style={{ color: isMoney ? '#81C46B' : '#0063CF' }}
      >
        {isMoney
          ? `${formatCurrency(value.toString())}`
          : `${formatHours(value)}`}
      </Title>
    </CardBody>
  </Card>
);

TotalSavings.propTypes = {
  value: PropTypes.number,
  isMoney: PropTypes.bool,
};

export default TotalSavings;
