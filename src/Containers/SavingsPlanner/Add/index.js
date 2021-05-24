import React, { useEffect } from 'react';

import { Card, CardBody } from '@patternfly/react-core';

import Main from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';

import Breadcrumbs from '../../../Components/Breadcrumbs';

import useApi from '../../../Utilities/useApi';

import { readPlanOptions } from '../../../Api';

import Form from '../Shared/Form';

const Add = () => {
  const [options, setOptions] = useApi({});

  useEffect(() => {
    setOptions(readPlanOptions());
  }, []);

  const title = 'Create new plan';

  return (
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
            {options.isSuccess && <Form title={title} options={options} />}
          </CardBody>
        </Card>
      </Main>
    </>
  );
};

export default Add;
