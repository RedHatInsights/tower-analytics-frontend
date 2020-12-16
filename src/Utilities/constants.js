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
        start_date: '',
        end_date: '',
        only_root_workflows_and_standalone_jobs: false,
        limit: 5
    }
};
