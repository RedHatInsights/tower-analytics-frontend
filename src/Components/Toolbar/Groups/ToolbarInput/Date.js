import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from '@patternfly/react-core';
import { optionsForCategories } from '../../constants';

const DateInput = ({
  categoryKey,
  value = '',
  setValue = () => {},
  otherProps = {},
}) => {
  const options = optionsForCategories[categoryKey];
  return (
    <DatePicker
      aria-label={options.name}
      value={value}
      onChange={setValue}
      {...otherProps}
    />
  );
};

DateInput.propTypes = {
  categoryKey: PropTypes.string.isRequired,
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  otherProps: PropTypes.object,
};

export default DateInput;
