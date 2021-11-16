import DefaultReport from './Default/';
import AutomationCalculator from './AutomationCalculator';
import { FunctionComponent } from 'react';
import { ReportGeneratorParams } from '../Shared/types';

export enum ReportLayout {
  DEFAULT = 'default',
  AUTOMATION_CALCULATOR = 'automationCalculator',
}

const getReportComponent = (
  layout: ReportLayout
): FunctionComponent<ReportGeneratorParams> => {
  switch (layout) {
    case ReportLayout.DEFAULT:
      return DefaultReport;
    case ReportLayout.AUTOMATION_CALCULATOR:
      // TODO remove as when AutomationCalculator is TS ready
      return AutomationCalculator as FunctionComponent<ReportGeneratorParams>;
    default:
      // In case we are passing it from js or api incorrectly.
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Report layout ${layout} not found`);
  }
};

export default getReportComponent;
