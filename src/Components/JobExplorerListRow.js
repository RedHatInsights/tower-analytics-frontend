import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Tr, Td, ExpandableRowContent } from '@patternfly/react-table';

import { formatDateTime, formatJobType } from '../Utilities/helpers';
import JobStatus from './JobStatus';

const JobExplorerListRow = ({ job }) => {
  const [expanded, setExpanded] = useState(false);
  const handleExpansion = () => {
    setExpanded(!expanded);
  };
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
        <Td noPadding={false} colSpan={2}>
          <ExpandableRowContent>
            <strong>Created:</strong> {formatDateTime(job.created)}
          </ExpandableRowContent>
        </Td>
        <Td noPadding={false} colSpan={2}>
          <ExpandableRowContent>
            <strong>Started:</strong> {formatDateTime(job.started)}
          </ExpandableRowContent>
        </Td>
        <Td noPadding={false} colSpan={2}>
          <ExpandableRowContent>
            <strong>Finished:</strong> {formatDateTime(job.finished)}
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
