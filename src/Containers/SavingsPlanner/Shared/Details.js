import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Form,
  FormGroup,
  Grid,
  Select,
  SelectOption,
  TextInput,
} from '@patternfly/react-core';

import Popover from '../../../Components/Popover';

const Details = ({
  options,
  name,
  setName,
  category,
  setCategory,
  description,
  setDescription,
  manualTime,
  setManualTime,
  hosts,
  setHosts,
  frequencyPeriod,
  setFrequencyPeriod,
}) => {
  const [categoryIsOpen, setCategoryIsOpen] = useState(false);
  const [manualTimeIsOpen, setManualTimeIsOpen] = useState(false);
  const [frequencyPeriodIsOpen, setFrequencyPeriodIsOpen] = useState(false);

  return (
    <Form>
      {options?.data && (
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
              onChange={(newName) => setName(newName)}
            />
          </FormGroup>
          <FormGroup
            label="What type of task is it?"
            isRequired
            fieldId="category-field"
          >
            <Select
              id="category-field"
              isOpen={categoryIsOpen}
              variant={'single'}
              aria-label={'Plan category selector'}
              onToggle={() => setCategoryIsOpen(!categoryIsOpen)}
              onSelect={(_event, selection) => {
                setCategory(selection);
                setCategoryIsOpen(false);
              }}
              selections={category}
            >
              {(options.data?.category || []).map(({ key, value }) => (
                <SelectOption key={key} value={key}>
                  {value}
                </SelectOption>
              ))}
            </Select>
          </FormGroup>
          <FormGroup label="Description" fieldId="description-field">
            <TextInput
              type="text"
              placeholder="Place description here"
              id="description-field"
              name="description"
              value={description}
              onChange={(newDescription) => setDescription(newDescription)}
            />
          </FormGroup>
          <FormGroup
            label="How long does it take to do this manually?"
            fieldId="manual-time-field"
            labelIcon={
              <Popover content="Select the option closest to the average amount of time the thing you are trying to automate takes each time it is done." />
            }
          >
            <Select
              id="manual-time-field"
              isOpen={manualTimeIsOpen}
              variant={'single'}
              placeholderText="Select amount"
              aria-label={'Plan time selector'}
              onToggle={() => setManualTimeIsOpen(!manualTimeIsOpen)}
              onSelect={(_event, selection) => {
                setManualTime(selection);
                setManualTimeIsOpen(false);
              }}
              selections={manualTime}
            >
              {(options.data?.manual_time || []).map(({ key, value }) => (
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
            <TextInput
              type="number"
              placeholder="Enter number of hosts"
              id="hosts-field"
              name="hosts"
              value={hosts}
              onChange={(newHosts) => setHosts(newHosts)}
            />
          </FormGroup>
          <FormGroup
            label="How often do you do this?"
            fieldId="frequency-period-field"
            labelIcon={
              <Popover content="Select the option closest to the average number of times the thing you are trying to automate is done manually." />
            }
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
                setFrequencyPeriod(selection);
                setFrequencyPeriodIsOpen(false);
              }}
              selections={frequencyPeriod}
            >
              {(options.data?.frequency_period || []).map(({ key, value }) => (
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
  name: PropTypes.string.isRequired,
  setName: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
  setDescription: PropTypes.func.isRequired,
  manualTime: PropTypes.number.isRequired,
  setManualTime: PropTypes.func.isRequired,
  hosts: PropTypes.number.isRequired,
  setHosts: PropTypes.func.isRequired,
  frequencyPeriod: PropTypes.string.isRequired,
  setFrequencyPeriod: PropTypes.func.isRequired,
};

export default Details;
