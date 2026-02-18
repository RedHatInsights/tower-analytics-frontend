import {
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
} from '@patternfly/react-core';

// SelectVariant enum for backward compatibility
const SelectVariant = {
  single: 'single',
  checkbox: 'checkbox',
  typeahead: 'typeahead',
  typeaheadMulti: 'typeaheadMulti',
} as const;

import { ToolbarItem } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import React, { FunctionComponent, useState } from 'react';

interface Props {
  categoryKey: string;
  selected: string;
  setSelected: (value: string) => void;
  categories: {
    key: string;
    name: string;
  }[];
}

const CategoryDropdown: FunctionComponent<Props> = ({
  categoryKey,
  selected,
  setSelected = () => null,
  categories = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <ToolbarItem data-cy={categoryKey}>
      <Select
        isOpen={isExpanded}
        aria-label={'Categories'}
        onOpenChange={(isOpen) => setIsExpanded(isOpen)}
        onSelect={(_, selection) => {
          setSelected(selection as string);
          setIsExpanded(false);
        }}
        selected={selected}
        toggle={(toggleRef) => (
          <MenuToggle
            ref={toggleRef}
            onClick={() => setIsExpanded(!isExpanded)}
            isExpanded={isExpanded}
            isFullWidth
          >
            {selected || 'Filter by'}
          </MenuToggle>
        )}
      >
        <SelectList>
          {categories.map(({ key, name }) => (
            <SelectOption key={key} value={key}>
              {name}
            </SelectOption>
          ))}
        </SelectList>
      </Select>
    </ToolbarItem>
  );
};

export default CategoryDropdown;
