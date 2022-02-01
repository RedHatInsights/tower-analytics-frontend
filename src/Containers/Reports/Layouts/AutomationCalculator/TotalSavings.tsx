import React, { FunctionComponent } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Spinner,
  Title,
} from '@patternfly/react-core';
import currencyFormatter from '../../../../Utilities/currencyFormatter';
import styled from 'styled-components';

interface Props {
  totalSavings: number;
  isLoading: boolean;
}
const SpinnerDiv = styled.div`
  height: 46.8px;
  padding-left: 100px;
`;

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
          <SpinnerDiv>
            <Spinner isSVG size="lg" />
          </SpinnerDiv>
        ) : (
          currencyFormatter(totalSavings)
        )}
      </Title>
    </CardBody>
  </Card>
);

export default TotalSavings;
