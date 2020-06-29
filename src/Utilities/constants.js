<<<<<<< HEAD
/* eslint-disable camelcase */

=======
>>>>>>> Squashed commit of the following:
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
<<<<<<< HEAD
    ],
    defaultParams: {
        status: [ 'successful', 'failed' ],
        job_type: [ 'workflowjob', 'job' ],
        quick_date_range: 'last_30_days',
        limit: 5,
        only_root_workflows_and_standalone_jobs: false,
        sort_by: 'created:desc'
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
=======
    ]
};
>>>>>>> Squashed commit of the following:
