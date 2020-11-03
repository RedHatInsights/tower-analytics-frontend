import styled from 'styled-components';
import { CardTitle } from '@patternfly/react-core';

export const mapApi = (data) => data.map(({
    elapsed,
    hostCount,
    hostTaskCount,
    totalOrgCount,
    totalClusterCount,
    id,
    name
}) => ({
    name,
    id,
    // For chart
    hostCount,
    elapsed,
    // TopTemplates Tooltip
    hostTaskCount,
    totalOrgCount,
    totalClusterCount,
    // Chart + TopTemplates
    // For calculations
    delta: 0,
    avgRunTime: elapsed || 3600,
    manualCost: 0,
    automatedCost: 0
}));

export const BorderedCardTitle = styled(CardTitle)`
  border-bottom: 1px solid #d7d7d7;
  margin-bottom: 10px;
`;
