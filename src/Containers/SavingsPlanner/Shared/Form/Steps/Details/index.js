import { FormHelperText } from '@patternfly/react-core/dist/dynamic/components/Form';
import { Form } from '@patternfly/react-core/dist/dynamic/components/Form';
import { FormGroup } from '@patternfly/react-core/dist/dynamic/components/Form';
import { MenuToggle } from '@patternfly/react-core/dist/dynamic/components/MenuToggle';
import { NumberInput } from '@patternfly/react-core/dist/dynamic/components/NumberInput';
import { Select } from '@patternfly/react-core/dist/dynamic/components/Select';
import { SelectOption } from '@patternfly/react-core/dist/dynamic/components/Select';
import { SelectList } from '@patternfly/react-core/dist/dynamic/components/Select';
import { TextInput } from '@patternfly/react-core/dist/dynamic/components/TextInput';
import { Grid } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  isPositiveNum,
  validateLength,
} from '../../../../../../Utilities/helpers';
import { MAX_LENGTHS, actions } from '../../../constants';

const Details = ({ options, formData, dispatch, onValidationChange }) => {
  const { category, manual_time, hosts, frequency_period } = formData;

  const [categoryIsOpen, setCategoryIsOpen] = useState(false);
  const [manualTimeIsOpen, setManualTimeIsOpen] = useState(false);
  const [frequencyPeriodIsOpen, setFrequencyPeriodIsOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  const [localName, setLocalName] = useState(formData.name || '');
  const [localDescription, setLocalDescription] = useState(
    formData.description || '',
  );
  const [nameValidation, setNameValidation] = useState({ isValid: true });
  const [descriptionValidation, setDescriptionValidation] = useState({
    isValid: true,
  });

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
              value={localName}
              validated={
                !nameValidation.isValid || (!localName && showError)
                  ? 'error'
                  : 'default'
              }
              onChange={(_event, newName) => {
                setLocalName(newName);
                const validation = validateLength(newName, MAX_LENGTHS.NAME);
                setNameValidation(validation);
                if (onValidationChange) {
                  onValidationChange({
                    nameValid: validation.isValid,
                    descriptionValid: descriptionValidation.isValid,
                  });
                }
                if (validation.isValid) {
                  dispatch({
                    type: actions.SET_NAME,
                    value: newName,
                  });
                }
              }}
              onFocus={() => setShowError(!localName)}
              onBlur={() => setShowError(!localName)}
            />
            {!localName && showError && (
              <FormHelperText>
                <span className='pf-v5-c-form__helper-text-icon'>
                  Name is required
                </span>
              </FormHelperText>
            )}
            {!nameValidation.isValid && (
              <FormHelperText>
                <span className='pf-v5-c-form__helper-text-icon'>
                  {nameValidation.error}
                </span>
              </FormHelperText>
            )}
          </FormGroup>
          <FormGroup label='What type of task is it?' fieldId='category-field'>
            <Select
              id='category-field'
              isOpen={categoryIsOpen}
              aria-label={'Plan category selector'}
              onOpenChange={(isOpen) => setCategoryIsOpen(isOpen)}
              onSelect={(_event, selection) => {
                dispatch({
                  type: actions.SET_CATEGORY,
                  value: selection,
                });
                setCategoryIsOpen(false);
              }}
              selected={category}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setCategoryIsOpen(!categoryIsOpen)}
                  isExpanded={categoryIsOpen}
                  isFullWidth
                >
                  {category || 'Select category'}
                </MenuToggle>
              )}
            >
              <SelectList>
                {(options?.category || []).map(({ key, value }) => (
                  <SelectOption key={key} value={key}>
                    {value}
                  </SelectOption>
                ))}
              </SelectList>
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
              value={localDescription}
              validated={!descriptionValidation.isValid ? 'error' : 'default'}
              onChange={(_event, newDescription) => {
                setLocalDescription(newDescription);
                const validation = validateLength(
                  newDescription,
                  MAX_LENGTHS.DESCRIPTION,
                );
                setDescriptionValidation(validation);
                if (onValidationChange) {
                  onValidationChange({
                    nameValid: nameValidation.isValid,
                    descriptionValid: validation.isValid,
                  });
                }
                if (validation.isValid) {
                  dispatch({
                    type: actions.SET_DESCRIPTION,
                    value: newDescription,
                  });
                }
              }}
            />
            {!descriptionValidation.isValid && (
              <FormHelperText>
                <span className='pf-v5-c-form__helper-text-icon'>
                  {descriptionValidation.error}
                </span>
              </FormHelperText>
            )}
          </FormGroup>
          <FormGroup
            label='How long does it take to do this manually?'
            fieldId='manual-time-field'
          >
            <Select
              id='manual-time-field'
              isOpen={manualTimeIsOpen}
              aria-label={'Plan time selector'}
              onOpenChange={(isOpen) => setManualTimeIsOpen(isOpen)}
              onSelect={(_event, selection) => {
                dispatch({
                  type: actions.SET_MANUAL_TIME,
                  value: selection,
                });
                setManualTimeIsOpen(false);
              }}
              selected={manual_time}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setManualTimeIsOpen(!manualTimeIsOpen)}
                  isExpanded={manualTimeIsOpen}
                  isFullWidth
                >
                  {manual_time || 'Select amount'}
                </MenuToggle>
              )}
            >
              <SelectList>
                {(options?.manual_time || []).map(({ key, value }) => (
                  <SelectOption key={key} value={key}>
                    {value}
                  </SelectOption>
                ))}
              </SelectList>
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
              aria-label={'Plan frequency period selector'}
              onOpenChange={(isOpen) => setFrequencyPeriodIsOpen(isOpen)}
              onSelect={(_event, selection) => {
                dispatch({
                  type: actions.SET_FREQUENCY_PERIOD,
                  value: selection,
                });
                setFrequencyPeriodIsOpen(false);
              }}
              selected={frequency_period}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() =>
                    setFrequencyPeriodIsOpen(!frequencyPeriodIsOpen)
                  }
                  isExpanded={frequencyPeriodIsOpen}
                  isFullWidth
                >
                  {frequency_period || 'Select frequency period'}
                </MenuToggle>
              )}
            >
              <SelectList>
                {(options?.frequency_period || []).map(({ key, value }) => (
                  <SelectOption key={key} value={key}>
                    {value}
                  </SelectOption>
                ))}
              </SelectList>
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
  onValidationChange: PropTypes.func,
};

export default Details;
