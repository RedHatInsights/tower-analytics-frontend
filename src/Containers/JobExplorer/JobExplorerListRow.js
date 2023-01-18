import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Tr, Td, ExpandableRowContent } from '@patternfly/react-table';

import { formatDateTime, formatJobType } from '../../Utilities/helpers';
import JobStatus from '../../Components/JobStatus';
import Breakdown from '../../Charts/Breakdown';
import {
  global_palette_green_300,
  global_palette_black_400,
  global_palette_gold_300,
  global_palette_red_100,
  global_palette_blue_300,
} from '@patternfly/react-tokens';
import {
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Button,
} from '@patternfly/react-core';

const categoryColor = {
  ok: global_palette_green_300.value,
  passed: global_palette_green_300.value,
  unreachable: global_palette_black_400.value,
  changed: global_palette_gold_300.value,
  failed: global_palette_red_100.value,
  skipped: global_palette_blue_300.value,
};

const renderMoreButton = (showMore, setShowMore) => {
  return (
    <Flex className="pf-u-mb-md">
      <FlexItem align={{ default: 'alignRight' }}>
        <Button
          variant="secondary"
          onClick={() => {
            setShowMore(!showMore);
          }}
          fullWidth={{ default: 'fullWidth' }}
        >
          {showMore ? 'Show less' : 'Show more'}
        </Button>
      </FlexItem>
    </Flex>
  );
};

const renderFailedTaskBar = (failed_tasks) => {
  const [showMore, setShowMore] = useState(false);

  if (failed_tasks != null) {
    return (
      <>
        <p>
          <strong>Top failed tasks</strong>
        </p>

        <Grid hasGutter>
          {failed_tasks
            .slice(0, showMore ? failed_tasks.length : 2)
            .map((task, idx) => {
              const categoryCount = {
                passed: task?.passed_host_count ?? 0,
                failed: task?.failed_host_count ?? 0,
                unreachable: task?.unreachable_host_count ?? 0,
              };

              return (
                <GridItem lg={6} md={12} key={`most-failed-${idx}`}>
                  <Flex>
                    <FlexItem>
                      <strong>Task name </strong> {task?.task_name}
                    </FlexItem>

                    <FlexItem align={{ default: 'alignRight' }}>
                      <strong>Module name </strong> {task?.module_name}
                    </FlexItem>
                  </Flex>
                  <Breakdown
                    categoryCount={categoryCount}
                    categoryColor={categoryColor}
                    showPercent
                  />
                </GridItem>
              );
            })}
        </Grid>

        {failed_tasks.length > 2
          ? renderMoreButton(showMore, setShowMore)
          : null}
      </>
    );
  }
};

const JobExplorerListRow = ({ job }) => {
  const [expanded, setExpanded] = useState(false);
  const handleExpansion = () => {
    setExpanded(!expanded);
  };

  const categoryCount = job
    ? {
        ok: job?.ok_host_count ?? 0,
        skipped: job?.skipped_host_count ?? 0,
        changed: job?.changed_host_count ?? 0,
        failed: job?.failed_host_count ?? 0,
        unreachable: job?.unreachable_host_count ?? 0,
      }
    : null;

  const expandedInfo = [
    {
      label: 'Created',
      value: job.created ? formatDateTime(job.created) : 'Unavailable',
    },
    {
      label: 'Started',
      value: job.created ? formatDateTime(job.started) : 'Unavailable',
    },
    {
      label: 'Finished',
      value: job.created ? formatDateTime(job.finished) : 'Unavailable',
    },
    {
      label: 'Tasks',
      value: job.host_task_count ?? 0,
    },
  ];

  return (
    <>
      <Tr>
        <Td
          expand={{
            rowIndex: job.id.id,
            isExpanded: expanded,
            onToggle: handleExpansion,
          }}
        />
        <Td>
          <a
            href={job.id.tower_link}
            target="_blank"
            rel="noreferrer"
          >{`${job.id.id} - ${job.id.template_name}`}</a>
        </Td>
        <Td>
          <JobStatus status={job?.status} />
        </Td>
        <Td>{job?.cluster_name}</Td>
        <Td>{job?.org_name}</Td>
        <Td>{formatJobType(job?.job_type)}</Td>
      </Tr>
      <Tr isExpanded={expanded}>
        <Td colSpan={6}>
          <ExpandableRowContent>
            <Flex>
              <FlexItem>
                <strong>Host status</strong>
              </FlexItem>
              <FlexItem align={{ default: 'alignRight' }}>
                <strong>Hosts</strong>
                {'  '}
                {job?.host_count ?? 0}
              </FlexItem>
            </Flex>
            <Breakdown
              categoryCount={categoryCount}
              categoryColor={categoryColor}
              showPercent
            />
            {renderFailedTaskBar(job.most_failed_tasks)}

            <DescriptionList isHorizontal columnModifier={{ lg: '3Col' }}>
              {expandedInfo.map(({ label, value }) => (
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
    </>
  );
};

JobExplorerListRow.propTypes = {
  job: PropTypes.object.isRequired,
};

export default JobExplorerListRow;
