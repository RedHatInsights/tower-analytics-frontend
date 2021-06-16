export default {
    meta: {
      rbac: {
        perms: {
          all: true
        }
      }
    },
    items: {
      template_id: [
        {
          key: 1,
          value: 'template_name_2',
        },
      ],
      automation_status: [
        {
          key: 'none',
          value: 'None',
        },
        {
          key: 'successful',
          value: 'Successful',
        },
        {
          key: 'failed',
          value: 'Failed',
        },
      ],
      category: [
        {
          key: 'system',
          value: 'System',
        },
      ],
      frequency_period: [
        {
          key: 'daily',
          value: 'Daily',
        },
      ],
      sort_options: [
        {
          key: 'name',
          value: 'Name',
        },
      ],
    },
  response: { msg: 'Success' },
  url: '/api/tower-analytics/v1/plan_options/',
};
