import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  TableComposable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ExpandableRowContent,
} from '@patternfly/react-table';

import { formatDateTime, formatJobType } from '../Utilities/helpers';
import JobStatus from './JobStatus';

const cols = ['Id/Name', 'Status', 'Cluster', 'Organization', 'Type'];

const Row = ({ job }) => {
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

const JobExplorerList = ({ jobs }) => {
  return (
    <TableComposable aria-label="Job Explorer Table" variant="compact">
      <Thead>
        <Tr>
          <Th />
          {cols.map((head, idx) => (
            <Th key={`col-${idx}`}>{head}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {jobs.map((job) => (
          <Row job={job} key={job.id.id} />
        ))}
      </Tbody>
    </TableComposable>
  );
};

Row.propTypes = {
  job: PropTypes.object.isRequired,
};

JobExplorerList.propTypes = {
  jobs: PropTypes.array.isRequired,
};

export default JobExplorerList;
