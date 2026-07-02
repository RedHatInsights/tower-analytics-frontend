import { TextInput } from '@patternfly/react-core/dist/dynamic/components/TextInput';
import { ToolbarFilter } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import PropTypes from 'prop-types';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { optionsForCategories } from '../../constants';
import { SetValue } from '../../types';

interface Props {
  categoryKey: string;
  isVisible?: boolean;
  value?: string;
  setValue: SetValue;
  label?: string;
}

const Text: FunctionComponent<Props> = ({
  categoryKey,
  isVisible = true,
  value = '',
  setValue,
  label,
}) => {
  const [searchVal, setSearchVal] = useState(value);
  const options = optionsForCategories[categoryKey];
  const displayLabel = label ?? options.name;

  const onDelete = () => {
    setValue('');
  };

  const handleChips = () => {
    return value ? [value] : [];
  };

  useEffect(() => {
    setSearchVal(value);
  }, [value]);

  return (
    <ToolbarFilter
      data-cy={categoryKey}
      key={categoryKey}
      showToolbarItem={isVisible}
      labels={options.hasChips ? handleChips() : []}
      categoryName={displayLabel}
      deleteLabel={options.hasChips ? onDelete : undefined}
    >
      <TextInput
        type='search'
        aria-label={options.name}
        value={searchVal}
        onChange={(_event, val) => setSearchVal(val)}
        onKeyDown={(e) => {
          if (e.key && e.key === 'Enter') {
            e.preventDefault();
            setValue(searchVal);
          }
        }}
      />
    </ToolbarFilter>
  );
};

Text.propTypes = {
  categoryKey: PropTypes.string.isRequired,
  value: PropTypes.any,
  isVisible: PropTypes.bool,
  setValue: PropTypes.func.isRequired,
};

export default Text;
