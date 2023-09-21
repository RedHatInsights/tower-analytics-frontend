import React from 'react';
import StandardReport from './Standard';
import AutomationCalculator from './AutomationCalculator';
import { ReportSchema } from './types';

const getLayoutComponent = (
  report: ReportSchema,
  fullCard: boolean
): React.ReactElement => {
  //console.log('calling getLayoutComponent');
  switch (report.layoutComponent) {
    case 'standard':
      //console.log('getLayoutComponent, in switch case "standard"');
      if (fullCard === true) return <StandardReport {...report.layoutProps} />;
      else return <StandardReport {...report.layoutProps} fullCard={false} />;
    case 'automationCalculator':
      //console.log('getLayoutComponent, in switch case "automation calculator"');
      if (fullCard === true)
        return <AutomationCalculator {...report.layoutProps} />;
      else
        return (
          <AutomationCalculator {...report.layoutProps} fullCard={false} />
        );
    default:
      //console.log('getLayoutComponent, in switch case "default"');
      return <></>;
  }
};

export default getLayoutComponent;
