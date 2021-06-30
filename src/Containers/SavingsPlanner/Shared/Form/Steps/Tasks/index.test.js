import Tasks from '.';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('SavingsPlanner/Shared/Form/Steps/Tasks', () => {
  const mockDispatch = jest.fn();
  const mockTasks = ['foo', 'bar', 'baz'];

  beforeEach(() => {
    mockDispatch.mockReset();
  });

  it('can see the shared/Tasks component', () => {
    render(<Tasks tasks={mockTasks} dispatch={mockDispatch} />);
  });

  it('can add a task by clicking "Add" button', async () => {
    render(<Tasks tasks={mockTasks} dispatch={mockDispatch} />);
    userEvent.type(
      screen.getByRole('textbox', {
        name: 'What tasks do you need to accomplish this plan?',
      }),
      'qux'
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add task' }));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TASKS',
      value: mockTasks.concat('qux'),
    });
  });

  it('can add a task by hitting "enter" key', () => {
    render(<Tasks tasks={mockTasks} dispatch={mockDispatch} />);
    const taskInput = screen.getByRole('textbox', {
      name: 'What tasks do you need to accomplish this plan?',
    });
    userEvent.type(taskInput, 'quux');
    fireEvent.keyDown(taskInput, { key: 'Enter', code: 'Enter' });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TASKS',
      value: mockTasks.concat('quux'),
    });
  });

  it('can delete a task', () => {
    render(<Tasks tasks={mockTasks} dispatch={mockDispatch} />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TASKS',
      value: mockTasks.slice(1),
    });
  });
});
