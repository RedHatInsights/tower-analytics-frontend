import styled from 'styled-components';
import { CardTitle } from '@patternfly/react-core';

/* eslint-disable camelcase */
export const mapApi = (data) => data.map(({
    elapsed,
    host_count,
    host_task_count,
    // total_count,
    total_org_count,
    total_cluster_count,
    id,
    name
}) => ({
    name,
    id,
    // For chart
    calculations: {
        manual: {
            name,
            avgRun: 3600, // 1 hr in seconds
            cost: 0
        },
        automated: {
            name,
            avgRun: elapsed || 0,
            cost: 0
        }
    },
    hostCount: host_count,
    elapsed,
    // TopTemplates Tooltip
    hostTaskCount: host_task_count,
    totalOrgCount: total_org_count,
    totalClusterCount: total_cluster_count,
    delta: 0
}));

export const BorderedCardTitle = styled(CardTitle)`
  border-bottom: 1px solid #d7d7d7;
  margin-bottom: 10px;
`;
