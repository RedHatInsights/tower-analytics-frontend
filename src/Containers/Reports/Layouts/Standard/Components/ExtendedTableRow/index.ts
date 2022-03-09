import HostAnamolies from './HostAnamolies';
import TemplatesExplorer from './TemplatesExplorer';
import { ExpandedTableRowComponent, ExpandedTableRowName } from './types';
export * from './types';

export const getExpandedRowComponent = (
  name?: ExpandedTableRowName
): ExpandedTableRowComponent | null => {
  switch (name) {
    case ExpandedTableRowName.templatesExplorer:
      return TemplatesExplorer;
    case ExpandedTableRowName.hostAnamolies:
      return HostAnamolies;
    default:
      return null;
  }
};
