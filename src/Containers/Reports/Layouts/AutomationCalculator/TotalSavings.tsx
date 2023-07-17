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
import hoursFormatter from '../../../../Utilities/hoursFormatter';

interface Props {
  totalSavings: number;
  currentPageSavings: number;
  isLoading: boolean;
  isMoney: boolean;
}
const SpinnerDiv = styled.div`
  height: 46.8px;
  padding-left: 100px;
`;

const TotalSavings: FunctionComponent<Props> = ({
  totalSavings = 0,
  currentPageSavings = 0,
  isLoading = false,
  isMoney = true,
}) => {
  console.log('total savings', JSON.stringify(totalSavings));
  console.log('current page savings', JSON.stringify(currentPageSavings));
  return (
    <>
      {['Total savings', 'Current page savings'].map((title, index) => (
        <Card
          data-cy={title.toLowerCase().replace(' ', '_').replace(' ', '_')}
          isPlain
          isCompact
          key={title}
        >
          <CardTitle>{title}</CardTitle>
          <CardBody>
            <Title
              headingLevel="h3"
              size={index === 0 ? '4xl' : 'xl'}
              style={{ color: 'var(--pf-global--success-color--200)' }}
            >
              {isLoading ? (
                <SpinnerDiv>
                  <Spinner data-cy={'spinner'} isSVG size="lg" />
                </SpinnerDiv>
              ) : isMoney ? (
                currencyFormatter(
                  index === 0 ? totalSavings : currentPageSavings
                )
              ) : (
                hoursFormatter(index === 0 ? totalSavings : currentPageSavings)
              )}
            </Title>
          </CardBody>
        </Card>
      ))}
    </>
  );
}

export default TotalSavings;
