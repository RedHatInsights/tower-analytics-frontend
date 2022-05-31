/* eslint-disable @typescript-eslint/no-unsafe-return */
import HostAnomalies from './HostAnomalies';
import TemplatesExplorer from './TemplatesExplorer';
import MostUsedModules from './MostUsedModules';
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
