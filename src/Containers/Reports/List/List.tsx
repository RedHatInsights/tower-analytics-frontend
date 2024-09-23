import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
} from '@patternfly/react-core/deprecated';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { ButtonVariant } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardFooter } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardHeader } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardTitle } from '@patternfly/react-core/dist/dynamic/components/Card';
import { Divider } from '@patternfly/react-core/dist/dynamic/components/Divider';
import { Label } from '@patternfly/react-core/dist/dynamic/components/Label';
import { PageSection } from '@patternfly/react-core/dist/dynamic/components/Page';
import { TooltipPosition } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import { Gallery } from '@patternfly/react-core/dist/dynamic/layouts/Gallery';
import AngleLeftIcon from '@patternfly/react-icons/dist/dynamic/icons/angle-left-icon';
import AngleRightIcon from '@patternfly/react-icons/dist/dynamic/icons/angle-right-icon';
import CaretDownIcon from '@patternfly/react-icons/dist/dynamic/icons/caret-down-icon';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { readReport, readReports, reportOptions } from '../../../Api';
import NoData from '../../../Components/ApiStatus/NoData';
import EmptyList from '../../../Components/EmptyList';
import FilterableToolbar from '../../../Components/Toolbar/Toolbar';
import { useQueryParams } from '../../../QueryParams';
import { reportDefaultParams } from '../../../Utilities/constants';
import useRequest from '../../../Utilities/useRequest';
import { PageHeader } from '../../../framework/PageHeader';
import getComponent from '../Layouts/index';
import { ReportSchema } from '../Layouts/types';
import { TAGS, TagName } from '../Shared/constants';
import paths from '../paths';
import ListItem from './ListItem';

export interface Report {
  slug: string;
  name: string;
  description: string;
  tags: any[];
  tableHeaders: string[];
  schema;
}

