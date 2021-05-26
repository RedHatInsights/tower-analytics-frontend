import React from 'react';
import PropTypes from 'prop-types';
import ToolbarSelectInput from './ToolbarSelectInput';
import ToolbarDateinput from './ToolbarDateinput';
import ToolbarTextInput from './ToolbarTextInput';
import { optionsForCategories } from '../../constants';

const components = {
  select: ToolbarSelectInput,
  date: ToolbarDateinput,
  text: ToolbarTextInput,
};

const ToolbarItem = ({
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

ToolbarItem.propTypes = {
  categoryKey: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  selectOptions: PropTypes.array,
  isVisible: PropTypes.bool,
  setValue: PropTypes.func.isRequired,
};

export default ToolbarItem;
