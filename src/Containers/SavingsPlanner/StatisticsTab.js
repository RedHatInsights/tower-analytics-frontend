import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import { Card, CardBody } from '@patternfly/react-core';
import RoutedTabs from '../../Components/RoutedTabs';

const TopCard = styled(Card)`
  min-height: 500px;
`;

const StatisticsTab = ({ tabsArray }) => {
  return (
    <>
      <TopCard>
        <RoutedTabs tabsArray={tabsArray} />
        <CardBody />
      </TopCard>
    </>
  );
};

StatisticsTab.propTypes = {
    tabsArray: PropTypes.array
};

export default StatisticsTab;
