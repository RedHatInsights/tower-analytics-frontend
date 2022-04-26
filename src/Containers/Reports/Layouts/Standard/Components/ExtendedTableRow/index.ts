/* eslint-disable @typescript-eslint/no-unsafe-return */
import HostAnomalies from './HostAnomalies';
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
    default:
      return null;
  }
};
