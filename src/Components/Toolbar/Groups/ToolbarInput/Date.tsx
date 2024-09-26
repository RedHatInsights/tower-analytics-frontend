import { DatePicker } from '@patternfly/react-core/dist/dynamic/components/DatePicker';
import PropTypes from 'prop-types';
import React, { FunctionComponent } from 'react';
import { optionsForCategories } from '../../constants';

interface Props {
  categoryKey: string;
  value?: string;
  setValue?: (value: string | Date | undefined) => void;
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
  const handleSetValue = (value: string | Date | undefined) => {
    setValue(value);
  };
  return (
    <DatePicker
      aria-label={options.name}
      id={categoryKey}
      key={categoryKey}
      value={value}
      onChange={(_event, value) => handleSetValue(value)}
      inputProps={{
        readOnly: true,
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
