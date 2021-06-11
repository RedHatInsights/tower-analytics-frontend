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

const headerLabels = ['Id/Name', 'Status', 'Cluster', 'Organization', 'Type'];

const ExternalLinkIcon = styled(PFExternalLinkIcon)`
  margin-left: 7px;
  color: var(--pf-global--Color--400);
`;

const DataListCell = styled(PFDataListCell)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
`;

const DataListCellHeader = styled(DataListCell)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: bold;
`;

const DataListItemCells = styled(PFDataListItemCells)`
  align-items: center;
`;

const DataListToggle = styled(PFDataListToggle)`
  align-items: center;
`;

const mobileBreakpoint = 765;

const buildHeader = (labels) => (
  <DataListItem>
    <DataListItemRow style={{ paddingLeft: '80px' }}>
      <DataListItemCells
        dataListCells={labels.map((label) => (
          <DataListCellHeader key={label}>
            {label}
            {label === 'Id/Name' && <ExternalLinkIcon />}
          </DataListCellHeader>
        ))}
      />
    </DataListItemRow>
  </DataListItem>
);

const buildListRow = (items, ariaLabel, ariaLabelledBy, windowWidth) => {
  const [isExpanded, setIsExpanded] = useState([]);

  return (
    <>
      {items.map((item, count) => {
        const toggle = (id) => {
          const expanded = isExpanded;
          const idx = expanded.indexOf(id);
          const newExpanded =
            idx >= 0
              ? [
                  ...expanded.slice(0, idx),
                  ...expanded.slice(idx + 1, expanded.length),
                ]
              : [...expanded, id];
          setIsExpanded(newExpanded);
        };

        return (
          <DataListItem
            key={item.id.id}
            aria-labelledby={ariaLabelledBy}
            isExpanded={isExpanded.includes(`${item.id.id}-toggle`)}
          >
            <DataListItemRow key={item.id.id}>
              <DataListToggle
                id={`${item.id.id}-toggle`}
                aria-controls={`${item.id.id}-expand`}
                onClick={() => toggle(`${item.id.id}-toggle`)}
                isExpanded={isExpanded.includes(`${item.id.id}-toggle`)}
              />
              <DataListItemCells
                dataListCells={[
                  <DataListCell key={count++}>
                    <a
                      href={item.id.tower_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {windowWidth < mobileBreakpoint && (
                        <span style={{ color: 'initial', fontWeight: 'bold' }}>
                          Id/Name
                          <ExternalLinkIcon />:
                        </span>
                      )}
                      &nbsp;
                      {`${item.id.id} - ${item.id.template_name}`}
                    </a>
                  </DataListCell>,
                  <DataListCell key={count++}>
                    {windowWidth <= mobileBreakpoint && (
                      <span style={{ color: 'initial', fontWeight: 'bold' }}>
                        Status:
                      </span>
                    )}
                    &nbsp;
                    <JobStatus status={item.status} />
                  </DataListCell>,
                  <Tooltip key={count++} content={<p>{item.cluster_name}</p>}>
                    <DataListCell>
                      {windowWidth <= mobileBreakpoint && (
                        <span style={{ color: 'initial', fontWeight: 'bold' }}>
                          Cluster:
                        </span>
                      )}
                      &nbsp;
                      {item.cluster_name}
                    </DataListCell>
                  </Tooltip>,
                  <DataListCell key={count++}>
                    {windowWidth <= mobileBreakpoint && (
                      <span style={{ color: 'initial', fontWeight: 'bold' }}>
                        Organization:
                      </span>
                    )}
                    &nbsp;
                    {item.org_name}
                  </DataListCell>,
                  <DataListCell key={count++}>
                    {windowWidth <= mobileBreakpoint && (
                      <span style={{ color: 'initial', fontWeight: 'bold' }}>
                        Type:
                      </span>
                    )}
                    &nbsp;
                    {formatJobType(item.job_type)}
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
            <DataListContent
              aria-label={`${item.id.id}-details`}
              id={'${item.id.id}'}
              isHidden={!isExpanded.includes(`${item.id.id}-toggle`)}
            >
              <DataListItemCells
                dataListCells={[
                  <DataListCell key={count++}>
                    Created: {formatDateTime(item.created)}
                  </DataListCell>,
                  <DataListCell key={count++}>
                    Started: {formatDateTime(item.started)}
                  </DataListCell>,
                  <DataListCell key={count++}>
                    Finished: {formatDateTime(item.finished)}
                  </DataListCell>,
                ]}
              />
            </DataListContent>
          </DataListItem>
        );
      })}
    </>
  );
};

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
