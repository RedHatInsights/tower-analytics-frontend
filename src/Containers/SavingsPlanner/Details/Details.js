import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, Route, Switch } from 'react-router-dom';
import { CaretLeftIcon } from '@patternfly/react-icons';
import { Card } from '@patternfly/react-core';
import Main from '@redhat-cloud-services/frontend-components/Main';

import DetailsTab from './DetailsTab';
import StatisticsTab from './StatisticsTab';
import SavingsPlanner from '../List';
import ApiErrorState from '../../../Components/ApiErrorState';
import { notAuthorizedParams } from '../../../Utilities/constants';

import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';

import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';

import Breadcrumbs from '../../../Components/Breadcrumbs';

import { preflightRequest, readPlan, readPlanOptions } from '../../../Api/';

import SavingsPlanEdit from '../Edit';
import useRequest from '../../../Utilities/useRequest';

const Details = () => {
  const { id } = useParams();
  const { state: locationState } = useLocation();
  const [preflightError, setPreFlightError] = useState(null);
  let pageTitle = 'Details';
  let onEdit = false;
  if (locationState?.reload) {
    onEdit = true;
  }
  if (location.pathname.indexOf('/statistics') !== -1) {
    pageTitle = 'Statistics';
  } else if (location.pathname.indexOf('/edit') !== -1) {
    pageTitle = 'Edit plan';
  }
  const [selectedId, setSelectedId] = useState(id);
  const queryParams = { id: [selectedId] };

  const {
    result: { options },
    error,
    isSuccess,
    request: fetchOptions,
  } = useRequest(
    useCallback(async () => {
      setSelectedId(id);
      await preflightRequest().catch((error) => {
        setPreFlightError({ preflightError: error });
      });

      const response = await readPlanOptions();
      return { options: response };
    }, []),
    { options: {} }
  );

  const {
    result: { rbac, plans },
    error: plansError,
    isLoading: plansIsLoading,
    isSuccess: plansIsSuccess,
    request: fetchEndpoints,
  } = useRequest(
    useCallback(async () => {
      setSelectedId(id);
      await preflightRequest().catch((error) => {
        setPreFlightError({ preflightError: error });
      });
      const response = await readPlan({ params: queryParams });
      return {
        plans: response.items,
        rbac: response.rbac,
      };
    }, []),
    { plans: [], rbac: [], plansError, plansIsLoading, plansIsSuccess }
  );

  useEffect(() => {
    fetchOptions();
    fetchEndpoints();
  }, [queryParams]);

  const canWrite =
    isSuccess && (rbac.perms?.write === true || rbac.perms?.all === true);
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
  const breadcrumbsItems = plansIsSuccess
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
      {plansIsSuccess && (
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
                {!onEdit && (
                  <Route path="/savings-planner/:id/details">
                    <DetailsTab
                      plans={plans}
                      tabsArray={tabsArray}
                      canWrite={canWrite}
                      options={options}
                    />
                  </Route>
                )}
                <Route path="/savings-planner/:id/edit">
                  <SavingsPlanEdit data={plans[0]} />
                </Route>
                <Route path="/savings-planner/:id">
                  <DetailsTab
                    plans={plans}
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
