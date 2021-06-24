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
  const [expanded, setExpanded] = useState(
    jobs.reduce((obj, job) => {
      obj[job.id.id] = false;
      return obj;
    }, {})
  );
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
        {jobs.map((job) => (
          <React.Fragment key={job.id.id}>
            <Tr>
              <Td
                expand={{
                  rowIndex: job.id.id,
                  isExpanded: expanded[job.id.id],
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
            <Tr isExpanded={expanded[job.id.id] === true}>
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
