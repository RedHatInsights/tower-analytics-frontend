import React, { FunctionComponent } from 'react';
import Select from './Select';
import DateInput from './Date';
import Text from './Text';
import { optionsForCategories } from '../../constants';
import { AttributeType, SetValue } from './types';
import { SelectOptionProps } from '@patternfly/react-core';

interface ComponentMapper {
  [x: string]: React.ComponentType<any>;
}

const components: ComponentMapper = {
  select: Select,
  date: DateInput,
  text: Text,
};

interface Props {
  categoryKey: string;
  value?: AttributeType;
  selectOptions?: SelectOptionProps[];
  isVisible?: boolean;
  setValue: SetValue;
  [x: string]: any;
}

const ToolbarInput: FunctionComponent<Props> = ({
  categoryKey,
  value,
  selectOptions,
  isVisible = true,
  setValue,
  ...otherProps
}) => {
  const options = optionsForCategories[categoryKey];
  const SelectedInput = components[options.type];

  const defaultValue = () => {
    if (value) {
      return value;
    } else if (options.type !== 'select') {
      return '';
    } else {
      return undefined;
    }
  };

  return (
    <SelectedInput
      categoryKey={categoryKey}
      value={defaultValue()}
      selectOptions={selectOptions}
      isVisible={isVisible}
      setValue={setValue}
      otherProps={otherProps}
    />
  );
};

export default ToolbarInput;
