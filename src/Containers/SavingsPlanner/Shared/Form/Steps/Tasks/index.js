import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  Button,
  DataList,
  DataListAction,
  DataListItem,
  DataListCell,
  DataListItemRow,
  DataListControl,
  DataListDragButton,
  DataListItemCells,
  Form,
  FormGroup,
  Grid,
  InputGroup,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { PlusIcon, TimesIcon } from '@patternfly/react-icons';

import { actions } from '../../../constants';

const TaskSection = styled.div`
  margin-top: 20px;
`;

const TaskTitle = styled(Title)`
  margin-bottom: 10px;
`;

const TaskDeleteButton = styled(Button)`
  padding: 0 16px;
`;

const DeleteTaskActionSection = styled(DataListAction)`
  padding: 6px 0;
`;

const TaskRow = styled(DataListItemRow)`
  align-items: center;
`;

const Tasks = ({ tasks, dispatch }) => {
  const setTasks = (val) => {
    dispatch({ type: actions.SET_TASKS, value: val });
  };

  const [taskToAdd, setTaskToAdd] = useState('');

  const [liveText, setLiveText] = useState('');
  const [id, setId] = useState('');

  const onDragStart = (newId) => {
    setId(newId);
    setLiveText(`Dragging started for task ${newId}.`);
  };

  const onDragMove = (oldIndex, newIndex) => {
    setLiveText(
      `Dragging task ${id}.  Task ${oldIndex} is now task ${newIndex}.`
    );
  };

  const onDragCancel = () => {
    setLiveText('Dragging cancelled. Tasks list order is unchanged.');
  };

  const onDragFinish = (newItemOrder) => {
    setLiveText('Dragging finsihed');
    setTasks([...newItemOrder]);
  };

  const appendTask = () => {
    if (taskToAdd !== '') {
      setTasks([...tasks, taskToAdd]);
      setTaskToAdd('');
    }
  };

  const handleTextKeyDown = (e) => {
    if (e.key && e.key === 'Enter') {
      e.preventDefault();
      appendTask();
    }
  };

  const removeTask = (task) => {
    setTasks(tasks.filter((t) => t !== task));
  };

  return (
    <>
      <Form>
        <Grid hasGutter md={6}>
          <FormGroup
            label="What tasks do you need to accomplish this plan?"
            fieldId="task-field"
          >
            <InputGroup>
              <TextInput
                placeholder="Enter a description of each task"
                type="text"
                id="task-field"
                name="task"
                value={taskToAdd}
                onChange={(newTaskName) => setTaskToAdd(newTaskName)}
                onKeyDown={handleTextKeyDown}
              />
              <Button
                onClick={appendTask}
                variant="control"
                aria-label="Add task"
              >
                <PlusIcon />
              </Button>
            </InputGroup>
          </FormGroup>
        </Grid>
      </Form>
      {tasks.length > 0 && (
        <TaskSection>
          <TaskTitle headingLevel="h4" size="xl">
            Tasks
          </TaskTitle>
          <DataList
            aria-label="Draggable list to reorder and remove tasks."
            isCompact
            onDragFinish={onDragFinish}
            onDragStart={onDragStart}
            onDragMove={onDragMove}
            onDragCancel={onDragCancel}
            itemOrder={tasks}
          >
            {tasks.map((task, index) => (
              <DataListItem
                aria-labelledby={`cell-${index + 1}`}
                id={task}
                key={index + 1}
              >
                <TaskRow>
                  <DataListControl>
                    <DataListDragButton
                      aria-label="Reorder"
                      aria-labelledby={`cell-${index + 1}`}
                      aria-describedby="Press space or enter to begin dragging, and use the arrow keys to navigate up or down. Press enter to confirm the drag, or any other key to cancel the drag operation."
                      aria-pressed="false"
                    />
                  </DataListControl>
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell key={index + 1}>
                        <span id={`cell-${index + 1}`}>{`${
                          index + 1
                        }. ${task}`}</span>
                      </DataListCell>,
                    ]}
                  />
                  <DeleteTaskActionSection aria-label="Actions">
                    <TaskDeleteButton
                      onClick={() => removeTask(task)}
                      variant="plain"
                      aria-label="Delete"
                    >
                      <TimesIcon />
                    </TaskDeleteButton>
                  </DeleteTaskActionSection>
                </TaskRow>
              </DataListItem>
            ))}
          </DataList>
        </TaskSection>
      )}
      <div className="pf-screen-reader" aria-live="assertive">
        {liveText}
      </div>
    </>
  );
};

Tasks.propTypes = {
  tasks: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Tasks;
