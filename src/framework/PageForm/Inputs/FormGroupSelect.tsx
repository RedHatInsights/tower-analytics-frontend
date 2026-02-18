import {
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
} from '@patternfly/react-core';

// SelectVariant enum for backward compatibility
export const SelectVariant = {
  single: 'single',
  checkbox: 'checkbox',
  typeahead: 'typeahead',
  typeaheadMulti: 'typeaheadMulti',
} as const;

// SelectOptionObject interface for backward compatibility
export interface SelectOptionObject {
  toString(): string;
  compareTo?(selectOption: any): boolean;
}

// SelectProps type for compatibility
type SelectProps = any;
import React, { ChangeEvent, ReactElement, useCallback, useState } from 'react';
import { PageFormGroup, PageFormGroupProps } from './PageFormGroup';

export type FormGroupSelectProps = Pick<
  SelectProps,
  | 'footer'
  | 'isCreatable'
  | 'isGrouped'
  | 'onSelect'
  | 'placeholderText'
  | 'value'
  | 'isDisabled'
> &
  PageFormGroupProps & {
    isReadOnly?: boolean;
    placeholderText: string | React.ReactNode;
  };

/** A PatternFly FormGroup with a PatternFly Select */
export function FormGroupSelect(props: FormGroupSelectProps) {
  const { children, helperTextInvalid, isReadOnly, onSelect, value } = props;

  const [open, setOpen] = useState(false);
  const onToggle = useCallback(() => setOpen((open) => !open), []);

  const onSelectHandler = useCallback(
    (
      event: React.MouseEvent<Element, MouseEvent> | undefined,
      value: string | number | undefined,
    ) => {
      if (typeof value === 'string') onSelect?.(event as any, value);
      else if (value !== undefined) onSelect?.(event as any, value.toString());
      setOpen(false);
    },
    [onSelect],
  );

  return (
    <PageFormGroup {...props}>
      <Select
        aria-describedby={props.id ? `${props.id}-form-group` : undefined}
        isOpen={open}
        selected={value}
        onSelect={onSelectHandler}
        onOpenChange={(isOpen) => setOpen(isOpen)}
        toggle={(toggleRef) => (
          <MenuToggle
            ref={toggleRef}
            onClick={() => setOpen(!open)}
            isExpanded={open}
            isDisabled={props.isDisabled || isReadOnly}
            isFullWidth
            status={helperTextInvalid ? 'danger' : undefined}
          >
            {value || props.placeholderText || 'Select...'}
          </MenuToggle>
        )}
      >
        <SelectList>{children as ReactElement[]}</SelectList>
      </Select>
    </PageFormGroup>
  );
}
