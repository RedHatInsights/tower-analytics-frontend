import styled from 'styled-components';
import { CardTitle } from '@patternfly/react-core';

export const mapApi = ({ items = []}) => items.map(({
    elapsed,
    host_count,
    host_task_count,
    total_org_count,
    total_cluster_count,
    id,
    name
}) => ({
    name,
    id,
    // For chart
    hostCount: host_count,
    elapsed,
    // TopTemplates Tooltip
    hostTaskCount: host_task_count,
    totalOrgCount: total_org_count,
    totalClusterCount: total_cluster_count,
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
