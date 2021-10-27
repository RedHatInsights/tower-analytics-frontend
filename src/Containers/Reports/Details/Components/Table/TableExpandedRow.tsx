/**
 * TODO: This file is super specific to the data set, it is not reusable at all.
 * TODO: The types could be specified if I would be more confortable with the
 * data set this is developed for. The Brekadown component is not TS, which
 * is preventing the typescript compiler from compiling this component.
 */

/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { FunctionComponent } from 'react';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Divider,
  Flex,
  FlexItem,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { ExpandableRowContent, Td, Tr } from '@patternfly/react-table';

import Breakdown from '../../../../../Charts/Breakdown';
import { categoryColor } from '../../../../../Utilities/constants';
import { LegendEntry } from '../types';

interface Props {
  isExpanded: boolean;
  item: LegendEntry;
}

const TableExpandedRow: FunctionComponent<Props> = ({ isExpanded, item }) => {
  const totalCount = item
    ? {
        ok: item?.successful_count ?? 0,
        skipped: item?.skipped_count ?? 0,
        failed: item?.failed_count ?? 0,
        error: item?.error_count ?? 0,
      }
    : null;

  const totalTaskCount = item
    ? {
        ok: item?.average_host_task_ok_count_per_host ?? 0,
        skipped: item?.average_host_task_skipped_count_per_host ?? 0,
        changed: item?.average_host_task_changed_count_per_host ?? 0,
        failed: item?.average_host_task_failed_count_per_host ?? 0,
        unreachable: item?.average_host_task_unreachable_count_per_host ?? 0,
      }
    : null;

  const totalHostCount = item
    ? {
        ok: item?.ok_host_count ?? 0,
        skipped: item?.skipped_host_count ?? 0,
        changed: item?.changed_host_count ?? 0,
        failed: item?.failed_host_count ?? 0,
        unreachable: item?.unreachable_host_count ?? 0,
      }
    : null;

  const taskInfo = (task: any) => {
    return [
      {
        label: 'Task name',
        value: task.task_name,
      },
      {
        label: 'Module name',
        value: task.module_name,
      },
    ];
  };

  const totalHostStatusCount = (task: any) => {
    return (
      parseInt(task.passed_host_count) +
      parseInt(task.failed_host_count) +
      parseInt(task.unreachable_host_count)
    );
  };

  const totalTaskStatusCount = (task: any) => {
    return (
      parseInt(task.successful_count) +
      parseInt(task.failed_count) +
      parseInt(task.unfinished_count)
    );
  };

  const renderFailedTaskBar = (item: any) => {
    const failed_tasks = item.most_failed_tasks;
    if (failed_tasks != null) {
      return (
        <>
          <p>
            <strong>Most failed tasks</strong>
          </p>
          <br />
          <Grid>
            {failed_tasks
              .slice(0, failed_tasks.length)
              .map((task: any, idx: number) => {
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
                    <GridItem>
                      <DescriptionList isHorizontal>
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
                    <GridItem lg={6} md={12} key={`hosts-${idx}`}>
                      <Flex>
                        <FlexItem>
                          <strong>Host status</strong>
                        </FlexItem>
                        <FlexItem align={{ default: 'alignRight' }}>
                          <strong>Hosts</strong>
                          {'  '}
                          {totalHostStatusCount(task)}
                        </FlexItem>
                      </Flex>
                      <Breakdown
                        categoryCount={hostCount}
                        categoryColor={categoryColor}
                        showPercent
                      />
                    </GridItem>
                    <GridItem lg={6} md={12} key={`tasks-${idx}`}>
                      <Flex>
                        <FlexItem>
                          <strong>Task status</strong>
                        </FlexItem>
                        <FlexItem align={{ default: 'alignRight' }}>
                          <strong>Tasks</strong>
                          {'  '}
                          {totalTaskStatusCount(task)}
                        </FlexItem>
                      </Flex>
                      <Breakdown
                        categoryCount={taskCount}
                        categoryColor={categoryColor}
                        showPercent
                      />
                    </GridItem>
                  </>
                );
              })}
          </Grid>
        </>
      );
    }
  };

  const expandedInfo = (item: any) => {
    return [
      {
        label: 'Clusters',
        value: item.total_cluster_count ?? 0,
      },
      {
        label: 'Organizations',
        value: item.total_org_count ?? 0,
      },
    ];
  };

  return (
    <Tr isExpanded={isExpanded}>
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
            categoryCount={totalCount}
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
            categoryCount={totalHostCount}
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
            categoryCount={totalTaskCount}
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
