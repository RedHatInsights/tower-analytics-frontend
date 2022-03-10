// TODO(Jo): Remove eslint-disable comments
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
import { ExpandableRowContent, Td, Tr } from '@patternfly/react-table';

const TableExpandedRow: ExpandedTableRowComponent = ({ isExpanded, item }) => {
  const expandedInfo = (item: any) => {
    return [
      {
        label: 'Slow Hosts Count',
        value: item.slow_hosts_count ?? 0,
      },
      {
        label: 'Host Task Count',
        value: item.host_task_count ?? 0,
      },
      {
        label: 'Slow Hosts Percentage',
        value: `${item.slow_hosts_percentage}%` ?? 0,
      },
      {
        label: 'Template Success Rate',
        value: `${item.template_success_rate}%` ?? 0,
      },
    ];
  };

  return (
    <Tr isExpanded={isExpanded}>
      <Td colSpan={6}>
        <ExpandableRowContent>
          <DescriptionList isHorizontal columnModifier={{ lg: '3Col' }}>
            {expandedInfo(item).map(({ label, value }) => (
              <DescriptionListGroup key={label}>
                <DescriptionListTerm>{label}</DescriptionListTerm>
                <DescriptionListDescription>{value}</DescriptionListDescription>
              </DescriptionListGroup>
            ))}
          </DescriptionList>
        </ExpandableRowContent>
      </Td>
    </Tr>
  );
};

export default TableExpandedRow;
