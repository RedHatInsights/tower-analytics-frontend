import BulkSelect from '@redhat-cloud-services/frontend-components/BulkSelect';
import React, { useCallback, useMemo } from 'react';

export interface BulkSelectorProps<T> {
  itemCount?: number;
  pageItems?: T[];
  selectedItems?: T[];
  selectItems?: (items: T[]) => void;
  unselectAll?: () => void;
  keyFn: (item: T) => string | number;
  selectNoneText?: string;
}

export function BulkSelector<T extends object>(props: BulkSelectorProps<T>) {
  const { pageItems, selectedItems, selectItems, unselectAll } = props;

  const allPageItemsSelected =
    props.itemCount !== undefined &&
    props.itemCount > 0 &&
    pageItems &&
    pageItems.length > 0 &&
    (pageItems ?? []).every((item) => selectedItems?.includes(item));

  const selectedCount = selectedItems ? selectedItems.length : 0;

  const onSelect = useCallback(
    (checked: boolean) => {
      if (checked) {
        selectItems?.(pageItems ?? []);
      } else {
        unselectAll?.();
      }
    },
    [selectItems, unselectAll, pageItems],
  );

  const bulkSelectItems = useMemo(() => {
    return [
      {
        title: props.selectNoneText ?? 'Select none',
        onClick: () => {
          unselectAll?.();
        },
      },
      {
        title: `Select page (${pageItems?.length ?? 0} items)`,
        onClick: () => {
          selectItems?.(pageItems ?? []);
        },
      },
    ];
  }, [props.selectNoneText, unselectAll, selectItems, pageItems]);

  return (
    <BulkSelect
      count={selectedCount}
      items={bulkSelectItems}
      checked={allPageItemsSelected ? true : selectedCount > 0 ? null : false}
      onSelect={(_event, checked) => {
        // BulkSelect passes the checkbox change event
        if (typeof checked === 'boolean') {
          onSelect(checked);
        }
      }}
    />
  );
}
