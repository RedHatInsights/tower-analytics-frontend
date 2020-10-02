import React from 'react';
import PropTypes from 'prop-types';
import {
    InputGroup,
    InputGroupText,
    TextInput
} from '@patternfly/react-core';
import {
    CalendarAltIcon
} from '@patternfly/react-icons';

const CustomDateSelector = ({
    onInputChange,
    startDate,
    endDate
}) => {
    return (
        <>
          <InputGroup>
              <InputGroupText component="label" htmlFor="startDate">
                  <CalendarAltIcon />
              </InputGroupText>
              <TextInput
                  name="startDate"
                  id="startDate"
                  type="date"
                  aria-label="Start Date"
                  value={ startDate || '' }
                  onChange={ e => onInputChange('startDate', e) }
              />
          </InputGroup>
          <InputGroup>
              <InputGroupText component="label" htmlFor="endDate">
                  <CalendarAltIcon />
              </InputGroupText>
              <TextInput
                  name="endDate"
                  id="endDate"
                  type="date"
                  aria-label="End Date"
                  value={ endDate || '' }
                  onChange={ e => onInputChange('endDate', e) }
              />
          </InputGroup>
        </>
    );
};

CustomDateSelector.propTypes = {
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    onInputChange: PropTypes.func
};

export default CustomDateSelector;
