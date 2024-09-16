import HostAnomalies from './HostAnomalies';
import MostUsedModules from './MostUsedModules';
import TemplatesExplorer from './TemplatesExplorer';
import { ExpandedTableRowComponent, ExpandedTableRowName } from './types';

export * from './types';

export const getExpandedRowComponent = (
  name?: ExpandedTableRowName
): ExpandedTableRowComponent | null => {
  switch (name) {
    case 'templatesExplorer':
      return TemplatesExplorer;
    case 'hostAnomalies':
      return HostAnomalies;
    case 'mostUsedModules':
      return MostUsedModules;
    default:
      return null;
  }
};
