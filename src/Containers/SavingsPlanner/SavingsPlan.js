import React, { useState, useEffect } from 'react';
import { useParams, Route, Switch } from 'react-router-dom';
import { CaretLeftIcon } from '@patternfly/react-icons';

import DetailsTab from './DetailsTab';
import StatisticsTab from './StatisticsTab';
import SavingsPlanner from './SavingsPlanner';
import ApiErrorState from '../../Components/ApiErrorState';
import { notAuthorizedParams } from '../../Utilities/constants';

import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import Breadcrumbs from '../../Components/Breadcrumbs';

import {preflightRequest, readPlan} from '../../Api';

import useApi from '../../Utilities/useApi';

const SavingsPlan = () => {
  let { id } = useParams();
  const [preflightError, setPreFlightError] = useState(null);
  const pageTitle =
    location.pathname.indexOf('/statistics') !== -1 ? 'Statistics' : 'Details';
  const [selectedId, setSelectedId] = useState(id);
  const [
    {
      isSuccess,
      error,
      data: { items: plans = [] },
    },
    setData,
  ] = useApi({ items: [] });
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
    { id: 2, name: 'Statistics', link: `/savings-planner/${selectedId}/statistics` },
  ];

  const showCardHeader = !location.pathname.endsWith('edit');
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
        <React.Fragment>
          <PageHeader>
            <Breadcrumbs items={breadcrumbsItems} />
            <PageHeaderTitle title={pageTitle} />
          </PageHeader>
          {showCardHeader && (
            <Switch>
              <Route path="/savings-planner/:id/statistics">
                <StatisticsTab tabsArray={tabsArray} data={plans[0]} queryParams={queryParams} />
              </Route>
              <Route path="/savings-planner/:id/details">
                <DetailsTab plans={plans} tabsArray={tabsArray} />
              </Route>
              <Route path="/savings-planner/:id">
                <DetailsTab plans={plans} tabsArray={tabsArray} />
              </Route>
              <Route exact path="/savings-planner">
                <SavingsPlanner />
              </Route>
            </Switch>
          )}
        </React.Fragment>
      )}
    </>
  );
};

export default SavingsPlan;
