import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { TableComposable, Thead, Tbody, Tr, Th } from '@patternfly/react-table';
import JobExplorerListRow from './JobExplorerListRow';

const cols = ['Id/Name', 'Status', 'Cluster', 'Organization', 'Type'];

const sortMap = {
  'Id/Name': 'id',
  Status: 'status',
  Type: 'job_type',
};

const reverseSortMap = {
  id: 0,
  status: 1,
  job_type: 4,
};

const JobExplorerList = ({ jobs, queryParams, queryParamsDispatch }) => {
  const [sortIdx, setSortIdx] = useState(-1);
  const [sortDir, setSortDir] = useState('none');

  if (queryParams?.sort_options in reverseSortMap) {
    setSortIdx(reverseSortMap[queryParams.sort_options]);
    setSortDir(queryParams?.sort_order);
    console.log(sortIdx);
    console.log(sortDir);
  }

  const onSort = (_event, idx, dir) => {
    if (idx !== sortIdx) {
      setSortIdx(idx);
      queryParamsDispatch({
        type: 'SET_SORT_OPTIONS',
        value: { sort_options: sortMap[cols[idx]] },
      });
    }

    if (dir !== sortDir) {
      setSortDir(dir);
      queryParamsDispatch({
        type: 'SET_SORT_ORDER',
        value: { sort_order: dir },
      });
    }
  };

  return (
    <TableComposable aria-label="Job Explorer Table" variant="compact">
      <Thead>
        <Tr>
          <Th />
          {cols.map((head, idx) => {
            const params =
              head in sortMap
                ? {
                    sort: {
                      sortBy: {
                        index: sortIdx,
                        direction: sortDir,
                      },
                      onSort,
                      columnIndex: idx,
                    },
                  }
                : {};
            return (
              <Th key={`col-${idx}`} {...params}>
                {head}
              </Th>
            );
          })}
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
  queryParams: PropTypes.object.isRequired,
  queryParamsDispatch: PropTypes.func.isRequired,
};

export default JobExplorerList;
