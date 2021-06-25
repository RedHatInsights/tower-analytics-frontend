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
import { formatDateTime, formatJobType } from '../Utilities/helpers';
import { readJobExplorer } from '../Api';

import { Button, Modal } from '@patternfly/react-core';
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
  TableComposable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';

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

// const formatTopFailedStep = (data) => {
//   if (!data) {
//     return;
//   }

//   if (data && data[0]) {
//     const percentage = Math.ceil(
//       (data[0].failed_count / data[0].total_failed_count) * 100
//     );
//     return `${data[0].template_name} ${percentage}%`;
//   }

//   return `Unavailable`;
// };

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
    setSynchJobs,
  ] = useApi({ items: [] });
  const [
    {
      data: {
        items: [stats = 0],
      },
    },
    setStats,
    setSynchStats,
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
      setRelatedJobs(readJobExplorer({ params: relatedTemplateJobsParams }));
    }
  }, [selectedId]);

  const tableCols = ['Id/Name', 'Status', 'Cluster', 'Finished', 'Total time'];

  const categoryCount = stats
    ? {
        success: stats.successful_count,
        cancelled: stats.canceled_count,
        error: stats.error_count,
        failed: stats.failed_count,
        new: stats.new_count,
        pending: stats.pending_count,
        running: stats.running_count,
        waiting: stats.waiting_count,
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

  const descriptionStats = [
    {
      label: 'Number of runs',
      id: 'total-runs',
      value: stats.total_count ? stats.total_count : 'Unavailable',
    },
    {
      label: 'Total time',
      id: 'total-time',
      value: stats.elapsed ? formatTotalTime(stats.elapsed) : 'Unavailable',
    },
    {
      label: 'Average time',
      id: 'avg-time',
      value: stats.elapsed
        ? formatAvgRun(stats.elapsed, stats.total_count)
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
      value: !isNaN(stats.successful_count)
        ? formatSuccessRate(stats.successful_count, stats.total_count)
        : 'Unavailable',
    },
    {
      label: 'Most failed task',
      id: 'most-failed',
      value: stats.most_failed_tasks
        ? formatTopFailedTask(stats.most_failed_tasks)
        : 'Unavailable',
    },
  ];

  const cleanup = () => {
    setSynchStats({ items: [] });
    setSynchJobs({ items: [] });
    handleModal(false);
    handleCloseBtn(null);
  };

  return (
    <Modal
      aria-label="modal"
      width={'80%'}
      title={stats.name ? stats.name : 'no-template-name'}
      isOpen={isOpen}
      onClose={() => {
        cleanup();
      }}
    >
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
            <DescriptionListDescription>{value}</DescriptionListDescription>
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

      {relatedJobs.length <= 0 && <LoadingState />}
      {relatedJobs.length > 0 && (
        <TableComposable
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
            {relatedJobs.map((job, idx) => (
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
        </TableComposable>
      )}
      <ActionContainer>
        <Button
          key="cancel"
          variant="secondary"
          onClick={() => {
            cleanup();
          }}
        >
          Close
        </Button>

        <Button component="a" onClick={redirectToJobExplorer} variant="link">
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
