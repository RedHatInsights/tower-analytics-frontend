import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, TextInput } from '@patternfly/react-core';
import { optionsForCategories } from '../../constants';

const Date = ({ categoryKey, value = '', setValue = () => {} }) => {
  const options = optionsForCategories[categoryKey];

  return (
    <InputGroup>
      <TextInput
        type="date"
        aria-label={options.name}
        value={value}
        onChange={setValue}
      />
    </InputGroup>
  );
};

Date.propTypes = {
  categoryKey: PropTypes.string.isRequired,
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
};

export default Date;
