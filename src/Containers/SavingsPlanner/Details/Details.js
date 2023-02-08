import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { CaretLeftIcon } from '@patternfly/react-icons';
import { Card } from '@patternfly/react-core';
import Main from '@redhat-cloud-services/frontend-components/Main';

import DetailsTab from './DetailsTab';
import StatisticsTab from './StatisticsTab';
import ApiErrorState from '../../../Components/ApiStatus/ApiErrorState';

import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';

import Breadcrumbs from '../../../Components/Breadcrumbs';

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
        { title: 'Savings Planner', navigate: '../savings-planner' },
        { title: plan.name, navigate: `../savings-planner/${id}` },
      ]
    : [];

  return (
    <>
      {dataError && <ApiErrorState message={dataError.error} />}
      {dataSuccess && (
        <>
          <PageHeader>
            <Breadcrumbs items={breadcrumbsItems} />
            <PageHeaderTitle title={pageTitle} />
          </PageHeader>
          <Main>
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
          </Main>
        </>
      )}
    </>
  );
};

export default Details;
