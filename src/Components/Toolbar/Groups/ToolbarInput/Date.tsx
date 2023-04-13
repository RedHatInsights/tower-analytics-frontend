import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from '@patternfly/react-core';
import { optionsForCategories } from '../../constants';

interface Props {
  categoryKey: string;
  value?: string;
  setValue?: (value: string) => void;
  otherProps?: {
    [x: string]: unknown;
  };
}

const DateInput: FunctionComponent<Props> = ({
  categoryKey,
  value = '',
  setValue = () => ({}),
  otherProps = {},
}) => {
  const options = optionsForCategories[categoryKey];
  const handleSetValue = (category: string, newValue: string) => {
    console.log(
      '2222222 in DateInput',
      categoryKey,
      newValue,
      JSON.stringify(options)
    );
    setValue(newValue);
  };
  return (
    <DatePicker
      aria-label={options.name}
      id={categoryKey}
      key={categoryKey}
      value={value}
      onChange={(e) => handleSetValue(categoryKey, e)}
      inputProps={{
        isReadOnly: true,
      }}
      {...otherProps}
    />
  );
};

DateInput.propTypes = {
  categoryKey: PropTypes.string.isRequired,
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  otherProps: PropTypes.any,
};

export default DateInput;
console.log(DateInput);
