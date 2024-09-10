import { Select, SelectOption } from '@patternfly/react-core/deprecated';
import { FormHelperText } from '@patternfly/react-core/dist/dynamic/components/Form';
import { Form } from '@patternfly/react-core/dist/dynamic/components/Form';
import { FormGroup } from '@patternfly/react-core/dist/dynamic/components/Form';
import { NumberInput } from '@patternfly/react-core/dist/dynamic/components/NumberInput';
import { TextInput } from '@patternfly/react-core/dist/dynamic/components/TextInput';
import { Grid } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { isPositiveNum } from '../../../../../../Utilities/helpers';
import { actions } from '../../../constants';

const Details = ({ options, formData, dispatch }) => {
  const { name, category, description, manual_time, hosts, frequency_period } =
    formData;

  const [categoryIsOpen, setCategoryIsOpen] = useState(false);
  const [manualTimeIsOpen, setManualTimeIsOpen] = useState(false);
  const [frequencyPeriodIsOpen, setFrequencyPeriodIsOpen] = useState(false);
  const [showError, setShowError] = useState(false);

  return (
    <Form>
      {options && (
        <Grid hasGutter md={6}>
          <FormGroup
            label='What do you want to automate?'
            isRequired
            fieldId='name-field'
          >
            <TextInput
              isRequired
              placeholder='Example: Provision NGINX server'
              type='text'
              id='name-field'
              name='name'
              value={name}
              onChange={(_event, newName) =>
                dispatch({
                  type: actions.SET_NAME,
                  value: newName,
                })
              }
              onFocus={() => setShowError(!name)}
              onBlur={() => setShowError(!name)}
            />
            {!formData.name && showError && (
              <FormHelperText>Name is required</FormHelperText>
            )}
          </FormGroup>
          <FormGroup label='What type of task is it?' fieldId='category-field'>
            <Select
              id='category-field'
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
            label='Enter a description of your automation plan'
            fieldId='description-field'
          >
            <TextInput
              type='text'
              placeholder='Place description here'
              id='description-field'
              name='description'
              value={description}
              onChange={(_event, newDescription) =>
                dispatch({
                  type: actions.SET_DESCRIPTION,
                  value: newDescription,
                })
              }
            />
          </FormGroup>
          <FormGroup
            label='How long does it take to do this manually?'
            fieldId='manual-time-field'
          >
            <Select
              id='manual-time-field'
              isOpen={manualTimeIsOpen}
              variant={'single'}
              placeholderText='Select amount'
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
            label='How many hosts do you plan to run this on?'
            fieldId='hosts-field'
          >
            <NumberInput
              inputAriaLabel='Number of hosts'
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
              id='hosts-field'
              name='hosts'
              value={hosts}
              min={0}
            />
          </FormGroup>
          <FormGroup
            label='How often do you do this?'
            fieldId='frequency-period-field'
          >
            <Select
              id='frequency-period-field'
              isOpen={frequencyPeriodIsOpen}
              variant={'single'}
              placeholderText='Select frequency period'
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
