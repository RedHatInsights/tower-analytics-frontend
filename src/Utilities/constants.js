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
        'most_failed_tasks'
    ],
    defaultParams: {
        status: [ 'successful', 'failed' ],
        quick_date_range: 'last_30_days',
        job_type: [ 'workflowjob', 'job' ],
        org_id: [],
        cluster_id: [],
        template_id: [],
        sort_by: 'created:desc',
        start_date: null,
        end_date: null,
        only_root_workflows_and_standalone_jobs: false,
        limit: 5
    }
};

export const roi = {
    defaultParams: {
        status: [ 'successful' ],
        org_id: [],
        cluster_id: [],
        template_id: [],
        quick_date_range: 'roi_last_month',
        job_type: [ 'job' ],
        sort_by: 'host_count:desc',
        start_date: null,
        end_date: null,
        limit: 5,
        only_root_workflows_and_standalone_jobs: true,
        attributes: [
            'elapsed',
            'host_count',
            'host_task_count',
            'total_org_count',
            'total_cluster_count'
        ],
        group_by: 'template',
        group_by_time: false,
        granularity: 'monthly'
    }
};
