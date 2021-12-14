import {
  global_palette_black_400,
  global_palette_blue_300,
  global_palette_gold_300,
  global_palette_green_300,
  global_palette_red_100,
} from '@patternfly/react-tokens';

export const jobExplorer = {
  defaultParams: {
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
      'most_failed_tasks',
      'host_count',
      'host_task_count',
      'failed_host_count',
      'unreachable_host_count',
      'changed_host_count',
      'ok_host_count',
      'skipped_host_count',
    ],
    status: ['successful', 'failed'],
    quick_date_range: 'last_30_days',
    job_type: ['workflowjob', 'job'],
    org_id: [],
    cluster_id: [],
    template_id: [],
    inventory_id: [],
    sort_options: 'created',
    sort_order: 'desc',
    only_root_workflows_and_standalone_jobs: false,
    limit: '5',
    offset: '0',
  },
};

export const roi = {
  defaultParams: {
    status: ['successful'],
    org_id: [],
    cluster_id: [],
    template_id: [],
    inventory_id: [],
    quick_date_range: 'roi_last_year',
    job_type: ['job'],
    sort_options: 'template_productivity_score',
    sort_order: 'desc',
    start_date: undefined,
    end_date: undefined,
    limit: '25',
    offset: '0',
    only_root_workflows_and_standalone_jobs: true,
    attributes: [
      'elapsed',
      'host_count',
      'total_count',
      'total_org_count',
      'total_cluster_count',
      'successful_hosts_total',
      'successful_elapsed_total',
    ],
    group_by: 'template',
    group_by_time: false,
  },
};

export const organizationStatistics = {
  defaultParams: {
    status: [],
    org_id: [],
    quick_date_range: 'last_30_days',
    limit: '5',
    offset: '0',
    job_type: ['workflowjob', 'job'],
    cluster_id: [],
    template_id: [],
    inventory_id: [],
    start_date: null,
    end_date: null,
  },
};

export const clusters = {
  defaultParams: {
    status: ['successful', 'failed'],
    quick_date_range: 'last_30_days',
    job_type: ['workflowjob', 'job'],
    group_by_time: true,
    org_id: [],
    cluster_id: [],
    template_id: [],
    inventory_id: [],
    only_root_workflows_and_standalone_jobs: false,
  },
};

export const savingsPlanner = {
  defaultParams: {
    inventory_id: [],
    automation_status: [],
    category: [],
    frequency_period: [],
    name: '',
    limit: '10',
    offset: '0',
    sort_options: 'modified',
    sort_order: 'desc',
  },
};

export const notAuthorizedParams = {
  title: 'RBAC Access Denied',
  description:
    'User does not have privileges to perform this action. Contact your organization adminstrator(s) for more information.',
};

export const categoryColor = {
  ok: global_palette_green_300.value,
  passed: global_palette_green_300.value,
  unreachable: global_palette_black_400.value,
  unfinished: global_palette_black_400.value,
  changed: global_palette_gold_300.value,
  error: global_palette_black_400.value,
  failed: global_palette_red_100.value,
  skipped: global_palette_blue_300.value,
};
