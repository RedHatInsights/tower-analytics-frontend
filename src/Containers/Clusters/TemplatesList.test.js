import TemplatesList from './TemplatesList';

const mockQueryParams = {
  status: ['successful', 'failed'],
  quick_date_range: 'last_30_days',
  job_type: ['workflowjob', 'job'],
  group_by_time: true,
  org_id: [],
  cluster_id: [],
  template_id: [],
  only_root_workflows_and_standalone_jobs: false,
};

describe('Components/TemplatesList', () => {
  it('should render successfully', () => {
    mount(
      <TemplatesList
        templates={[{ name: 'Foo', type: 'Bar' }]}
        qp={mockQueryParams}
      />
    );
  });
});
