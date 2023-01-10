import React from 'react';
import { render, screen } from '@testing-library/react';
import ApiStatusWrapper from './ApiStatusWrapper';

describe('ApiStatusWrapper', () => {
  it('should render loading state', async () => {
    const props = {
      api: {
        isLoading: true,
      },
    };
    render(<ApiStatusWrapper {...props} />);
    expect(screen.getByText('Loading...')).toBeTruthy();
  });
  it('should render error state', async () => {
    const props = {
      api: {
        error: {
          error: {
            error: 'Unauthorized',
          },
        },
      },
    };
    render(<ApiStatusWrapper {...props} />);
    expect(screen.getByText('Error')).toBeTruthy();
    expect(screen.getByText('Unauthorized')).toBeTruthy();
  });
  it('should render custom NoData component', async () => {
    const props = {
      api: {
        result: {
          meta: {
            count: 0,
            tableData: [
              {
                host_id: 1533,
                host_name: 'host_relevant_iguanas',
                host_status: 'changed',
                last_referenced: '2022-12-20T16:00:45.56121',
                host_avg_duration_per_task: (1.0636375).toFixed(2),
                total_tasks_executed: 12,
                failed_duration: (1.0636375).toFixed(2),
                successful_duration: null,
                anomaly: false,
              },
            ],
          },
        },
        isSuccess: true,
      },
      customEmptyState: false,
    };
    render(<ApiStatusWrapper {...props} />);
    expect(
      screen.getByText('There is currently no data to display.')
    ).toBeTruthy();
    expect(
      screen.getByText('Select a template filter to see data.')
    ).toBeTruthy();
  });
  it('should render default NoData component', async () => {
    const props = {
      api: {
        result: {
          meta: {
            count: 0,
          },
        },
        isSuccess: true,
      },
      customEmptyState: false,
    };
    render(<ApiStatusWrapper {...props} />);
    expect(screen.getByText('No Data')).toBeTruthy();
  });
});
