import React from 'react';
import StandardReport from './Standard';
import AutomationCalculator from './AutomationCalculator';
import { ReportSchema } from './types';

const getLayoutComponent = (
  report: ReportSchema | string,
  fullCard: boolean
): React.ReactElement => {
  if (typeof report === 'string') {
    console.log('string');
    return <></>;
  } else {
    switch (report.layoutComponent) {
      case 'standard':
        if (fullCard === true)
          return <StandardReport {...report.layoutProps} />;
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
  }
};

export default getLayoutComponent;
