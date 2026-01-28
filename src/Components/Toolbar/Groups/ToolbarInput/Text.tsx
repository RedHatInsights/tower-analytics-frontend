import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { InputGroupItem } from '@patternfly/react-core/dist/dynamic/components/InputGroup';
import { InputGroup } from '@patternfly/react-core/dist/dynamic/components/InputGroup';
import { TextInput } from '@patternfly/react-core/dist/dynamic/components/TextInput';
import { ToolbarFilter } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import SearchIcon from '@patternfly/react-icons/dist/dynamic/icons/search-icon';
import PropTypes from 'prop-types';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { optionsForCategories } from '../../constants';
import { SetValue } from '../../types';

interface Props {
  categoryKey: string;
  isVisible?: boolean;
  value?: string;
  setValue: SetValue;
}

const Text: FunctionComponent<Props> = ({
  categoryKey,
  isVisible = true,
  value = '',
  setValue,
}) => {
  const [searchVal, setSearchVal] = useState(value);
  const options = optionsForCategories[categoryKey];

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
      categoryName={options.name}
      deleteLabel={options.hasChips ? onDelete : undefined}
    >
      <InputGroup>
        <InputGroupItem isFill>
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
        </InputGroupItem>
        <InputGroupItem>
          <Button icon={<SearchIcon />}
            variant='control'
            aria-label={`Search button for ${options.name}`}
            onClick={() => {
              setValue(searchVal);
            }}
          >
            
          </Button>
        </InputGroupItem>
      </InputGroup>
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
