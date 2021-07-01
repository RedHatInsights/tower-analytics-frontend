import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Tr, Td, ExpandableRowContent } from '@patternfly/react-table';

import { formatDateTime, formatJobType } from '../Utilities/helpers';
import JobStatus from './JobStatus';
import {
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
} from '@patternfly/react-core';

const JobExplorerListRow = ({ job }) => {
  const [expanded, setExpanded] = useState(false);
  const handleExpansion = () => {
    setExpanded(!expanded);
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
