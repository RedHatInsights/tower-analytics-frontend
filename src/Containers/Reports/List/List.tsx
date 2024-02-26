// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@ansible/ansible-ui-framework';
import {
	Button,
	ButtonVariant,
	Card,
	CardFooter,
	CardHeader,
	CardTitle,
	Divider,
	Gallery,
	Label,
	PageSection,
	Tooltip,
	TooltipPosition
} from '@patternfly/react-core';
import {
	Dropdown,
	DropdownItem,
	DropdownToggle
} from '@patternfly/react-core/deprecated';
import {
  AngleLeftIcon,
  AngleRightIcon,
  CaretDownIcon,
} from '@patternfly/react-icons';

import paths from '../paths';
import ListItem from './ListItem';
import { TagName, TAGS } from '../Shared/constants';
import getComponent from '../Layouts/index';
import useRequest from '../../../Utilities/useRequest';
import { readReport, readReports, reportOptions } from '../../../Api';
import { ReportSchema } from '../Layouts/types';
import { reportDefaultParams } from '../../../Utilities/constants';
import { useQueryParams } from '../../../QueryParams';
import FilterableToolbar from '../../../Components/Toolbar/Toolbar';
import EmptyList from '../../../Components/EmptyList';
import NoData from '../../../Components/ApiStatus/NoData';

export interface Report {
  slug: string;
  name: string;
  description: string;
  tags: any[];
  tableHeaders: string[];
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
  } = useRequest(readReports, { reports: [] });

  const optionsQueryParams = useQueryParams(reportDefaultParams('reports'));
  const { result: options, request: fetchOptions } = useRequest(
    reportOptions,
    {}
  );

  useEffect(() => {
    fetchReports(queryParams);
    fetchOptions(optionsQueryParams.queryParams);
  }, [queryParams]);

  const reports = data as Report[];
  const selected = queryParams.selected_report || reports[0]?.slug || '';
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
            aria-label="Report list item"
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
        categories={options}
        filters={queryParams}
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
                      <CardHeader actions={{ actions: <><Button
                            variant={ButtonVariant.plain}
                            aria-label="Previous report"
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
                                id="report_list"
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
                            aria-label="Next report"
                            data-cy="next_report_button"
                            isDisabled={
                              reports.indexOf(report) >= reports.length - 1
                            }
                            onClick={() => setSelected(nextItem)}
                          >
                            <AngleRightIcon />
                          </Button></>, hasNoOffset: false, className: undefined}}  actions={{ actions: <>{report.tags.map(
                            (
                              tagKey: TagName,
                              idx: React.Key | null | undefined
                            ) => {
                              const tag = TAGS.find((t) => t.key === tagKey);
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
                          )}</>, hasNoOffset: false, className: undefined}} 
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
