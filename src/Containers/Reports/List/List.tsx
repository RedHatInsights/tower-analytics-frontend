import React, { FunctionComponent } from 'react';
import Main from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Gallery } from '@patternfly/react-core';

import ListItem from './ListItem';
import MagicButton from './MagicButton';
import { getAllReports } from '../Shared/schemas';

const List: FunctionComponent<Record<string, never>> = () => {
  return (
    <>
      <MagicButton />
      <PageHeader>
        <PageHeaderTitle title={'Reports'} />
      </PageHeader>
      <Main>
        <Gallery
          data-testid="all_reports"
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
      </Main>
    </>
  );
};

export default List;
