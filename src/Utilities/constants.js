export const jobExplorer = {
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
  ],
  defaultParams: {
    status: ['successful', 'failed'],
    quick_date_range: 'last_30_days',
    job_type: ['workflowjob', 'job'],
    org_id: [],
    cluster_id: [],
    template_id: [],
    inventory_id: [],
    sort_by: 'created:desc',
    sort_options: 'created',
    sort_order: 'desc',
    only_root_workflows_and_standalone_jobs: false,
    limit: 5,
    offset: 0,
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
    start_date: null,
    end_date: null,
    limit: 25,
    only_root_workflows_and_standalone_jobs: true,
    attributes: [
      'successful_hosts_total',
      'successful_elapsed_total',
      'total_org_count',
      'total_cluster_count',
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
    limit: 5,
    offset: 0,
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
    template_id: [],
    inventory_id: [],
    automation_status: [],
    category: [],
    frequency_period: [],
    name: '',
    limit: 10,
    offset: 0,
    sort_options: 'modified',
    sort_order: 'desc',
    sort_by: 'modified:desc',
  }
};

export const notAuthorizedParams = {
  title: 'RBAC Access Denied',
  description:
    'User does not have privileges to perform this action. Contact your organization adminstrator(s) for more information.',
};
