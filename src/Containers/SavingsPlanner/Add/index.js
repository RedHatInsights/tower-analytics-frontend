import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { Card, CardBody, PageSection } from '@patternfly/react-core';

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
  } = useRequest(readPlanOptions, {});

  useEffect(() => {
    fetchPlanOptions({});
  }, []);

  const canWrite =
    isSuccess &&
    (options.meta?.rbac?.perms?.write === true ||
      options.meta?.rbac?.perms?.all === true);
  const title = 'Create new plan';

  const showAdd = () => (
    <>
      <PageHeader>
        <Breadcrumbs
          items={[{ title: 'Savings Planner', navigate: '../savings-planner' }]}
        />
        <PageHeaderTitle title={title} />
      </PageHeader>
      <PageSection>
        <Card>
          <CardBody>
            <Form title={title} options={options} />
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
  if (isSuccess) {
    return canWrite ? showAdd() : <Navigate to={Paths.savingsPlanner} />;
  }
  return null;
};

export default Add;
