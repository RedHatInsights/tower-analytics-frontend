export type LegendEntry = Record<string, string | number>;
export type TableHeaders = { key: string; value: string }[];
export type TableSortParams = {
  sort?: {
    sortBy: {
      index: number;
      direction: 'asc' | 'desc';
    };
    onSort: (_event: unknown, index: number, direction: 'asc' | 'desc') => void;
    columnIndex: number;
  };
};
