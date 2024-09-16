import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { DataList } from '@patternfly/react-core/dist/dynamic/components/DataList';
import { DataListAction } from '@patternfly/react-core/dist/dynamic/components/DataList';
import { DataListItem } from '@patternfly/react-core/dist/dynamic/components/DataList';
import { DataListCell } from '@patternfly/react-core/dist/dynamic/components/DataList';
import { DataListItemRow } from '@patternfly/react-core/dist/dynamic/components/DataList';
import { DataListControl } from '@patternfly/react-core/dist/dynamic/components/DataList';
import { DataListDragButton } from '@patternfly/react-core/dist/dynamic/components/DataList';
import { DataListItemCells } from '@patternfly/react-core/dist/dynamic/components/DataList';
import { Form } from '@patternfly/react-core/dist/dynamic/components/Form';
import { FormGroup } from '@patternfly/react-core/dist/dynamic/components/Form';
import { InputGroupItem } from '@patternfly/react-core/dist/dynamic/components/InputGroup';
import { InputGroup } from '@patternfly/react-core/dist/dynamic/components/InputGroup';
import { TextInput } from '@patternfly/react-core/dist/dynamic/components/TextInput';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import { Grid } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import PlusIcon from '@patternfly/react-icons/dist/dynamic/icons/plus-icon';
import TimesIcon from '@patternfly/react-icons/dist/dynamic/icons/times-icon';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
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

  const appendTask = () => {
    const trimmedTask = taskToAdd.trim();
    if (trimmedTask !== '') {
      setTasks([...tasks, trimmedTask]);
      setTaskToAdd('');
    }
  };

  const handleTextKeyDown = (e) => {
    if (e.key && e.key === 'Enter') {
      e.preventDefault();
      appendTask();
    }
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((t, idx) => idx !== index));
  };

  return (
    <>
      <Form>
        <Grid hasGutter md={6}>
          <FormGroup
            label='What tasks do you need to accomplish this plan?'
            fieldId='task-field'
          >
            <InputGroup>
              <InputGroupItem isFill>
                <TextInput
                  placeholder='Enter a description of each task'
                  type='text'
                  id='task-field'
                  name='task'
                  value={taskToAdd}
                  onChange={(_event, newTaskName) => setTaskToAdd(newTaskName)}
                  onKeyDown={handleTextKeyDown}
                />
              </InputGroupItem>
              <InputGroupItem>
                <Button
                  onClick={appendTask}
                  isDisabled={taskToAdd.trim() === ''}
                  variant='control'
                  aria-label='Add task'
                >
                  <PlusIcon />
                </Button>
              </InputGroupItem>
            </InputGroup>
          </FormGroup>
        </Grid>
      </Form>
      {tasks.length > 0 && (
        <TaskSection>
          <TaskTitle headingLevel='h4' size='xl'>
            Tasks
          </TaskTitle>
          <DataList
            aria-label='Draggable list to reorder and remove tasks.'
            isCompact
          >
            {tasks.map((task, index) => (
              <DataListItem
                aria-labelledby={`cell-${index + 1}`}
                id={`${task}-${index}`}
                key={index + 1}
              >
                <TaskRow>
                  <DataListControl>
                    <DataListDragButton
                      aria-label='Reorder'
                      aria-labelledby={`cell-${index + 1}`}
                      aria-describedby='Press space or enter to begin dragging, and use the arrow keys to navigate up or down. Press enter to confirm the drag, or any other key to cancel the drag operation.'
                      aria-pressed='false'
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
                  <DeleteTaskActionSection aria-label='Actions'>
                    <TaskDeleteButton
                      onClick={() => removeTask(index)}
                      variant='plain'
                      aria-label='Delete'
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
      <div className='pf-screen-reader' aria-live='assertive'>
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
