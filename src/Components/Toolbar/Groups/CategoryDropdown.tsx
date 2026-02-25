import { MenuToggle } from '@patternfly/react-core/dist/dynamic/components/MenuToggle';
import { Select } from '@patternfly/react-core/dist/dynamic/components/Select';
import { SelectOption } from '@patternfly/react-core/dist/dynamic/components/Select';
import { SelectList } from '@patternfly/react-core/dist/dynamic/components/Select';
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
  const selectedCategory = categories.find(({ key }) => key === selected);
  const displayText = selectedCategory?.name || 'Filter by';

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
            {displayText}
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
