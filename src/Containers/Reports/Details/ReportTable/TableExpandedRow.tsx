/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm, Divider,
  Flex,
  FlexItem,
  Grid,
  GridItem
} from '@patternfly/react-core';
import {
  ExpandableRowContent,
  Td,
  Tr as PFTr,
} from '@patternfly/react-table';

import { ReportGeneratorParams } from '../../Shared/types';
import Breakdown from '../../../../Charts/Breakdown';
import {categoryColor} from "../../../../Utilities/constants";


const Tr = styled(PFTr)`
  & td:first-child {
    width: 50px;
  }
`;

const renderExpandedRow = (
  expanded,
  item
) => {
  const totalCount = (item) =>
    item
      ? {
          ok: item?.successful_count ?? 0,
          skipped: item?.skipped_count ?? 0,
          failed: item?.failed_count ?? 0,
          error: item?.error_count ?? 0,
        }
      : null;

  const totalTaskCount = (item) =>
    item
      ? {
          ok: item?.average_host_task_ok_count_per_host ?? 0,
          skipped: item?.average_host_task_skipped_count_per_host ?? 0,
          changed: item?.average_host_task_changed_count_per_host ?? 0,
          failed: item?.average_host_task_failed_count_per_host ?? 0,
          unreachable: item?.average_host_task_unreachable_count_per_host ?? 0,
        }
      : null;

  const totalHostCount = (item) =>
    item
      ? {
          ok: item?.ok_host_count ?? 0,
          skipped: item?.skipped_host_count ?? 0,
          changed: item?.changed_host_count ?? 0,
          failed: item?.failed_host_count ?? 0,
          unreachable: item?.unreachable_host_count ?? 0,
        }
      : null;

  const taskInfo = (task) => {
    return [
      {
        label: 'Task name',
        value: task.task_name,
      },
      {
        label: 'Module name',
        value: task.module_name,
      }
    ];
  }

  const total_host_status_count = (task) => {
    return task.passed_host_count + task.failed_host_count + task.unreachable_host_count
  }

  const total_task_status_count = (task) => {
    return task.successful_count + task.failed_count + task.unfinished_count
  }

  const renderFailedTaskBar = (item) => {
    const failed_tasks = item.most_failed_tasks
    if (failed_tasks != null) {
      return (
        <>
          <p>
            <strong>Most failed tasks</strong>
          </p>
          <br />
          <Grid hasGutter>
            {failed_tasks
              .slice(0, failed_tasks.length)
              .map((task, idx) => {
                const hostCount = {
                  passed: task?.passed_host_count ?? 0,
                  failed: task?.failed_host_count ?? 0,
                  unreachable: task?.unreachable_host_count ?? 0,
                };
                const taskCount = {
                  passed: task?.successful_count ?? 0,
                  failed: task?.failed_count ?? 0,
                  unfinished: task?.unfinished_count ?? 0,
                };
                return (
                  <>
                    <Grid hasGutter>
                      <GridItem>
                        <DescriptionList isCompact isHorizontal>
                          {taskInfo(task).map(({ label, value }) => (
                            <DescriptionListGroup key={label}>
                              <DescriptionListTerm>{label}</DescriptionListTerm>
                              <DescriptionListDescription>
                                {value}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                          ))}
                        </DescriptionList>
                      </GridItem>
                      <GridItem>
                        <Flex>
                          <FlexItem>
                            <strong>Host status</strong>
                          </FlexItem>
                          <FlexItem align={{ default: 'alignRight' }}>
                            <strong>Hosts</strong>
                            {'  '}
                            {total_host_status_count(task)}
                          </FlexItem>
                          <FlexItem>
                            <strong>Task status</strong>
                          </FlexItem>
                          <FlexItem align={{ default: 'alignRight' }}>
                            <strong>Tasks</strong>
                            {'  '}
                            {total_task_status_count(task)}
                          </FlexItem>
                        </Flex>
                      </GridItem>
                      <GridItem lg={6} md={12} key={`hosts-${idx}`}>
                        <Breakdown
                          categoryCount={hostCount}
                          categoryColor={categoryColor}
                          showPercent
                        />
                      </GridItem>
                      <GridItem lg={6} md={12} key={`tasks-${idx}`}>
                        <Breakdown
                          categoryCount={taskCount}
                          categoryColor={categoryColor}
                          showPercent
                        />
                      </GridItem>
                    </Grid>
                  </>
                );
              })}
          </Grid>
        </>
      );
    }
  };

  const expandedInfo = (item) => {
    return [
      {
        label: 'Clusters',
        value: item.total_cluster_count ?? 0,
      },
      {
        label: 'Organizations',
        value: item.total_org_count ?? 0,
      }
    ];
  }

  return (
    <Tr isExpanded={expanded.some((s) => s.id === item.id)}>
      <Td colSpan={6}>
        <ExpandableRowContent>
          <Flex>
            <FlexItem>
              <strong>Job status</strong>
            </FlexItem>
            <FlexItem align={{ default: 'alignRight' }}>
              <strong>Jobs</strong>
              {'  '}
              {item?.total_count ?? 0}
            </FlexItem>
          </Flex>
          <Breakdown
            categoryCount={totalCount(item)}
            categoryColor={categoryColor}
            showPercent
          />

          <Flex>
            <FlexItem>
              <strong>All Host status</strong>
            </FlexItem>
            <FlexItem align={{ default: 'alignRight' }}>
              <strong>Hosts</strong>
              {'  '}
              {item?.host_count ?? 0}
            </FlexItem>
          </Flex>
          <Breakdown
            categoryCount={totalHostCount(item)}
            categoryColor={categoryColor}
            showPercent
          />

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
            categoryCount={totalTaskCount(item)}
            categoryColor={categoryColor}
            showPercent
          />

          <Divider
            component="div"
            style={{ marginTop: '2rem', marginBottom: '1.5rem' }}
          />

          {renderFailedTaskBar(item)}

          <DescriptionList isHorizontal columnModifier={{ lg: '3Col' }}>
            {expandedInfo(item).map(({ label, value }) => (
              <DescriptionListGroup key={label}>
                <DescriptionListTerm>{label}</DescriptionListTerm>
                <DescriptionListDescription>
                  {value}
                </DescriptionListDescription>
              </DescriptionListGroup>
            ))}
          </DescriptionList>
        </ExpandableRowContent>
      </Td>
    </Tr>
  );
};

const TableExpandedRow: FunctionComponent<ReportGeneratorParams> = ({
  expanded,
  item
}) => {
  return (
    renderExpandedRow(expanded, item)
  );
};

export default TableExpandedRow;
