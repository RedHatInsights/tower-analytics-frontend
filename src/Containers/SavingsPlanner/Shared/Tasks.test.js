import Tasks from './Tasks';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('SavingsPlanner/Shared/Tasks', () => {
  const setField = jest.fn();
  const mockTasks = ['foo', 'bar', 'baz'];

  beforeEach(() => {
    setField.mockReset();
  });

  it('can see the shared/Tasks component', () => {
    render(<Tasks tasks={mockTasks} setField={setField} />);
  });

  it('can add a task by clicking "Add" button', async () => {
    render(<Tasks tasks={mockTasks} setField={setField} />);
    userEvent.type(
      screen.getByRole('textbox', {
        name: 'What tasks do you need to accomplish this plan?',
      }),
      'qux'
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add task' }));
    expect(setField).toHaveBeenCalledWith('tasks', mockTasks.concat('qux'));
  });

  it('can add a task by hitting "enter" key', () => {
    render(<Tasks tasks={mockTasks} setField={setField} />);
    const taskInput = screen.getByRole('textbox', {
      name: 'What tasks do you need to accomplish this plan?',
    });
    userEvent.type(taskInput, 'quux');
    fireEvent.keyDown(taskInput, { key: 'Enter', code: 'Enter' });
    expect(setField).toHaveBeenCalledWith('tasks', mockTasks.concat('quux'));
  });

  it('can delete a task', () => {
    render(<Tasks tasks={mockTasks} setField={setField} />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    expect(setField).toHaveBeenCalledWith('tasks', mockTasks.slice(1));
  });
});
