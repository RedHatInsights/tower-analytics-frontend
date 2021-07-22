import Details from '.';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('SavingsPlanner/Shared/Form/Steps/Details', () => {
  const mockDispatch = jest.fn();
  const mockFormData = {
    name: '',
    category: 'system',
    description: '',
    manual_time: 240,
    hosts: 1,
    frequency_period: 'weekly',
    tasks: [],
    template_id: -2,
  };
  const mockOptions = {
    data: {
      template_id: [
        {
          key: -2,
          value: 'None',
        },
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
        {
          key: 'development',
          value: 'Development',
        },
      ],
      platforms: [
        {
          key: 'el',
          value: 'EL',
        },
        {
          key: 'ubuntu',
          value: 'Ubuntu',
        },
      ],
      frequency_period: [
        {
          key: 'daily',
          value: 'Daily',
        },
        {
          key: 'weekly',
          value: 'Weekly',
        },
      ],
      manual_time: [
        {
          key: 60,
          value: '1 hour (or less)',
        },
        {
          key: 120,
          value: '2 hours',
        },
      ],
      sort_options: [
        {
          key: 'name',
          value: 'Name',
        },
        {
          key: 'hosts',
          value: 'No. of hosts',
        },
      ],
      meta: {
        rbac: {
          enabled: false,
        },
      },
    },
  };

  beforeEach(() => {
    mockDispatch.mockReset();
  });

  it('can see the shared/Details component', () => {
    render(
      <Details
        options={mockOptions}
        formData={mockFormData}
        dispatch={mockDispatch}
      />
    );
  });

  it('can enter a plan name', () => {
    render(
      <Details
        options={mockOptions}
        formData={mockFormData}
        dispatch={mockDispatch}
      />
    );
    userEvent.type(
      screen.getByRole('textbox', { name: 'What do you want to automate?' }),
      'foo'
    );

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('can enter a plan description', () => {
    render(
      <Details
        options={mockOptions}
        formData={mockFormData}
        dispatch={mockDispatch}
      />
    );
    userEvent.type(
      screen.getByRole('textbox', {
        name: 'Enter a description of your automation plan',
      }),
      'bar'
    );

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('can select a category from a dropdown', () => {
    render(
      <Details
        options={mockOptions}
        formData={mockFormData}
        dispatch={mockDispatch}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'System' }));
    fireEvent.click(screen.getByRole('option', { name: 'Development' }));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_CATEGORY',
      value: 'development',
    });
  });

  it('can select a frequency period from a dropdown', () => {
    render(
      <Details
        options={mockOptions}
        formData={mockFormData}
        dispatch={mockDispatch}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Weekly' }));
    fireEvent.click(screen.getByRole('option', { name: 'Daily' }));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_FREQUENCY_PERIOD',
      value: 'daily',
    });
  });

  it('can select a manual time from a dropdown', () => {
    render(
      <Details
        options={mockOptions}
        formData={mockFormData}
        dispatch={mockDispatch}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: '240' }));
    fireEvent.click(screen.getByRole('option', { name: '2 hours' }));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_MANUAL_TIME',
      value: 120,
    });
  });

  it('can change number of hosts', () => {
    render(
      <Details
        options={mockOptions}
        formData={mockFormData}
        dispatch={mockDispatch}
      />
    );
    fireEvent.input(screen.getByLabelText('Number of hosts'), {
      target: { value: 4 },
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_HOSTS',
      value: 4,
    });
  });
});
