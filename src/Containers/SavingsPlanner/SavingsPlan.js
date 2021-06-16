import React, { useState, useEffect } from 'react';
import { useParams, Route, Switch } from 'react-router-dom';
import { CaretLeftIcon } from '@patternfly/react-icons';
import { Card } from '@patternfly/react-core';
import Main from '@redhat-cloud-services/frontend-components/Main';

import DetailsTab from './DetailsTab';
import StatisticsTab from './StatisticsTab';
import SavingsPlanner from './SavingsPlanner';
import ApiErrorState from '../../Components/ApiErrorState';
import { notAuthorizedParams } from '../../Utilities/constants';

import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';

import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';

import Breadcrumbs from '../../Components/Breadcrumbs';

import { preflightRequest, readPlan } from '../../Api';

import useApi from '../../Utilities/useApi';

import SavingsPlanEdit from './Edit';

const SavingsPlan = () => {
  let { id } = useParams();
  const [preflightError, setPreFlightError] = useState(null);
  let pageTitle = 'Details';
  if (location.pathname.indexOf('/statistics') !== -1) {
    pageTitle = 'Statistics';
  } else if (location.pathname.indexOf('/edit') !== -1) {
    pageTitle = 'Edit plan';
  }
  const [selectedId, setSelectedId] = useState(id);
  const [
    {
      isSuccess,
      error,
      data: { rbac = {}, items: plans = [] },
    },
    setData,
  ] = useApi({ rbac: {}, items: [] });
  const queryParams = { id: [selectedId] };

  useEffect(() => {
    setSelectedId(id);
    preflightRequest().catch((error) => {
      setPreFlightError({ preflightError: error });
    });
    const fetchEndpoints = () => {
      setData(readPlan({ params: queryParams }));
    };

    fetchEndpoints();
  }, []);

  const canWrite = isSuccess && (rbac.perms?.write === true || rbac.perms?.all === true);
  const tabsArray = [
    {
      id: 0,
      name: (
        <>
          <CaretLeftIcon />
          {'Back to Plans'}
        </>
      ),
      link: `/savings-planner`,
    },
    { id: 1, name: 'Details', link: `/savings-planner/${selectedId}/details` },
    {
      id: 2,
      name: 'Statistics',
      link: `/savings-planner/${selectedId}/statistics`,
    },
  ];

  const breadcrumbUrl = `/savings-planner/${selectedId}`;
  const breadcrumbsItems = isSuccess
    ? [
        { title: 'Savings Planner', navigate: '/savings-planner' },
        { title: plans[0].name, navigate: breadcrumbUrl },
      ]
    : [];
  if (preflightError?.preflightError?.status === 403) {
    return <NotAuthorized {...notAuthorizedParams} />;
  }
  return (
    <>
      {error && (
        <>
          <ApiErrorState message={error.error} />
        </>
      )}
      {isSuccess && (
        <>
          <PageHeader>
            <Breadcrumbs items={breadcrumbsItems} />
            <PageHeaderTitle title={pageTitle} />
          </PageHeader>
          <Main>
            <Card>
              <Switch>
                <Route path="/savings-planner/:id/statistics">
                  <StatisticsTab
                    tabsArray={tabsArray}
                    data={plans[0]}
                    queryParams={queryParams}
                  />
                </Route>
                <Route path="/savings-planner/:id/details">
                  <DetailsTab plans={plans} tabsArray={tabsArray} canWrite={canWrite} />
                </Route>
                <Route path="/savings-planner/:id/edit">
                  <SavingsPlanEdit data={plans[0]} />
                </Route>
                <Route path="/savings-planner/:id">
                  <DetailsTab plans={plans} tabsArray={tabsArray} canWrite={canWrite} />
                </Route>
                <Route exact path="/savings-planner">
                  <SavingsPlanner />
                </Route>
              </Switch>
            </Card>
          </Main>
        </>
      )}
    </>
  );
};

export default SavingsPlan;
