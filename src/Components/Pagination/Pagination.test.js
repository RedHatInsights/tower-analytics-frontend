import Pagination from './Pagination';
import { render, fireEvent, screen } from '@testing-library/react';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
    location: jest.fn(),
    pathname: 'some_path',
  }),
}));

describe('Components/Pagination', () => {
  const params = {
    offset: 0,
    limit: 5,
  };
  const count = 15;
  const setPagination = jest.fn();

  const mockConfig = {
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
    namespace: 'foo',
    integerFields: ['limit', 'offset'],
  };

  beforeEach(() => {
    setPagination.mockReset();
  });

  it('can render the pagination component', () => {
    render(
      <Pagination
        count={count}
        params={params}
        setPagination={setPagination}
        qsConfig={mockConfig}
      />
    );
  });

  it('can render the pagination component with default params', () => {
    render(
      <Pagination
        params={params}
        setPagination={setPagination}
        qsConfig={mockConfig}
      />
    );
  });

  it('calls the pagination functions', () => {
    render(
      <Pagination
        count={count}
        params={params}
        setPagination={setPagination}
        qsConfig={mockConfig}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }));

    expect(setPagination).toHaveBeenCalledWith(params.limit);
    expect(setPagination).toHaveBeenCalledTimes(1);
  });

  it('can select number of items to display', () => {
    render(
      <Pagination
        count={count}
        params={params}
        setPagination={setPagination}
        qsConfig={mockConfig}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Items per page' }));
    fireEvent.click(screen.getByText('10 per page'));

    expect(setPagination).toHaveBeenCalledWith(params.offset, 10);
    expect(setPagination).toHaveBeenCalledTimes(1);
  });
});