const List: FunctionComponent<Record<string, never>> = () => {
  const [isOpen, setIsOpen] = useState(false);
  let index = 0;
  let nextItem = '';
  let previousItem = '';
  const queryParams = useQueryParams(
    reportDefaultParams('reports'),
    'allReports'
  ).queryParams;
  const setFromToolbar = useQueryParams(
    reportDefaultParams('reports'),
    'allReports'
  ).setFromToolbar;

  const {
    result: { reports: data },
    isSuccess: isSuccess,
    error: error,
    request: fetchReports,
  } = useRequest(readReports as any, { reports: [] });

  const optionsQueryParams = useQueryParams(reportDefaultParams('reports'));
  const { result: options, request: fetchOptions } = useRequest(
    reportOptions as any,
    {}
  );

  useEffect(() => {
    (fetchReports as any)(queryParams);
    (fetchOptions as any)(optionsQueryParams.queryParams);
  }, [queryParams]);

  const reports = data as Report[];
  const selected = (queryParams.selected_report ||
    reports[0]?.slug ||
    '') as string;
  const setSelected = (slug: string) => setFromToolbar('selected_report', slug);

  const {
    result: previewReport,
    request: fetchReport,
    isSuccess: isReportSuccess,
  } = useRequest(async () => {
    const response = await readReport(selected);
    return response.report as ReportSchema;
  }, {} as ReportSchema);

  useEffect(() => {
    if (isSuccess && reports.length > 0) {
      const report = reports.filter(({ slug }) => selected === slug);
      if (selected === '' || report.length === 0) setSelected(reports[0].slug);
      fetchReport();
    }
  }, [reports]);

  const dropdownItems = [
    isSuccess &&
      reports.length > 0 &&
      isReportSuccess &&
      reports.map((report) => {
        return (
          <Button
            key={report.slug}
            variant={ButtonVariant.plain}
            aria-label='Report list item'
            onClick={() => setSelected(report.slug)}
          >
            <DropdownItem key={report.slug}>{report.name}</DropdownItem>
          </Button>
        );
      }),
  ];

  return (
    <>
      <PageHeader data-cy={'header-all_reports'} title={'Reports'} />
      <FilterableToolbar
        categories={options as any}
        filters={queryParams as any}
        setFilters={setFromToolbar}
      />
      {isSuccess && reports.length > 0 && isReportSuccess && (
        <PageSection>
          {reports
            .filter((report: Report) => report.slug === selected)
            .map((report) => {
              return (
                (index = reports.indexOf(report)),
                reports.indexOf(report) < reports.length - 1 &&
                  (nextItem = reports[index + 1].slug),
                reports.indexOf(report) > 0 &&
                  (previousItem = reports[index - 1].slug),
                (
                  <>
                    <Card
                      key={report.slug}
                      style={{
                        maxWidth: '100%',
                        marginBottom: '25px',
                      }}
                      isCompact
                      data-cy={report.slug}
                    >
                      <CardHeader
                        actions={{
                          actions: (
                            <>
                              {report.tags.map(
                                (
                                  tagKey: TagName,
                                  idx: React.Key | null | undefined
                                ) => {
                                  const tag = TAGS.find(
                                    (t) => t.key === tagKey
                                  );
                                  if (tag) {
                                    return (
                                      <Tooltip
                                        key={`tooltip_${idx as string}`}
                                        position={TooltipPosition.top}
                                        content={tag.description}
                                      >
                                        <Label key={idx}>{tag.name}</Label>
                                      </Tooltip>
                                    );
                                  }
                                }
                              )}
                              <Button
                                variant={ButtonVariant.plain}
                                aria-label='Previous report'
                                data-cy={'previous_report_button'}
                                isDisabled={reports.indexOf(report) === 0}
                                onClick={() => setSelected(previousItem)}
                              >
                                <AngleLeftIcon />
                              </Button>
                              <Dropdown
                                data-cy={'preview_dropdown'}
                                isPlain
                                onSelect={() => setIsOpen(!isOpen)}
                                toggle={
                                  <DropdownToggle
                                    onToggle={(_event, next) => setIsOpen(next)}
                                    toggleIndicator={CaretDownIcon}
                                    id='report_list'
                                    data-cy={'selected_report_dropdown'}
                                    style={{ color: '#151515' }}
                                  >
                                    {report.name}
                                  </DropdownToggle>
                                }
                                isOpen={isOpen}
                                dropdownItems={dropdownItems}
                              />
                              <Button
                                variant={ButtonVariant.plain}
                                aria-label='Next report'
                                data-cy='next_report_button'
                                isDisabled={
                                  reports.indexOf(report) >= reports.length - 1
                                }
                                onClick={() => setSelected(nextItem)}
                              >
                                <AngleRightIcon />
                              </Button>
                            </>
                          ),
                          hasNoOffset: false,
                          className: undefined,
                        }}
                        style={{
                          paddingTop: '16px',
                          paddingBottom: '16px',
                          paddingRight: '0px',
                        }}
                      >
                        <CardTitle>
                          <Link
                            data-cy={'preview_title_link'}
                            to={paths.getDetails(report.slug)}
                          >
                            {report.name}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <Divider />
                      {report.slug === previewReport.slug
                        ? getComponent(previewReport, false)
                        : ''}
                      <CardFooter style={{ paddingBottom: '16px' }}>
                        <Link
                          to={paths.getDetails(report.slug)}
                          style={{ float: 'right' }}
                          data-cy={'view_full_report_link'}
                        >
                          View full report
                        </Link>
                      </CardFooter>
                    </Card>
                  </>
                )
              );
            })}
          <Gallery
            data-cy='all_reports'
            hasGutter
            minWidths={{
              sm: '307px',
              md: '307px',
              lg: '307px',
              xl: '307px',
              '2xl': '307px',
            }}
          >
            {reports.map((report) => (
              <ListItem
                key={report.slug}
                report={report}
                selected={selected}
                setSelected={setSelected}
              />
            ))}
          </Gallery>
        </PageSection>
      )}
      {isSuccess && reports.length === 0 && (
        <EmptyList
          label={'Clear all filters'}
          title={'No results found'}
          message={
            'No results match the filter criteria. Clear all filters and try again.'
          }
          showButton={true}
          path={'/ansible/automation-analytics/reports'}
        />
      )}
      {error && <NoData />}
    </>
  );
};

export default List;
