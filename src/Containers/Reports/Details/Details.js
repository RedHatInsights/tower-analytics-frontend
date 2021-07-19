import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Title as PFTitle } from '@patternfly/react-core';
import Main from '@redhat-cloud-services/frontend-components/Main';

import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';

import Breadcrumbs from '../../../Components/Breadcrumbs';

import Report from './Report';

import { getReport } from '../Shared/schemas';

const Title = styled(PFTitle)`
  &&& {
    font-weight: 300;
  }
`;

const Details = () => {
  const { id } = useParams();
  const { state: locationState } = useLocation();
  const [selectedId, setSelectedId] = useState(id);
  useEffect(() => {
    setSelectedId(id);
  }, [locationState]);

  const { name, description, ...reportParams } = getReport(+selectedId);

  const breadcrumbsItems = [{ title: 'Reports', navigate: '/reports' }];

  return (
    <>
      <PageHeader>
        <Breadcrumbs items={breadcrumbsItems} />
        <PageHeaderTitle title={name} />
        <Title headingLevel="h6" size="md">
          {description}
        </Title>
      </PageHeader>
      <Main>
        <Card>
          <Report {...reportParams} />
        </Card>
      </Main>
    </>
  );
};

export default Details;
