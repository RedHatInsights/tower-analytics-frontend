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
        quick_date_range: 'roi_last_year',
        job_type: [ 'job' ],
        sort_by: 'template_productivity_score:desc',
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
        orgId: [],
        quickDateRange: 'last_30_days',
        sortBy: 'desc',
        limit: 5
    },
    sortBy: [
        { key: 'desc', value: 'Top 5 Orgs' },
        { key: 'asc', value: 'Bottom 5 Orgs' }
    ]
};
