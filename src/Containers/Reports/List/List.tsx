import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import Main from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import {
  Card,
  CardActions,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Gallery,
  Label,
  Tooltip,
  TooltipPosition,
} from '@patternfly/react-core';

import paths from '../paths';
import ListItem from './ListItem';
import { getAllReports } from '../Shared/schemas';
import ReportCard from '../Layouts/Standard/ReportCard';
import { TAGS } from '../Shared/constants';
import { ChartType } from 'react-json-chart-builder/dist/cjs/components/types';

const List: FunctionComponent<Record<string, never>> = () => {
  return (
    <>
      <PageHeader>
        <PageHeaderTitle title={'Reports'} />
      </PageHeader>
      <Main>
        {getAllReports().map((report) => (
          <>
            <Card key="all_reports" isCompact style={{ maxWidth: '100%' }}>
              <CardHeader>
                <CardTitle>All Reports</CardTitle>
                <CardActions></CardActions>
              </CardHeader>
            </Card>
            <Card
              key={report.layoutProps.slug}
              isLarge
              style={{ maxWidth: '100%', marginBottom: '25px' }}
            >
              <CardHeader>
                <CardTitle>
                  <Link to={paths.getDetails(report.layoutProps.slug)}>
                    {report.layoutProps.name}
                  </Link>
                </CardTitle>
                <CardActions>
                  {report.layoutProps.tags.map((tagKey, idx) => {
                    const tag = TAGS.find((t) => t.key === tagKey);
                    if (tag) {
                      return (
                        <Tooltip
                          key={`tooltip_${idx}`}
                          position={TooltipPosition.top}
                          content={tag.description}
                        >
                          <Label key={idx}>{tag.name}</Label>
                        </Tooltip>
                      );
                    }
                  })}
                </CardActions>
              </CardHeader>

              <CardBody>
                {report.layoutProps.description}
                <ReportCard
                  slug={report.layoutProps.slug}
                  name={report.layoutProps.name}
                  description={report.layoutProps.description}
                  defaultParams={report.layoutProps.defaultParams}
                  expandedTableRowName={undefined}
                  defaultSelectedToolbarCategory=""
                  availableChartTypes={[ChartType.line, ChartType.bar]}
                  dataEndpoint={report.layoutProps.dataEndpoint}
                  optionsEndpoint={report.layoutProps.optionsEndpoint}
                  schema={report.layoutProps.schema}
                  tableHeaders={[]}
                  tags={report.layoutProps.tags}
                  fullCard={false}
                />
              </CardBody>
              <CardFooter>
                <Link
                  to={paths.getDetails(report.layoutProps.slug)}
                  style={{ float: 'right' }}
                >
                  View full report
                </Link>
              </CardFooter>
            </Card>
          </>
        ))}
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
            <ListItem key={report.layoutProps.slug} report={report} />
          ))}
        </Gallery>
      </Main>
    </>
  );
};

export default List;
