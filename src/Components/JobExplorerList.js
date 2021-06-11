import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  DataListCell as PFDataListCell,
  DataListContent,
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells as PFDataListItemCells,
  DataListToggle as PFDataListToggle,
  Tooltip,
} from '@patternfly/react-core';

import { 
  TableComposable, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  ExpandableRowContent 
} from '@patternfly/react-table';

import { ExternalLinkAltIcon as PFExternalLinkIcon } from '@patternfly/react-icons';

import LoadingState from '../Components/LoadingState';
import { formatDateTime, formatJobType } from '../Utilities/helpers';
import JobStatus from './JobStatus';

const cols = ["Id/Name", "Status", "Cluster", "Organization", "Type"];

const JobExplorerList = ({ jobs }) => {
  const [expanded, setExpanded] = useState(Array(jobs.length).fill(false));
  const handleExpansion = (event, idx) => {
    setExpanded({
      ...expanded,
      [idx]: !expanded[idx]
    });
  }
  let rowIdx = -2

  return (
    <TableComposable aria-label="Job Explorer Table" variant="compact">
      <Thead>
        <Tr> 
          <Th />
          {
            cols.map((head, idx) => (
              <Th key={`col-${idx}`}>{head}</Th>
            ))
          }
        </Tr>
      </Thead>
      <Tbody>
        {
          jobs.map((job, idx) => {
            rowIdx += 2;

            return (
              <React.Fragment key={idx}>
                <Tr key={rowIdx}>
                  <Td key={`row-${rowIdx}_0`} 
                    expand={{
                      rowIndex: idx,
                      isExpanded: expanded[idx],
                      onToggle: handleExpansion
                    }}
                  />
                  <Td href={job.id.tower_link}>{`${job.id.id} - ${job.id.template_name}`}</Td>
                  <Td><JobStatus status={job.status} /></Td>
                  <Td>{job.cluster_name}</Td>
                  <Td>{job.org_name}</Td>
                  <Td>{formatJobType(job.job_type)}</Td>
                </Tr>
                <Tr key={rowIdx + 1} isExpanded={expanded[idx] === true}>
                  <Td key={`row-${rowIdx + 1}_0`} />
                  <Td key={`row-${rowIdx + 1}_1`} noPadding={false} colSpan={2}>
                    <ExpandableRowContent><strong>Created:</strong> {formatDateTime(job.created)}</ExpandableRowContent>
                  </Td>
                  <Td key={`row-${rowIdx + 1}_2`} noPadding={false} colSpan={2}>
                    <ExpandableRowContent><strong>Started:</strong> {formatDateTime(job.started)}</ExpandableRowContent>
                  </Td>
                  <Td key={`row-${rowIdx + 1}_3`} noPadding={false} colSpan={2}>
                    <ExpandableRowContent><strong>Finished:</strong> {formatDateTime(job.finished)}</ExpandableRowContent>
                  </Td>
                </Tr>
              </React.Fragment>
            )
          })
        }
      </Tbody>
    </TableComposable>
  );
};

JobExplorerList.propTypes = {
  jobs: PropTypes.array,
  windowWidth: PropTypes.number,
};

export default JobExplorerList;
