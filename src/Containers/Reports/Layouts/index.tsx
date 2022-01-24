import React from 'react';
import StandardReport from './Standard';
import AutomationCalculator from './AutomationCalculator';
import { LayoutComponentName, ReportSchema } from './types';

const getLayoutComponent = (report: ReportSchema): React.ReactElement => {
  switch (report.layoutComponent) {
    case LayoutComponentName.Standard:
      return <StandardReport {...report.layoutProps} />;
    case LayoutComponentName.AutomationCalculator:
      return <AutomationCalculator {...report.layoutProps} />;
  }
};

export default getLayoutComponent;
