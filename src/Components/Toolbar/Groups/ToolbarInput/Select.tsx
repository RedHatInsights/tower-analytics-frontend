// TODO: The component converts all types to string.
// It should be able to use the correct type in the future for example number and number[].
import { MenuToggle } from '@patternfly/react-core/dist/dynamic/components/MenuToggle';
import { Select as PFSelect } from '@patternfly/react-core/dist/dynamic/components/Select';
import { SelectOption } from '@patternfly/react-core/dist/dynamic/components/Select';
import { SelectList } from '@patternfly/react-core/dist/dynamic/components/Select';
import {
  ToolbarFilter,
  ToolbarLabel,
} from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import { optionsForCategories } from '../../constants';
import { AttributeType, SelectOptionProps, SetValue } from '../../types';
import { handleCheckboxChips, handleSingleChips } from './helpers';

// SelectOptionObject interface for backward compatibility
export interface SelectOptionObject {
  toString(): string;
  compareTo?(selectOption: any): boolean;
}

const OptionSpan = styled('span')`
  display: block;
  overflow-x: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
`;

interface SelectProps {
  categoryKey: string;
  value: AttributeType;
  selectOptions: SelectOptionProps[];
  isVisible?: boolean;
  setValue: SetValue;
}

const renderValues = (
  values: SelectOptionProps[],
  isMultiSelect: boolean,
  selectedValues: string[],
) =>
  values &&
  values.map(({ key, value, description }) => (
    <SelectOption
      key={key}
      value={key}
      description={description}
      data-cy={key}
      hasCheckbox={isMultiSelect}
      isSelected={
        isMultiSelect ? selectedValues.includes(key as string) : undefined
      }
    >
      <Tooltip content={<div>{value}</div>}>
        <OptionSpan>{value}</OptionSpan>
      </Tooltip>
    </SelectOption>
  ));

const Select: FunctionComponent<SelectProps> = ({
  categoryKey,
  value,
  selectOptions: nonTypedSelectOptions,
  isVisible = true,
  setValue,
}) => {
  const [expanded, setExpanded] = useState(false);
  const options = optionsForCategories[categoryKey];
  let selectOptions = nonTypedSelectOptions.map(
    ({ key, value, description }) => ({
      key: key?.toString(),
      value: value?.toString(),
      description: description?.toString(),
    }),
  );

  const selectOptionsMasterCopy = selectOptions;

  selectOptions = selectOptions.slice(0, 500);

  const onDelete = (chip: string) => {
    if (Array.isArray(value)) {
      const keyToDelete = selectOptionsMasterCopy.find(
        ({ value }) => value === chip,
      )?.key;

      const stringValues: string[] = value.map((i) => i.toString());
      const filteredArr = stringValues.filter((item) => item !== keyToDelete);
      setValue(filteredArr);
    } else {
      setValue(null);
    }
  };

  const _onFilter = (_: unknown, textInput: string) => {
    const isMultiSelect = Array.isArray(value);
    const selectedValues = isMultiSelect ? (value as string[]).map(String) : [];
    if (textInput === '')
      return renderValues(selectOptions, isMultiSelect, selectedValues);
    return renderValues(
      selectOptionsMasterCopy
        .filter(({ value }) =>
          value?.toString().toLowerCase().includes(textInput.toLowerCase()),
        )
        .slice(0, 50),
      isMultiSelect,
      selectedValues,
    );
  };

  const handleChips = (): string[] => {
    if (
      (Array.isArray(value) && value.length === 0) ||
      typeof value === 'undefined'
    )
      return [];
    if (Array.isArray(value))
      return handleCheckboxChips(
        value.map((i) => i.toString()),
        selectOptionsMasterCopy,
      );
    return handleSingleChips(value.toString(), selectOptions);
  };

  const getToggleText = (): string => {
    // For filters without chips, show the selected value in the toggle
    if (!options.hasChips && value && !Array.isArray(value)) {
      const selectedOption = selectOptionsMasterCopy.find(
        ({ key }) => key === value.toString(),
      );
      return selectedOption?.value || options.placeholder || '';
    }
    return options.placeholder || '';
  };

  const onSelect = (_: unknown, selection: SelectOptionObject | string) => {
    if (Array.isArray(value)) {
      const stringValues: string[] = value.map((i) => i.toString());
      setValue(
        !stringValues.includes(selection.toString())
          ? [...stringValues, selection]
          : stringValues.filter((item) => item !== selection.toString()),
      );
      // Keep dropdown open for multi-select - don't call setExpanded(false)
    } else {
      setValue(selection);
      setExpanded(false);
    }
  };

  const isMultiSelect = Array.isArray(value);
  const selectedValues = isMultiSelect ? (value as string[]).map(String) : [];

  return (
    <ToolbarFilter
      data-cy={categoryKey}
      key={categoryKey}
      showToolbarItem={isVisible}
      labels={options.hasChips ? handleChips() : []}
      categoryName={options.name}
      deleteLabel={
        options.hasChips
          ? (_: unknown, chip: ToolbarLabel | string) =>
              onDelete(chip as string)
          : undefined
      }
    >
      <PFSelect
        aria-label={options.name}
        toggle={(toggleRef) => (
          <MenuToggle
            ref={toggleRef}
            onClick={() => setExpanded(!expanded)}
            isExpanded={expanded}
          >
            {getToggleText()}
          </MenuToggle>
        )}
        onSelect={onSelect}
        selected={isMultiSelect ? selectedValues : value}
        isOpen={expanded}
        onOpenChange={setExpanded}
        maxMenuHeight={'1000%'}
      >
        <SelectList>
          {renderValues(selectOptions, isMultiSelect, selectedValues)}
        </SelectList>
      </PFSelect>
    </ToolbarFilter>
  );
};

export default Select;
