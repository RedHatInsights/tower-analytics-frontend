import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Form,
  FormGroup,
  Grid,
  Select,
  SelectOption,
  TextInput,
  NumberInput,
} from '@patternfly/react-core';

import { actions } from '../../../constants';

import { isPositiveNum } from '../../../../../../Utilities/helpers';

const Details = ({ options, formData, dispatch }) => {
  const { name, category, description, manual_time, hosts, frequency_period } =
    formData;

  const [categoryIsOpen, setCategoryIsOpen] = useState(false);
  const [manualTimeIsOpen, setManualTimeIsOpen] = useState(false);
  const [frequencyPeriodIsOpen, setFrequencyPeriodIsOpen] = useState(false);

  return (
    <Form>
      {options && (
        <Grid hasGutter md={6}>
          <FormGroup
            label="What do you want to automate?"
            isRequired
            fieldId="name-field"
          >
            <TextInput
              isRequired
              placeholder="Example: Provision NGINX server"
              type="text"
              id="name-field"
              name="name"
              value={name}
              onChange={(newName) =>
                dispatch({
                  type: actions.SET_NAME,
                  value: newName,
                })
              }
            />
          </FormGroup>
          <FormGroup label="What type of task is it?" fieldId="category-field">
            <Select
              id="category-field"
              isOpen={categoryIsOpen}
              variant={'single'}
              aria-label={'Plan category selector'}
              maxHeight={390}
              onToggle={() => setCategoryIsOpen(!categoryIsOpen)}
              onSelect={(_event, selection) => {
                dispatch({
                  type: actions.SET_CATEGORY,
                  value: selection,
                });
                setCategoryIsOpen(false);
              }}
              selections={category}
            >
              {(options?.category || []).map(({ key, value }) => (
                <SelectOption key={key} value={key}>
                  {value}
                </SelectOption>
              ))}
            </Select>
          </FormGroup>
          <FormGroup
            label="Enter a description of your automation plan"
            fieldId="description-field"
          >
            <TextInput
              type="text"
              placeholder="Place description here"
              id="description-field"
              name="description"
              value={description}
              onChange={(newDescription) =>
                dispatch({
                  type: actions.SET_DESCRIPTION,
                  value: newDescription,
                })
              }
            />
          </FormGroup>
          <FormGroup
            label="How long does it take to do this manually?"
            fieldId="manual-time-field"
          >
            <Select
              id="manual-time-field"
              isOpen={manualTimeIsOpen}
              variant={'single'}
              placeholderText="Select amount"
              aria-label={'Plan time selector'}
              onToggle={() => setManualTimeIsOpen(!manualTimeIsOpen)}
              onSelect={(_event, selection) => {
                dispatch({
                  type: actions.SET_MANUAL_TIME,
                  value: selection,
                });
                setManualTimeIsOpen(false);
              }}
              selections={manual_time}
            >
              {(options?.manual_time || []).map(({ key, value }) => (
                <SelectOption key={key} value={key}>
                  {value}
                </SelectOption>
              ))}
            </Select>
          </FormGroup>
          <FormGroup
            label="How many hosts do you plan to run this on?"
            fieldId="hosts-field"
          >
            <NumberInput
              inputAriaLabel="Number of hosts"
              widthChars={8}
              onChange={(event) => {
                if (
                  isPositiveNum(event.target.value) ||
                  event.target.value.length === 0
                ) {
                  dispatch({
                    type: actions.SET_HOSTS,
                    value: parseInt(event.target.value),
                  });
                }
              }}
              onMinus={() =>
                dispatch({
                  type: actions.SET_HOSTS,
                  value: isPositiveNum(hosts) ? hosts - 1 : 0,
                })
              }
              onPlus={() =>
                dispatch({
                  type: actions.SET_HOSTS,
                  value: isPositiveNum(hosts) ? hosts + 1 : 1,
                })
              }
              id="hosts-field"
              name="hosts"
              value={hosts}
              min={0}
            />
          </FormGroup>
          <FormGroup
            label="How often do you do this?"
            fieldId="frequency-period-field"
          >
            <Select
              id="frequency-period-field"
              isOpen={frequencyPeriodIsOpen}
              variant={'single'}
              placeholderText="Select frequency period"
              aria-label={'Plan frequency period selector'}
              onToggle={() => {
                setFrequencyPeriodIsOpen(!frequencyPeriodIsOpen);
              }}
              onSelect={(_event, selection) => {
                dispatch({
                  type: actions.SET_FREQUENCY_PERIOD,
                  value: selection,
                });
                setFrequencyPeriodIsOpen(false);
              }}
              selections={frequency_period}
            >
              {(options?.frequency_period || []).map(({ key, value }) => (
                <SelectOption key={key} value={key}>
                  {value}
                </SelectOption>
              ))}
            </Select>
          </FormGroup>
        </Grid>
      )}
    </Form>
  );
};

Details.propTypes = {
  options: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Details;
