import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LoadingState from '../Components/LoadingState';
import Breakdown from '../Components/Breakdown';
import JobStatus from '../Components/JobStatus';
import { Paths } from '../paths';
import { stringify } from 'query-string';
import useApi from '../Utilities/useApi';
import { formatDateTime, formatSeconds } from '../Utilities/helpers';
import { readJobExplorer } from '../Api';

import {
  Button,
  DataList,
  DataListItem as PFDataListItem,
  DataListCell as PFDataListCell,
  Label,
  Modal,
} from '@patternfly/react-core';

import {
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Divider
} from '@patternfly/react-core';

import { 
  TableComposable, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td 
} from '@patternfly/react-table';

import { CircleIcon } from '@patternfly/react-icons';

const success = (
  <CircleIcon
    size="sm"
    key="5"
    style={{ color: 'rgb(110, 198, 100)', marginRight: '5px' }}
  />
);
const fail = (
  <>
    <CircleIcon
      size="sm"
      key="5"
      style={{ color: 'rgb(163, 0, 0)', marginRight: '5px' }}
    />
    <span id="fail-icon">!</span>
  </>
);
const DataListCell = styled(PFDataListCell)`
  --pf-c-data-list__cell-cell--MarginRight: 0;
`;

const DataListItem = styled(PFDataListItem)`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 0 15px 10px 15px;
  justify-content: center;
  align-items: center;
`;

const DataCellEnd = styled(DataListCell)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
const PFDataListItemNoBorder = styled(PFDataListItem)`
  border-bottom: none;
  margin-bottom: -20px;
`;
const DataListItemCompact = styled(DataListItem)`
  padding: 0;
  > .pf-c-data-list__cell {
    font-weight: 600;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const DataListCellCompact = styled(DataListCell)`
  padding: 7px;
`;

const DataListFocus = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-gap: 10px;
  padding: var(--pf-global--spacer--lg);
  background: #ebebeb;
  border: 1px solid #ccc;
  border-top: none;
  margin-bottom: 20px;
`;
const DataCellEndCompact = styled(DataCellEnd)`
  padding: 7px !important;
`;

const ActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
`;

const formatTopFailedTask = (data) => {
  if (!data) {
    return;
  }

  if (data && data[0]) {
    const percentage = Math.ceil(
      (data[0].failed_count / data[0].total_failed_count) * 100
    );
    return `${data[0].task_name} ${percentage}%`;
  }

  return `Unavailable`;
};

const formatTopFailedStep = (data) => {
  if (!data) {
    return;
  }

  if (data && data[0]) {
    const percentage = Math.ceil(
      (data[0].failed_count / data[0].total_failed_count) * 100
    );
    return `${data[0].template_name} ${percentage}%`;
  }

  return `Unavailable`;
};

const formatSuccessRate = (successCount, totalCount) =>
  Math.ceil((successCount / totalCount) * 100) + '%';
const formatAvgRun = (elapsed, totalCount) =>
  new Date(Math.ceil(elapsed / totalCount) * 1000).toISOString().substr(11, 8);
const formatTotalTime = (elapsed) =>
  new Date(elapsed * 1000).toISOString().substr(11, 8);

const ModalContents = ({
  selectedId,
  isOpen,
  handleModal,
  qp,
  jobType,
  handleCloseBtn,
}) => {
  const [
    {
      data: { items: relatedJobs = [] },
    },
    setRelatedJobs,
  ] = useApi({ items: [] });
  const [
    {
      data: {
        items: [stats = 0],
      },
    },
    setStats,
  ] = useApi({ items: [] });

  let history = useHistory();

  const redirectToJobExplorer = () => {
    const { jobExplorer } = Paths;
    const initialQueryParams = {
      template_id: [selectedId],
      status: [
        'successful',
        'failed',
        'new',
        'pending',
        'waiting',
        'error',
        'canceled',
        'running',
      ],
      job_type: [jobType],
      quick_date_range: 'last_30_days',
    };

    const search = stringify(initialQueryParams, { arrayFormat: 'bracket' });
    history.push({
      pathname: jobExplorer,
      search,
    });
  };

  const relatedTemplateJobsParams = {
    ...qp,
    template_id: [selectedId],
    attributes: [
      'id',
      'status',
      'job_type',
      'started',
      'finished',
      'elapsed',
      'created',
      'cluster_name',
      'org_name',
    ],
    group_by_time: false,
    limit: 5,
    sort_by: 'created:desc',
    quick_date_range: qp.quick_date_range
      ? qp.quick_date_range
      : 'last_30_days',
    job_type: [jobType],
  };

  const agreggateTemplateParams = {
    group_by: 'template',
    template_id: [selectedId],
    attributes: [
      'elapsed',
      'job_type',
      'successful_count',
      'failed_count',
      'error_count',
      'waiting_count',
      'pending_count',
      'canceled_count',
      'new_count',
      'running_count',
      'total_count',
      jobType === 'job' ? 'most_failed_tasks' : 'most_failed_steps',
    ],
    status: qp.status,
    quick_date_range: qp.quick_date_range
      ? qp.quick_date_range
      : 'last_30_days',
    job_type: [jobType],
  };

  useEffect(() => {
    if (selectedId) {
      setStats(readJobExplorer({ params: agreggateTemplateParams }));
      setRelatedJobs(readJobExplorer({ params: relatedTemplateJobsParams }))
    }
  }, [selectedId]);

  const tableCols = [
    'Id/Name',
    'Status',
    'Cluster',
    'Finished',
    'Total time'
  ]

  let categoryCount;
  if (stats == null || stats == 0) {
    categoryCount = null;
  } else {
    categoryCount = {
      success: stats.successful_count,
      cancelled: stats.canceled_count,
      error: stats.error_count,
      failed: stats.failed_count,
      new: stats.new_count,
      pending: stats.pending_count,
      running: stats.running_count,
      waiting: stats.waiting_count
    }
  }

  const categoryColor = {
    success: "#95D58E",
    cancelled: "#2C0000",
    error: "#EF9234",
    failed: "#C9190B",
    new: "#8476D1",
    pending: "#73C5C5",
    running: "#2B9AF3",
    waiting: "#35CAED"
  }

  return (
    <Modal
      aria-label="modal"
      width={'80%'}
      title={stats.name ? stats.name : 'no-template-name'}
      isOpen={isOpen}
      onClose={() => {
        handleModal(false);
        handleCloseBtn(null);
      }}
    >
      {
        categoryCount && <Breakdown categoryCount={categoryCount} categoryColor={categoryColor}/>
      }

      <DescriptionList isHorizontal columnModifier={{ lg: '3Col' }}>
        <DescriptionListGroup>
          <DescriptionListTerm>Number of runs</DescriptionListTerm>
          <DescriptionListDescription>{stats.total_count ? stats.total_count : 'Unavailable'}</DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>Total time</DescriptionListTerm>
          <DescriptionListDescription>{stats.elapsed ? formatTotalTime(stats.elapsed) : 'Unavailable'}</DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>Average time</DescriptionListTerm>
          <DescriptionListDescription>
            {stats.elapsed
              ? formatAvgRun(stats.elapsed, stats.total_count)
              : 'Unavailable'}
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>Type</DescriptionListTerm>
          <DescriptionListDescription>
            {stats.id 
              ? `${stats.id} (idk here)`
              : 'Unavailable'
            }
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>Success rate</DescriptionListTerm>
          <DescriptionListDescription>
            {!isNaN(stats.successful_count)
              ? formatSuccessRate(stats.successful_count, stats.total_count)
              : 'Unavailable'}
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>Most failed task</DescriptionListTerm>
          <DescriptionListDescription>
            {stats.most_failed_tasks
              ? formatTopFailedTask(stats.most_failed_tasks)
              : 'Unavailable'}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
      
      <Divider component="div" style={{marginTop: '2rem', marginBottom: '1.5rem'}}/>
      <p><strong>Last 5 jobs</strong></p>

      {relatedJobs.length <= 0 && <LoadingState />}
      {relatedJobs.length > 0 && (
        <TableComposable aria-label='Template information table' variant="compact">
          <Thead>
            <Tr>
              {
                tableCols.map((heading, idx) => (
                  <Th key={idx}>{heading}</Th>
                ))
              }
            </Tr>
          </Thead>
            <Tbody>
              {
                relatedJobs.map((job, idx) => (
                  <Tr key={`job-detail-${idx}`}>
                    <Td>{`${job.id.id} - ${job.id.template_name}`}</Td>
                    <Td><JobStatus status={job.status} /></Td>
                    <Td>{job.cluster_name}</Td>
                    <Td>{formatDateTime(job.finished)}</Td>
                    <Td>{formatTotalTime(job.elapsed)}</Td>
                  </Tr>
                ))
              }
            </Tbody>
        </TableComposable>
      )}
      <ActionContainer>
        <Button
          key="cancel"
          variant="secondary"
          onClick={() => {
            handleModal(false);
            handleCloseBtn(null);
          }}
        >
          Close
        </Button>

        <Button
          component="a"
          onClick={redirectToJobExplorer}
          variant="link"
        >
          View all jobs
        </Button>
      </ActionContainer>
    </Modal>
  );
};

ModalContents.propTypes = {
  selectedId: PropTypes.number,
  qp: PropTypes.object,
  jobType: PropTypes.string,
  handleCloseBtn: PropTypes.func,
  isOpen: PropTypes.bool,
  handleModal: PropTypes.func,
};

export default ModalContents;
