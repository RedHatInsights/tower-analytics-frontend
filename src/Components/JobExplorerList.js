import React from 'react';
import PropTypes from 'prop-types';

import { TableComposable, Thead, Tbody, Tr, Th } from '@patternfly/react-table';
import JobExplorerListRow from './JobExplorerListRow';

const cols = ['Id/Name', 'Status', 'Cluster', 'Organization', 'Type'];

const JobExplorerList = ({ jobs }) => {
  console.log(jobs);
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
          <JobExplorerListRow job={job} key={job.id.id} />
        ))}
      </Tbody>
    </TableComposable>
  );
};

JobExplorerList.propTypes = {
  jobs: PropTypes.array.isRequired,
};

export default JobExplorerList;
