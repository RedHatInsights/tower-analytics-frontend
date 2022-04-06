import { FC } from 'react';
import { Endpoint, Params } from '../../../Api';
import { TagName } from '../Shared/constants';
import { AttributesType } from '../Shared/types';
import { ExpandedTableRowName } from './Standard/Components';

export enum LayoutComponentName {
  Standard = 'standard',
  AutomationCalculator = 'automationCalculator',
}

export interface BaseReportProps {
  slug: string;
  name: string;
  description: string;
  tags: TagName[];
  schema: unknown;
}

export interface AutmationCalculatorProps extends BaseReportProps {
  defaultParams: Params;
  dataEndpoint: Endpoint;
  optionsEndpoint: Endpoint;
  fullCard?: boolean;
}

export interface StandardProps extends BaseReportProps {
  defaultParams: Params;
  tableHeaders: AttributesType;
  expandedTableRowName?: ExpandedTableRowName;
  availableChartTypes: string[];
  defaultSelectedToolbarCategory?: string;
  dataEndpoint: Endpoint;
  optionsEndpoint: Endpoint;
  fullCard?: boolean;
}

export type ReportSchema =
  | {
      layoutComponent: LayoutComponentName.Standard;
      layoutProps: StandardProps;
    }
  | {
      layoutComponent: LayoutComponentName.AutomationCalculator;
      layoutProps: AutmationCalculatorProps;
    };

export type ReportComponentType =
  | FC<AutmationCalculatorProps>
  | FC<StandardProps>;
