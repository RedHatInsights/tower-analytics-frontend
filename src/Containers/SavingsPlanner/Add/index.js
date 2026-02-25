import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { PageSection } from '@patternfly/react-core/dist/dynamic/components/Page';
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { readPlanOptions } from '../../../Api/';
import useRequest from '../../../Utilities/useRequest';
import { PageHeader } from '../../../framework/PageHeader';
import { Paths } from '../../../paths';
import Form from '../Shared/Form';

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
      <PageSection hasBodyWrapper={false}>
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
