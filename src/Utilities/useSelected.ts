import { useState } from 'react';

interface Return<T> {
  selected: T[];
  isAllSelected: boolean;
  handleSelect: (id: T) => void;
  setSelected: (selected: T[]) => void;
}

/**
 * useSelected hook provides a way to read and update a selected list
 * Param: array of list items
 * Returns: {
 *  selected: array of selected list items
 *  isAllSelected: boolean that indicates if all items are selected
 *  handleSelect: function that adds and removes items from selected list
 *  setSelected: setter function
 * }
 */
const useSelected = <T extends string | number>(list: T[] = []): Return<T> => {
  const [selected, setSelected] = useState<T[]>([]);
  const isAllSelected = selected.length > 0 && selected.length === list.length;

  const handleSelect = (id: T) => {
    if (selected.some((s) => s === id)) {
      setSelected((prevState) => [...prevState.filter((i) => i !== id)]);
    } else {
      setSelected((prevState) => [...prevState, id]);
    }
  };

  return { selected, isAllSelected, handleSelect, setSelected };
};

export default useSelected;
