// @ts-nocheck
/**
 * PF5 Compatibility Shim for PF6 Migration
 * =========================================
 *
 * This file provides placeholder implementations for PatternFly 5 components
 * that were COMPLETELY REMOVED in PatternFly 6 (not deprecated, removed entirely).
 *
 * These shims allow the application to run during the migration process but
 * provide only basic functionality. Each component needs to be properly migrated
 * to the PF6 equivalent.
 *
 * MIGRATION GUIDE:
 * ----------------
 * | PF5 Component      | PF6 Replacement                    |
 * |--------------------|-------------------------------------|
 * | Select             | Select (composable) or SimpleSelect |
 * | SelectOption       | SelectOption (new API)             |
 * | SelectVariant      | No equivalent - use component props |
 * | Dropdown           | Dropdown (composable) with MenuToggle |
 * | DropdownItem       | DropdownItem (new API)             |
 * | DropdownToggle     | MenuToggle                         |
 * | DropdownPosition   | Use popperProps={{ position: 'right' }} |
 * | KebabToggle        | MenuToggle variant="plain"         |
 *
 * FILES USING THIS SHIM (need migration):
 * - src/Components/Toolbar/Groups/ToolbarInput/Select.tsx
 * - src/Components/Toolbar/Groups/CategoryDropdown.tsx
 * - src/framework/PageForm/Inputs/FormGroupSelect.tsx
 * - src/framework/PageTable/PageToolbar.tsx
 * - src/framework/components/BulkSelector.tsx
 * - src/framework/PageActions/PageDropdownAction.tsx
 * - src/Containers/Reports/List/List.tsx
 * - src/Containers/Reports/Layouts/*/Table/index.tsx
 * - src/Containers/SavingsPlanner/List/ListItem/index.js
 * - src/Containers/SavingsPlanner/Shared/Form/Steps/Details/index.js
 *
 * @see https://www.patternfly.org/components/menus/select
 * @see https://www.patternfly.org/components/menus/dropdown
 */

import React from 'react';

// SelectVariant enum - removed in PF6
export const SelectVariant = {
  single: 'single',
  checkbox: 'checkbox',
  typeahead: 'typeahead',
  typeaheadMulti: 'typeaheadMulti',
} as const;

// DropdownPosition enum - removed in PF6
export const DropdownPosition = {
  right: 'right',
  left: 'left',
} as const;

// SelectOptionObject interface
export interface SelectOptionObject {
  toString(): string;
  compareTo?(selectOption: any): boolean;
}

// Placeholder Select component
export const Select: React.FC<any> = ({
  children,
  isOpen,
  onToggle,
  onSelect,
  selections,
  placeholderText,
  variant,
  ...props
}) => {
  const [open, setOpen] = React.useState(isOpen || false);

  const handleToggle = () => {
    setOpen(!open);
    onToggle?.(!open);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={handleToggle}
        style={{
          padding: '6px 12px',
          border: '1px solid #ccc',
          borderRadius: '3px',
          background: '#fff',
          cursor: 'pointer',
          minWidth: '150px',
          textAlign: 'left',
        }}
      >
        {selections?.toString() || placeholderText || 'Select...'}
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 1000,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '3px',
            minWidth: '150px',
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// Placeholder SelectOption component
export const SelectOption: React.FC<any> = ({
  value,
  children,
  isSelected,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={() => onClick?.(value)}
      style={{
        padding: '8px 12px',
        cursor: 'pointer',
        background: isSelected ? '#e7f1fa' : '#fff',
      }}
      {...props}
    >
      {children || value}
    </div>
  );
};

// Placeholder Dropdown component
export const Dropdown: React.FC<any> = ({
  toggle,
  isOpen,
  dropdownItems,
  onSelect,
  position,
  ...props
}) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {toggle}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            [position === 'right' ? 'right' : 'left']: 0,
            zIndex: 1000,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '3px',
            minWidth: '150px',
          }}
        >
          {dropdownItems}
        </div>
      )}
    </div>
  );
};

// Placeholder DropdownItem component
export const DropdownItem: React.FC<any> = ({
  children,
  onClick,
  isDisabled,
  ...props
}) => {
  return (
    <div
      onClick={isDisabled ? undefined : onClick}
      style={{
        padding: '8px 12px',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// Placeholder DropdownToggle component
export const DropdownToggle: React.FC<any> = ({
  children,
  onToggle,
  isOpen,
  ...props
}) => {
  return (
    <button
      type="button"
      onClick={() => onToggle?.(!isOpen)}
      style={{
        padding: '6px 12px',
        border: '1px solid #ccc',
        borderRadius: '3px',
        background: '#fff',
        cursor: 'pointer',
      }}
      {...props}
    >
      {children}
    </button>
  );
};

// Placeholder DropdownToggleCheckbox component
export const DropdownToggleCheckbox: React.FC<any> = ({
  children,
  isChecked,
  onChange,
  ...props
}) => {
  return (
    <input
      type="checkbox"
      checked={isChecked}
      onChange={(e) => onChange?.(e.target.checked)}
      {...props}
    />
  );
};

// Placeholder KebabToggle component
export const KebabToggle: React.FC<any> = ({ onToggle, isOpen, ...props }) => {
  return (
    <button
      type="button"
      onClick={() => onToggle?.(!isOpen)}
      style={{
        padding: '6px 12px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '16px',
      }}
      {...props}
    >
      &#8942;
    </button>
  );
};

// Placeholder DropdownSeparator component
export const DropdownSeparator: React.FC<any> = (props) => {
  return (
    <hr
      style={{
        margin: '4px 0',
        border: 'none',
        borderTop: '1px solid #ccc',
      }}
      {...props}
    />
  );
};

// Re-export types that might be imported
export type SelectOptionProps = {
  key?: string;
  value?: string;
  description?: string;
  isDisabled?: boolean;
  [key: string]: any;
};
