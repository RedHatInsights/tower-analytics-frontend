import React from 'react';
import PropTypes from 'prop-types';
import Select from './Select';
import Date from './Date';
import Text from './Text';
import { optionsForCategories } from '../../constants';

const components = {
  select: Select,
  date: Date,
  text: Text,
};

const ToolbarInput = ({
  categoryKey,
  value,
  selectOptions,
  isVisible = true,
  setValue,
}) => {
  const options = optionsForCategories[categoryKey];
  const SelectedInput = components[options.type];

  const defaultValue = () => {
    if (value) {
      return value;
    } else if (options.type !== 'select') {
      return '';
    } else if (options.isSingle) {
      return '';
    } else {
      return [];
    }
  };

  return (
    <SelectedInput
      categoryKey={categoryKey}
      value={defaultValue()}
      selectOptions={selectOptions}
      isVisible={isVisible}
      setValue={setValue}
    />
  );
};

ToolbarInput.propTypes = {
  categoryKey: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
  ]),
  selectOptions: PropTypes.array,
  isVisible: PropTypes.bool,
  setValue: PropTypes.func.isRequired,
};

export default ToolbarInput;
