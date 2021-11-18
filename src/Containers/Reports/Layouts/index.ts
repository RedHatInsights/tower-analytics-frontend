import StandardReport from './Standard';
import AutomationCalculator from './AutomationCalculator';
import { FunctionComponent } from 'react';
import { ReportGeneratorParams } from '../Shared/types';

export enum LayoutComponentName {
  standard = 'standard',
  automationCalculator = 'automationCalculator',
}

const getLayoutComponent = (
  layout: LayoutComponentName
): FunctionComponent<ReportGeneratorParams> => {
  switch (layout) {
    case LayoutComponentName.standard:
      return StandardReport;
    case LayoutComponentName.automationCalculator:
      // TODO remove as when AutomationCalculator is TS ready
      return AutomationCalculator as FunctionComponent<ReportGeneratorParams>;
    default:
      // In case we are passing it from js or api incorrectly.
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Report layout ${layout} not found`);
  }
};

export default getLayoutComponent;
