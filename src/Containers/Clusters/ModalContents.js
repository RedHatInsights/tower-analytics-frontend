import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LoadingState from '../../Components/ApiStatus/LoadingState';
import ApiErrorState from '../../Components/ApiStatus/ApiErrorState';
import NoResults from '../../Components/ApiStatus/NoResults';
import Breakdown from '../../Charts/Breakdown';
import JobStatus from '../../Components/JobStatus';
import { Paths } from '../../paths';
import {
  formatDateTime,
  formatJobType,
  formatTotalTime,
} from '../../Utilities/helpers';
import { readJobExplorer } from '../../Api';

import { Button, Modal, ModalVariant } from '@patternfly/react-core';
import {
  global_palette_blue_300,
  global_palette_green_200,
  global_palette_red_100,
  global_palette_black_850,
  global_palette_orange_300,
  global_palette_purple_300,
  global_palette_cyan_200,
  global_palette_light_green_200,
} from '@patternfly/react-tokens';

import {
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Divider,
} from '@patternfly/react-core';

import {
  Table /* data-codemods */,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import useRequest from '../../Utilities/useRequest';
import { DEFAULT_NAMESPACE, createUrl } from '../../QueryParams';
import { jobExplorer } from '../../Utilities/constants';
import { useNavigate } from 'react-router-dom';

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

const formatSuccessRate = (successCount, totalCount) =>
  Math.ceil((successCount / totalCount) * 100) + '%';
const formatAvgRun = (elapsed, totalCount) =>
  new Date(Math.ceil(elapsed / totalCount) * 1000).toISOString().substr(11, 8);

const ModalContents = ({ selectedId, isOpen, handleModal, qp, jobType }) => {
  const navigate = useNavigate();

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
    sort_options: 'created',
    sort_oder: 'desc',
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

  const {
    result: stats,
    request: fetchStats,
    ...statsApi
  } = useRequest(readJobExplorer, {});

  const {
    result: relatedJobs,
    request: fetchJobs,
    ...jobsApi
  } = useRequest(readJobExplorer, {});

  const navigateToJobExplorer = () => {
    const { start_date, end_date, quick_date_range } = qp;

    const initialQueryParams = {
      [DEFAULT_NAMESPACE]: {
        ...jobExplorer.defaultParams,
        template_id: [selectedId],
        status: [],
        job_type: [jobType],
        quick_date_range,
        start_date,
        end_date,
      },
    };
    navigate(
      createUrl(Paths.jobExplorer.replace('/', ''), true, initialQueryParams)
    );
  };

  useEffect(() => {
    fetchStats(agreggateTemplateParams);
    fetchJobs(relatedTemplateJobsParams);
  }, [selectedId]);

  const tableCols = ['Id/Name', 'Status', 'Cluster', 'Finished', 'Total time'];
  const statsData = (statsApi.isSuccess && stats?.items[0]) ?? null;
  const categoryCount = statsData
    ? {
        success: statsData.successful_count,
        cancelled: statsData.canceled_count,
        error: statsData.error_count,
        failed: statsData.failed_count,
        new: statsData.new_count,
        pending: statsData.pending_count,
        running: statsData.running_count,
        waiting: statsData.waiting_count,
      }
    : null;

  const categoryColor = {
    success: global_palette_green_200.value,
    cancelled: global_palette_black_850.value,
    error: global_palette_orange_300.value,
    failed: global_palette_red_100.value,
    new: global_palette_cyan_200.value,
    pending: global_palette_purple_300.value,
    running: global_palette_blue_300.value,
    waiting: global_palette_light_green_200.value,
  };

  const descriptionStats = statsData && [
    {
      label: 'Number of runs',
      id: 'total-runs',
      value: statsData.total_count ?? 'Unavailable',
    },
    {
      label: 'Total time',
      id: 'total-time',
      value: statsData.elapsed
        ? formatTotalTime(statsData.elapsed)
        : 'Unavailable',
    },
    {
      label: 'Average time',
      id: 'avg-time',
      value: statsData.elapsed
        ? formatAvgRun(statsData.elapsed, statsData.total_count)
        : 'Unavailable',
    },
    {
      label: 'Type',
      id: 'type',
      value: jobType ? formatJobType(jobType) : 'Unavailable',
    },
    {
      label: 'Success rate',
      id: 'success-rate',
      value: !isNaN(statsData.successful_count)
        ? formatSuccessRate(statsData.successful_count, statsData.total_count)
        : 'Unavailable',
    },
    {
      label: 'Most failed task',
      id: 'most-failed',
      value: statsData.most_failed_tasks
        ? formatTopFailedTask(statsData.most_failed_tasks)
        : 'Unavailable',
    },
  ];

  const cleanup = () => {
    handleModal(false);
  };

  return (
    <Modal
      aria-label="modal"
      variant={ModalVariant.medium}
      title={
        jobsApi.isSuccess &&
        statsApi.isSuccess &&
        stats?.items?.length > 0 &&
        (stats?.items[0]?.name ?? 'No template name')
      }
      isOpen={isOpen}
      onClose={cleanup}
      data-cy={'modal'}
    >
      {(statsApi.isLoading || jobsApi.isLoading) && <LoadingState />}
      {(statsApi.error || jobsApi.error) && (
        <ApiErrorState message={jobsApi.error.error} />
      )}
      {statsApi.isSuccess &&
        jobsApi.isSuccess &&
        relatedJobs?.items?.length <= 0 && <NoResults />}
      {statsApi.isSuccess &&
        jobsApi.isSuccess &&
        relatedJobs?.items?.length > 0 && (
          <>
            {categoryCount && (
              <Breakdown
                categoryCount={categoryCount}
                categoryColor={categoryColor}
              />
            )}

            <DescriptionList isHorizontal columnModifier={{ lg: '3Col' }}>
              {descriptionStats.map(({ label, id, value }) => (
                <DescriptionListGroup className={id} key={label}>
                  <DescriptionListTerm>{label}</DescriptionListTerm>
                  <DescriptionListDescription>
                    {value}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              ))}
            </DescriptionList>

            <Divider
              component="div"
              style={{ marginTop: '2rem', marginBottom: '1.5rem' }}
            />
            <p>
              <strong>Last 5 jobs</strong>
            </p>

            <Table
              aria-label="Template information table"
              variant="compact"
            >
              <Thead>
                <Tr>
                  {tableCols.map((heading, idx) => (
                    <Th key={idx}>{heading}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {relatedJobs.items.map((job, idx) => (
                  <Tr key={`job-detail-${idx}`}>
                    <Td>{`${job.id.id} - ${job.id.template_name}`}</Td>
                    <Td>
                      <JobStatus status={job.status} />
                    </Td>
                    <Td>{job.cluster_name}</Td>
                    <Td>{formatDateTime(job.finished)}</Td>
                    <Td>{formatTotalTime(job.elapsed)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </>
        )}

      <ActionContainer>
        <Button
          key="cancel"
          variant="secondary"
          onClick={() => {
            cleanup();
          }}
          data-cy={'modal_cancel_button'}
        >
          Close
        </Button>

        <Button
          component="a"
          onClick={navigateToJobExplorer}
          variant="link"
          data-cy={'modal_view_all_jobs_button'}
        >
          View all jobs
        </Button>
      </ActionContainer>
    </Modal>
  );
};

ModalContents.propTypes = {
  selectedId: PropTypes.number.isRequired,
  qp: PropTypes.object.isRequired,
  jobType: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleModal: PropTypes.func.isRequired,
};

export default ModalContents;
