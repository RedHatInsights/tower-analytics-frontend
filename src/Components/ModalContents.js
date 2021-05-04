import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LoadingState from '../Components/LoadingState';
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
      setRelatedJobs(readJobExplorer({ params: relatedTemplateJobsParams }));
    }
  }, [selectedId]);

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
      actions={[
        <Button
          key="cancel"
          variant="secondary"
          onClick={() => {
            handleModal(false);
            handleCloseBtn(null);
          }}
        >
          Close
        </Button>,
      ]}
    >
      <DataList aria-label="Selected Template Details">
        <PFDataListItemNoBorder aria-labelledby="Selected Template Statistics">
          <DataListFocus>
            <div aria-labelledby="job runs">
              <b style={{ marginRight: '10px' }}>Number of runs</b>
              {stats.total_count ? stats.total_count : 'Unavailable'}
            </div>
            <div aria-labelledby="total time">
              <b style={{ marginRight: '10px' }}>Total time</b>
              {stats.elapsed ? formatTotalTime(stats.elapsed) : 'Unavailable'}
            </div>
            <div aria-labelledby="Avg Time">
              <b style={{ marginRight: '10px' }}>Avg time</b>
              {stats.elapsed
                ? formatAvgRun(stats.elapsed, stats.total_count)
                : 'Unavailable'}
            </div>
            <div aria-labelledby="success rate">
              <b style={{ marginRight: '10px' }}>Success rate</b>
              {!isNaN(stats.successful_count)
                ? formatSuccessRate(stats.successful_count, stats.total_count)
                : 'Unavailable'}
            </div>
            {stats.most_failed_tasks && (
              <div aria-labelledby="most failed task">
                <b style={{ marginRight: '10px' }}>Most failed task</b>
                {stats.most_failed_tasks
                  ? formatTopFailedTask(stats.most_failed_tasks)
                  : 'Unavailable'}
              </div>
            )}
            {stats.most_failed_steps && (
              <div aria-labelledby="most failed step">
                <b style={{ marginRight: '10px' }}>Most failed step</b>
                {stats.most_failed_steps
                  ? formatTopFailedStep(stats.most_failed_steps)
                  : 'Unavailable'}
              </div>
            )}
          </DataListFocus>
        </PFDataListItemNoBorder>
        <DataListItemCompact>
          <DataListCellCompact key="last5jobs">
            <Label variant="outline">Last 5 jobs</Label>
          </DataListCellCompact>
          ,
          <DataCellEndCompact>
            <Button
              component="a"
              onClick={redirectToJobExplorer}
              variant="link"
            >
              View all jobs
            </Button>
          </DataCellEndCompact>
        </DataListItemCompact>
        <DataListItemCompact aria-labelledby="datalist header">
          <PFDataListCell key="job heading">Id/Name</PFDataListCell>
          <PFDataListCell key="cluster heading">Cluster</PFDataListCell>
          <PFDataListCell key="start time heading">Start Time</PFDataListCell>
          <PFDataListCell key="total time heading">Total Time</PFDataListCell>
        </DataListItemCompact>
        {relatedJobs.length <= 0 && <LoadingState />}
        {relatedJobs.length > 0 &&
          relatedJobs.map((job, index) => (
            <DataListItem
              style={{ padding: '10px 0' }}
              key={`job-details-${index}`}
              aria-labelledby="job details"
            >
              <PFDataListCell key="job name">
                {job.status === 'successful' ? success : fail} {job.id.id} -{' '}
                {job.id.template_name}
              </PFDataListCell>
              <PFDataListCell key="job cluster">
                {job.cluster_name}
              </PFDataListCell>
              <PFDataListCell key="start time">
                {formatDateTime(job.started)}
              </PFDataListCell>
              <PFDataListCell key="total time">
                {formatSeconds(job.elapsed)}
              </PFDataListCell>
            </DataListItem>
          ))}
      </DataList>
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
