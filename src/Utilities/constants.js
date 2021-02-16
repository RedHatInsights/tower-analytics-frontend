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
        sort_by: 'created',
        sort_order: ':desc',
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
        quick_date_range: 'roi_last_year',
        job_type: [ 'job' ],
        sort_by: 'template_productivity_score',
        sort_order: ':desc',
        start_date: null,
        end_date: null,
        limit: 25,
        only_root_workflows_and_standalone_jobs: true,
        attributes: [
            'successful_hosts_total',
            'successful_elapsed_total',
            'total_org_count',
            'total_cluster_count'
        ],
        group_by: 'template',
        group_by_time: false,
        granularity: 'monthly'
    }
};

export const organizationStatistics = {
    defaultParams: {
        status: [],
        org_id: [],
        quick_date_range: 'last_30_days',
        sort_by: 'desc',
        sort_order: ':desc',
        limit: 5,
        job_type: [ 'workflowjob', 'job' ],
        cluster_id: [],
        template_id: [],
        start_date: null,
        end_date: null
    }
};

export const clusters = {
    defaultParams: {
        status: [ 'successful', 'failed' ],
        quick_date_range: 'last_30_days',
        job_type: [ 'workflowjob', 'job' ],
        group_by_time: true,
        org_id: [],
        cluster_id: [],
        template_id: [],
        only_root_workflows_and_standalone_jobs: false
    }
};
