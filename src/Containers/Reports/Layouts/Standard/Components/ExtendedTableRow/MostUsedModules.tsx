// @ts-nocheck
import React from 'react';
import { Flex, FlexItem } from '@patternfly/react-core';
import { ExpandableRowContent, Td, Tr } from '@patternfly/react-table';

import Breakdown from '../../../../../../Charts/Breakdown';
import { categoryColor } from '../../../../../../Utilities/constants';
import { ExpandedTableRowComponent } from '.';

const TableExpandedRow: ExpandedTableRowComponent = ({ isExpanded, item }) => {
  const totalTaskCount = item
    ? {
        ok: item?.host_task_ok_count ?? 0,
        changed: item?.host_task_changed_count ?? 0,
        failed: item?.host_task_failed_count ?? 0,
        skipped: item?.host_task_skipped_count ?? 0,
        unreachable: item?.host_task_unreachable_count ?? 0,
      }
    : null;

  return (
    <Tr isExpanded={isExpanded}>
      <Td colSpan={10}>
        <ExpandableRowContent>
          <Flex>
            <FlexItem>
              <strong>All Task status</strong>
            </FlexItem>
            <FlexItem align={{ default: 'alignRight' }}>
              <strong>Tasks</strong>
              {'  '}
              {item?.host_task_count ?? 0}
            </FlexItem>
          </Flex>
          <Breakdown
            categoryCount={totalTaskCount}
            categoryColor={categoryColor}
            showPercent
          />
        </ExpandableRowContent>
      </Td>
    </Tr>
  );
};

export default TableExpandedRow;
