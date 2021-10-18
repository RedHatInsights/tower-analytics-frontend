import React from 'react';
import styled from 'styled-components';
import Main from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Gallery } from '@patternfly/react-core';

import ListItem from './ListItem';
import { getAllReports } from '../Shared/schemas';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 76px);
`;

const FlexMain = styled(Main)`
  flex-grow: 1;
`;

const List = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderTitle title={'Reports'} />
      </PageHeader>
      <FlexMain>
        <Gallery
          data-cy="all_reports"
          hasGutter
          minWidths={{
            sm: '307px',
            md: '307px',
            lg: '307px',
            xl: '307px',
            '2xl': '307px',
          }}
        >
          {getAllReports().map((report) => (
            <ListItem key={report.slug} report={report} />
          ))}
        </Gallery>
      </FlexMain>
    </PageContainer>
  );
};

export default List;
