import React, { useEffect, useCallback } from 'react';
import {
  useHistory,
  useParams,
  useLocation,
  Route,
  Switch,
} from 'react-router-dom';
import { CaretLeftIcon } from '@patternfly/react-icons';
import { Card, EmptyState } from '@patternfly/react-core';
import Main from '@redhat-cloud-services/frontend-components/Main';

import DetailsTab from './DetailsTab';
import StatisticsTab from './StatisticsTab';
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
  const history = useHistory();

  const queryParams = { id: [id] };

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
    useCallback(() => readPlan(id), [id]),
    { plan: {}, rbac: [] }
  );

  useEffect(() => {
    fetchOptions();
    setPreflight();

    const unlisten = history.listen(({ pathname }) => {
      if (!pathname.includes('/edit')) fetchEndpoints();
    });

    return unlisten;
  }, []);

  useEffect(() => {
    fetchEndpoints();
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
      {error && <ApiErrorState message={error.error} />}
      {planIsSuccess && (
        <>
          <PageHeader>
            <Breadcrumbs items={breadcrumbsItems} />
            <PageHeaderTitle title={pageTitle} />
          </PageHeader>
          <Main>
            <Card>
              <Switch>
                <Route exact path="/savings-planner/:id/edit">
                  <SavingsPlanEdit data={plan} />
                </Route>
                <Route exact path="/savings-planner/:id/statistics">
                  <StatisticsTab
                    tabsArray={tabsArray}
                    plan={plan}
                    queryParams={queryParams}
                  />
                </Route>
                <Route
                  exact
                  path={[
                    '/savings-planner/:id',
                    '/savings-planner/:id/details',
                  ]}
                >
                  <DetailsTab
                    plan={plan}
                    tabsArray={tabsArray}
                    canWrite={canWrite}
                    options={options}
                  />
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
