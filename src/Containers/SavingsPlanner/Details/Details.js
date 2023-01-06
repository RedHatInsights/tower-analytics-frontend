import React, { useEffect } from 'react';
import {
  useParams,
  useLocation,
  Route,
  Routes,
} from 'react-router-dom';
import { CaretLeftIcon } from '@patternfly/react-icons';
import { Card } from '@patternfly/react-core';
import Main from '@redhat-cloud-services/frontend-components/Main';

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
  //const history = useHistory();

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
          <Main>
            <Card>
              <Routes>
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
              </Routes>
            </Card>
          </Main>
        </>
      )}
    </>
  );
};

export default Details;
