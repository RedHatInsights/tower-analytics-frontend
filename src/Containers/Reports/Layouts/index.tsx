import React from 'react';
import StandardReport from './Standard/ReportCard';
import AutomationCalculator from './AutomationCalculator';
import { ReportSchema } from './types';

const getLayoutComponent = (
  report: ReportSchema,
  fullCard: boolean
): React.ReactElement => {
  switch (report.layoutComponent) {
    case 'standard':
      if (fullCard === true) return <StandardReport {...report.layoutProps} />;
      else return <StandardReport {...report.layoutProps} fullCard={false} />;
    case 'automationCalculator':
      if (fullCard === true)
        return <AutomationCalculator {...report.layoutProps} />;
      else
        return (
          <AutomationCalculator {...report.layoutProps} fullCard={false} />
        );
    default:
      return <></>;
  }
};

export default getLayoutComponent;
