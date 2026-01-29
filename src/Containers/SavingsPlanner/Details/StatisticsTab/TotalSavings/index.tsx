import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardTitle } from '@patternfly/react-core/dist/dynamic/components/Card';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import PropTypes from 'prop-types';
import React, { FunctionComponent } from 'react';
import currencyFormatter from '../../../../../Utilities/currencyFormatter';
import hoursFormatter from '../../../../../Utilities/hoursFormatter';

interface Props {
  value?: number;
  isMoney?: boolean;
}

const TotalSavings: FunctionComponent<Props> = ({
  value = 0,
  isMoney = true,
}) => (
  <Card isPlain>
    <CardTitle style={{ paddingBottom: '0' }}>Total savings</CardTitle>
    <CardBody>
      <Title
        headingLevel='h3'
        size='4xl'
        style={{
          color: isMoney ? 'var(--pf-t--global--color--status--success--200)' : '#0063CF',
        }}
      >
        {isMoney ? `${currencyFormatter(value)}` : `${hoursFormatter(value)}`}
      </Title>
    </CardBody>
  </Card>
);

TotalSavings.propTypes = {
  value: PropTypes.number,
  isMoney: PropTypes.bool,
};

export default TotalSavings;
