import React from 'react';
import StandardReport from './Standard';
import AutomationCalculator from './AutomationCalculator';
import { LayoutComponentName, ReportSchema } from './types';

const getLayoutComponent = (
  report: ReportSchema,
  fullCard: boolean
): React.ReactElement => {
  switch (report.layoutComponent) {
    case LayoutComponentName.Standard:
      if (fullCard === true) return <StandardReport {...report.layoutProps} />;
      else return <StandardReport {...report.layoutProps} fullCard={false} />;
    case LayoutComponentName.AutomationCalculator:
      if (fullCard === true)
        return <AutomationCalculator {...report.layoutProps} />;
      else
        return (
          <AutomationCalculator {...report.layoutProps} fullCard={false} />
        );
  }
};

export default getLayoutComponent;
