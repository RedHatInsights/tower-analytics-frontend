/* eslint-disable camelcase */

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
        limit: 5,
        only_root_workflows_and_standalone_jobs: false
    }
};

export const toolbarCategories = [
    { name: 'Status', id: 1 },
    { name: 'Date', id: 2 },
    { name: 'Job', id: 3 },
    { name: 'Organization', id: 4 },
    { name: 'Cluster', id: 5 },
    { name: 'Template', id: 6 },
    { name: 'Sort by', id: 7 }
];
