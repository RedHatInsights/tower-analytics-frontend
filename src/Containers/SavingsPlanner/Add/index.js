import React, { useCallback, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { Card, CardBody } from '@patternfly/react-core';

import Main from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';

import Breadcrumbs from '../../../Components/Breadcrumbs';

import { readPlanOptions } from '../../../Api/';

import Form from '../Shared/Form';

import { Paths } from '../../../paths';
import useRequest from '../../../Utilities/useRequest';

const Add = () => {
  const {
    result: options,
    isSuccess,
    request: fetchPlanOptions,
  } = useRequest(
    useCallback(async () => {
      const response = await readPlanOptions();
      return {
        data: response,
      };
    }, []),
    {
      options: {},
    }
  );

  useEffect(() => {
    fetchPlanOptions();
  }, [fetchPlanOptions]);

  const canWrite =
    isSuccess &&
    (options.data?.meta?.rbac?.perms?.write === true ||
      options.data?.meta?.rbac?.perms?.all === true);
  const title = 'Create new plan';

  const showAdd = () => (
    <>
      <PageHeader>
        <Breadcrumbs
          items={[{ title: 'Savings Planner', navigate: '/savings-planner' }]}
        />
        <PageHeaderTitle title={title} />
      </PageHeader>
      <Main>
        <Card>
          <CardBody>
            <Form title={title} options={options} />
          </CardBody>
        </Card>
      </Main>
    </>
  );
  if (isSuccess) {
    return canWrite ? showAdd() : <Redirect to={Paths.savingsPlanner} />;
  }
  return null;
};

export default Add;
