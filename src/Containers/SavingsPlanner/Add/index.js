import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { Card, CardBody, PageSection } from '@patternfly/react-core';

import { PageHeader } from '@ansible/ansible-ui-framework';

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
      <PageHeader
        breadcrumbs={[
          {
            label: 'Savings Planner',
            to: '/ansible/automation-analytics/savings-planner',
          },
        ]}
        title={title}
      />
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
