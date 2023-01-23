import React, { useEffect } from 'react';
import {
  useHistory,
  useParams,
  useLocation,
  Route,
  Switch,
} from 'react-router-dom';
import { CaretLeftIcon } from '@patternfly/react-icons';
import { Card, PageSection } from '@patternfly/react-core';

import DetailsTab from './DetailsTab';
import StatisticsTab from './StatisticsTab';
import ApiErrorState from '../../../Components/ApiStatus/ApiErrorState';
import { paths as savingsPaths } from '../index';

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
  const history = useHistory();

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
    const unlisten = history.listen(({ pathname }) => {
      if (!pathname.includes('/edit')) fetchEndpoints(id);
    });

    return unlisten;
  }, []);

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
      link: savingsPaths.get,
    },
    { id: 1, name: 'Details', link: savingsPaths.getDetails(id) },
    {
      id: 2,
      name: 'Statistics',
      link: `${savingsPaths.getDetails(id)}/statistics`,
    },
  ];

  const breadcrumbsItems = dataSuccess
    ? [
        { title: 'Savings Planner', navigate: savingsPaths.get },
        { title: plan.name, navigate: savingsPaths.getDetails(id) },
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
          <PageSection>
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
                <Route exact path={savingsPaths.details}>
                  <DetailsTab
                    plan={plan}
                    tabsArray={tabsArray}
                    canWrite={canWrite}
                  />
                </Route>
              </Switch>
            </Card>
          </PageSection>
        </>
      )}
    </>
  );
};

export default Details;
