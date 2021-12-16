import TemplatesExplorer from './TemplatesExplorer';
import { ExpandedTableRowComponent, ExpandedTableRowName } from './types';
export * from './types';

export const getExpandedRowComponent = (
  name?: ExpandedTableRowName
): ExpandedTableRowComponent | null => {
  switch (name) {
    case ExpandedTableRowName.templatesExplorer:
      return TemplatesExplorer;
    default:
      return null;
  }
};
