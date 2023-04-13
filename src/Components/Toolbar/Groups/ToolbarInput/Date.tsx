import React, { FormEvent, FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from '@patternfly/react-core';
import { optionsForCategories } from '../../constants';

interface Props {
  categoryKey: string;
  value?: string;
  setValue?: (value: string | Date) => void;
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
  const handleSetValue = (
    event: FormEvent<HTMLInputElement>,
    value: string | Date
  ) => {
    setValue(value);
  };
  return (
    <DatePicker
      aria-label={options.name}
      value={value}
      onChange={(event, value) => handleSetValue(event, value)}
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
