import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import CaretLeftIcon from '@patternfly/react-icons/dist/esm/icons/caret-left-icon';
import { Card, PageSection } from '@patternfly/react-core';

import DetailsTab from './DetailsTab';
import StatisticsTab from './StatisticsTab';
import ApiErrorState from '../../../Components/ApiStatus/ApiErrorState';

import { PageHeader } from '../../../framework/PageHeader';

import { readPlan } from '../../../Api/';

import SavingsPlanEdit from '../Edit';
import useRequest from '../../../Utilities/useRequest';

const Details = () => {
  const { id } = useParams();
  const location = useLocation();

  const queryParams = { id: [id] };

  let pageTitle = 'Details';
  if (location.pathname.indexOf('/statistics') !== -1) {
    pageTitle = 'Statistics';
  } else if (location.pathname.indexOf('/edit') !== -1) {
    pageTitle = 'Edit plan';
  }

  const {
    result: { rbac, plan },
    isSuccess: dataSuccess,
    error: dataError,
    request: fetchEndpoints,
  } = useRequest(readPlan, {
    plan: {},
    rbac: {
      perms: {},
    },
  });
  useEffect(() => {
    if (!location.pathname.includes('/edit')) fetchEndpoints(id);
  }, [location]);

  useEffect(() => {
    fetchEndpoints(id);
  }, [id]);

  const canWrite =
    dataSuccess && (rbac.perms?.write === true || rbac.perms?.all === true);

  const tabsArray = [
    {
      id: 0,
      name: (
        <>
          <CaretLeftIcon />
          {'Back to Plans'}
        </>
      ),
      link: '../savings-planner',
    },
    { id: 1, name: 'Details', link: `../savings-planner/${id}` },
    {
      id: 2,
      name: 'Statistics',
      link: `../savings-planner/${id}/statistics`,
    },
  ];

  const breadcrumbsItems = dataSuccess
    ? [
        {
          label: 'Savings Planner',
          to: 'ansible/automation-analytics/savings-planner',
        },
        {
          label: plan.name,
          to: `ansible/automation-analytics/savings-planner/${id}`,
        },
      ]
    : [];

  return (
    <>
      {dataError && <ApiErrorState message={dataError.error} />}
      {dataSuccess && (
        <>
          <PageHeader breadcrumbs={breadcrumbsItems} title={pageTitle} />
          <PageSection>
            <Card>
              {location.pathname.includes('edit') && (
                <SavingsPlanEdit data={plan} />
              )}
              {location.pathname.includes('statistics') && (
                <StatisticsTab
                  tabsArray={tabsArray}
                  plan={plan}
                  queryParams={queryParams}
                />
              )}
              {!location.pathname.includes('statistics') &&
                !location.pathname.includes('edit') && (
                  <DetailsTab
                    plan={plan}
                    tabsArray={tabsArray}
                    canWrite={canWrite}
                  />
                )}
            </Card>
          </PageSection>
        </>
      )}
    </>
  );
};

export default Details;
