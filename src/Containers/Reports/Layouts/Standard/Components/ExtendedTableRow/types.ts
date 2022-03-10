import { FC } from 'react';
import { LegendEntry } from '../../types';

export enum ExpandedTableRowName {
  templatesExplorer = 'templatesExplorer',
  hostAnomalies = 'hostAnomalies',
}

interface ExpandedTableRowProps {
  isExpanded: boolean;
  item: LegendEntry;
}

export type ExpandedTableRowComponent = FC<ExpandedTableRowProps>;
