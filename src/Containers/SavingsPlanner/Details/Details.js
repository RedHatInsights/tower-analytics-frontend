import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { PageSection } from '@patternfly/react-core/dist/dynamic/components/Page';
import CaretLeftIcon from '@patternfly/react-icons/dist/dynamic/icons/caret-left-icon';
import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { readPlan } from '../../../Api/';
import ApiErrorState from '../../../Components/ApiStatus/ApiErrorState';
import useRequest from '../../../Utilities/useRequest';
import { PageHeader } from '../../../framework/PageHeader';
import SavingsPlanEdit from '../Edit';
import DetailsTab from './DetailsTab';
import StatisticsTab from './StatisticsTab';

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
          to: '/ansible/automation-analytics/savings-planner',
        },
        {
          label: plan.name,
          to: `/ansible/automation-analytics/savings-planner/${id}`,
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
