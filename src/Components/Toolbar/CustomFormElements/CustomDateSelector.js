import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, TextInput } from '@patternfly/react-core';

const CustomDateSelector = ({
  onInputChange = () => {},
  startDate = '',
  endDate = '',
}) => {
  return (
    <>
      <InputGroup>
        <TextInput
          name="startDate"
          id="startDate"
          type="date"
          aria-label="Start Date"
          value={startDate}
          onChange={(e) => onInputChange('start_date', e)}
        />
      </InputGroup>
      <InputGroup>
        <TextInput
          name="endDate"
          id="endDate"
          type="date"
          aria-label="End Date"
          value={endDate}
          onChange={(e) => onInputChange('end_date', e)}
        />
      </InputGroup>
    </>
  );
};

CustomDateSelector.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  onInputChange: PropTypes.func,
};

export default CustomDateSelector;
