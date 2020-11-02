import styled from 'styled-components';
import { CardTitle } from '@patternfly/react-core';

/* eslint-disable camelcase */
export const mapApi = (data) => data.map(({
    elapsed,
    hostCount,
    hostTaskCount,
    // total_count,
    totalOrgCount,
    totalClusterCount,
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
    hostCount,
    elapsed,
    // TopTemplates Tooltip
    hostTaskCount,
    totalOrgCount,
    totalClusterCount,
    delta: 0
}));

export const BorderedCardTitle = styled(CardTitle)`
  border-bottom: 1px solid #d7d7d7;
  margin-bottom: 10px;
`;
