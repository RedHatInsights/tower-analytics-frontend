/* eslint-disable @typescript-eslint/no-unsafe-return */
import HostAnomalies from './HostAnomalies';
import TemplatesExplorer from './TemplatesExplorer';
import { ExpandedTableRowComponent, ExpandedTableRowName } from './types';
export * from './types';

export const getExpandedRowComponent = (
  name?: ExpandedTableRowName
): ExpandedTableRowComponent | null => {
  switch (name) {
    case ExpandedTableRowName.templatesExplorer:
      return TemplatesExplorer;
    case ExpandedTableRowName.hostAnomalies:
      return HostAnomalies;
    default:
      return null;
  }
};
