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

const JobExplorerList = ({ jobs }) => {
  const [expanded, setExpanded] = useState(Array(jobs.length).fill(false));
  const handleExpansion = (event, idx) => {
    setExpanded({
      ...expanded,
      [idx]: !expanded[idx],
    });
  };

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
        {jobs.map((job, idx) => (
          <React.Fragment key={job.id.id}>
            <Tr>
              <Td
                expand={{
                  rowIndex: idx,
                  isExpanded: expanded[idx],
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
            <Tr isExpanded={expanded[idx] === true}>
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
          </React.Fragment>
        ))}
      </Tbody>
    </TableComposable>
  );
};

JobExplorerList.propTypes = {
  jobs: PropTypes.array,
  windowWidth: PropTypes.number,
};

export default JobExplorerList;
