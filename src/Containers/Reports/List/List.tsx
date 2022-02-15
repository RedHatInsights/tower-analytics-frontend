import React, { FunctionComponent } from 'react';
import Main from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Gallery } from '@patternfly/react-core';

import ListItem from './ListItem';
import { getAllReports } from '../Shared/schemas';
import { useFlag } from '@unleash/proxy-client-react';
import { ValidFeatureFlags } from '../../../FeatureFlags';

const List: FunctionComponent<Record<string, never>> = () => {
  const moduleReportsEnabled = useFlag(ValidFeatureFlags.moduleReports);
  const newAutomationCalculator = useFlag(
    ValidFeatureFlags.newAutomationCalculator
  );
  const aa21OnboardingReportEnabled = useFlag(
    ValidFeatureFlags.onboardingReports
  );
  return (
    <>
      <PageHeader>
        <PageHeaderTitle title={'Reports'} />
      </PageHeader>
      <Main>
        <Gallery
          data-testid="all_reports"
          hasGutter
          minWidths={{
            sm: '307px',
            md: '307px',
            lg: '307px',
            xl: '307px',
            '2xl': '307px',
          }}
        >
          {getAllReports(
            moduleReportsEnabled,
            newAutomationCalculator,
            aa21OnboardingReportEnabled
          ).map((report) => (
            <ListItem key={report.layoutProps.slug} report={report} />
          ))}
        </Gallery>
      </Main>
    </>
  );
};

export default List;
