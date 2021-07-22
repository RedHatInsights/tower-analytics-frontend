import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Tr, Td, ExpandableRowContent } from '@patternfly/react-table';

import { formatDateTime, formatJobType } from '../Utilities/helpers';
import JobStatus from './JobStatus';
import Breakdown from './Breakdown';
import {
  global_palette_green_300,
  global_palette_black_850,
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
} from '@patternfly/react-core';

const JobExplorerListRow = ({ job }) => {
  const [expanded, setExpanded] = useState(false);
  const handleExpansion = () => {
    setExpanded(!expanded);
  };

  const categoryCount = job
    ? {
        ok: job?.ok_host_count ? job.ok_host_count : 0,
        skipped: job?.skipped_host_count ? job.skipped_host_count : 0,
        changed: job?.changed_host_count ? job.changed_host_count : 0,
        failed: job?.failed_host_count ? job.failed_host_count : 0,
        unreachable: job?.unreachable_host_count
          ? job.unreachable_host_count
          : 0,
      }
    : null;

  const categoryColor = {
    ok: global_palette_green_300.value,
    unreachable: global_palette_black_850.value,
    changed: global_palette_gold_300.value,
    failed: global_palette_red_100.value,
    skipped: global_palette_blue_300.value,
  };

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
        <Td
          href={job.id.tower_link}
        >{`${job.id.id} - ${job.id.template_name}`}</Td>
        <Td>
          <JobStatus status={job.status} />
        </Td>
        <Td>{job.cluster_name}</Td>
        <Td>{job.org_name}</Td>
        <Td>{formatJobType(job.job_type)}</Td>
      </Tr>
      <Tr isExpanded={expanded}>
        <Td colSpan={6}>
          <ExpandableRowContent>
            <Flex>
              <FlexItem>
                <strong>Host status</strong>
              </FlexItem>
              <FlexItem align={{ default: 'alignRight' }}>
                <strong>Tasks</strong>
                {'  '}
                {job?.host_task_count ? job.host_task_count : 0}
              </FlexItem>
              <FlexItem>
                <strong>Hosts</strong>
                {'  '}
                {job?.host_count ? job.host_count : 0}
              </FlexItem>
            </Flex>
            <Breakdown
              categoryCount={categoryCount}
              categoryColor={categoryColor}
              showPercent
            />
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
