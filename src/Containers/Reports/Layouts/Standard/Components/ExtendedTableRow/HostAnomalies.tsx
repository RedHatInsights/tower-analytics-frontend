import { DescriptionListTerm } from '@patternfly/react-core/dist/dynamic/components/DescriptionList';
import { DescriptionList } from '@patternfly/react-core/dist/dynamic/components/DescriptionList';
import { DescriptionListDescription } from '@patternfly/react-core/dist/dynamic/components/DescriptionList';
import { DescriptionListGroup } from '@patternfly/react-core/dist/dynamic/components/DescriptionList';
import { ExpandableRowContent, Td, Tr } from '@patternfly/react-table';
import React from 'react';
import percentageFormatter from '../../../../../../Utilities/percentageFormatter';
import { ExpandedTableRowComponent } from './types';

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
        value: `${percentageFormatter(item.slow_hosts_percentage)}%`,
      },
      {
        label: 'Template Success Rate',
        value: `${percentageFormatter(item.template_success_rate)}%`,
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
