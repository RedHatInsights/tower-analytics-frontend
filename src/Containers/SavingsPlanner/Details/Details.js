import React, { useEffect, useCallback } from 'react';
import { useParams, useLocation, Route, Switch } from 'react-router-dom';
import { CaretLeftIcon } from '@patternfly/react-icons';
import { Card, EmptyState } from '@patternfly/react-core';
import Main from '@redhat-cloud-services/frontend-components/Main';

import DetailsTab from './DetailsTab';
import StatisticsTab from './StatisticsTab';
import SavingsPlanner from '../List';
import ApiErrorState from '../../../Components/ApiErrorState';

import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';

import Breadcrumbs from '../../../Components/Breadcrumbs';

import { preflightRequest, readPlan, readPlanOptions } from '../../../Api/';

import SavingsPlanEdit from '../Edit';
import useRequest from '../../../Utilities/useRequest';

const Details = () => {
  const { id } = useParams();
  const location = useLocation();

  const queryParams = { id: [id] };
  const onEdit = !!location.state?.reload;

  let pageTitle = 'Details';
  if (location.pathname.indexOf('/statistics') !== -1) {
    pageTitle = 'Statistics';
  } else if (location.pathname.indexOf('/edit') !== -1) {
    pageTitle = 'Edit plan';
  }

  const { error: preflightError, request: setPreflight } = useRequest(
    useCallback(() => preflightRequest(), [])
  );

  const {
    result: options,
    error,
    request: fetchOptions,
  } = useRequest(() => readPlanOptions(), {});

  const {
    result: { rbac, plan },
    isSuccess: planIsSuccess,
    request: fetchEndpoints,
  } = useRequest(
    useCallback((id) => readPlan(id), []),
    { plan: {}, rbac: [] }
  );

  useEffect(() => {
    fetchOptions();
    setPreflight();
  }, []);

  useEffect(() => {
    fetchEndpoints(id);
  }, [id]);

  const canWrite =
    planIsSuccess && (rbac.perms?.write === true || rbac.perms?.all === true);

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
    { id: 1, name: 'Details', link: `/savings-planner/${id}/details` },
    {
      id: 2,
      name: 'Statistics',
      link: `/savings-planner/${id}/statistics`,
    },
  ];

  const breadcrumbUrl = `/savings-planner/${id}`;
  const breadcrumbsItems = planIsSuccess
    ? [
        { title: 'Savings Planner', navigate: '/savings-planner' },
        { title: plan.name, navigate: breadcrumbUrl },
      ]
    : [];

  if (preflightError) {
    return <EmptyState preflightError={preflightError} />;
  }

  return (
    <>
      {error && (
        <>
          <ApiErrorState message={error.error} />
        </>
      )}
      {planIsSuccess /* Todo this does not chaeck if plan is actually an array */ && (
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
                    data={plan}
                    queryParams={queryParams}
                  />
                </Route>
                {!onEdit && (
                  <Route path="/savings-planner/:id/details">
                    <DetailsTab
                      plans={[plan]}
                      tabsArray={tabsArray}
                      canWrite={canWrite}
                      options={options}
                    />
                  </Route>
                )}
                <Route path="/savings-planner/:id/edit">
                  <SavingsPlanEdit data={plan} />
                </Route>
                <Route path="/savings-planner/:id">
                  <DetailsTab
                    plans={[plan]}
                    tabsArray={tabsArray}
                    canWrite={canWrite}
                    options={options}
                  />
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

export default Details;
