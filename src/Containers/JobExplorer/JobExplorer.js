import React, { useEffect, useState } from 'react';

import { useQueryParams } from '../../QueryParams/';
import useRequest from '../../Utilities/useRequest';
import { formatDateTime, formatJobType } from '../../Utilities/helpers';
import JobStatus from '../../Components/JobStatus';
import Breakdown from '../../Charts/Breakdown';

import ApiErrorState from '../../Components/ApiStatus/ApiErrorState';
import Pagination from '../../Components/Pagination';

import { readJobExplorer, readJobExplorerOptions } from '../../Api/';
import { jobExplorer } from '../../Utilities/constants';

import {
  Button,
  Card,
  CardBody,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  PageSection,
  PaginationVariant,
} from '@patternfly/react-core';
import {
  global_palette_green_300,
  global_palette_black_400,
  global_palette_gold_300,
  global_palette_red_100,
  global_palette_blue_300,
} from '@patternfly/react-tokens';
import { ExpandableRowContent } from '@patternfly/react-table';

import FilterableToolbar from '../../Components/Toolbar/';
import { SettingsPanel } from '../../Components/Toolbar/Groups';
import { PageHeader, PageTable, TextCell } from '@ansible/ansible-ui-framework';

const JobExplorer = () => {
  const {
    queryParams,
    setFromPagination,
    setFromToolbar,
    dispatch: queryParamsDispatch,
  } = useQueryParams(jobExplorer.defaultParams);

  const {
    result: options,
    error,
    request: fetchOptions,
  } = useRequest(readJobExplorerOptions, {});

  const {
    result: { items: data, meta },
    request: fetchEndpoints,
  } = useRequest(readJobExplorer, { items: [], meta: { count: 0 } });

  useEffect(() => {
    fetchOptions(queryParams);
    fetchEndpoints(queryParams);
  }, [queryParams]);

  if (error) return <ApiErrorState message={error.error.error} />;

  const setSort = (idx) => {
    if (idx !== queryParams.sort_options) {
      queryParamsDispatch({
        type: 'SET_SORT_OPTIONS',
        value: { sort_options: idx },
      });
      queryParamsDispatch({
        type: 'SET_SORT_ORDER',
        value: {
          sort_order: 'asc',
        },
      });
    } else {
      queryParamsDispatch({
        type: 'SET_SORT_ORDER',
        value: {
          sort_order: queryParams.sort_order === 'asc' ? 'desc' : 'asc',
        },
      });
    }
  };

  const categoryColor = {
    ok: global_palette_green_300.value,
    passed: global_palette_green_300.value,
    unreachable: global_palette_black_400.value,
    changed: global_palette_gold_300.value,
    failed: global_palette_red_100.value,
    skipped: global_palette_blue_300.value,
  };

  const renderMoreButton = (showMore, setShowMore) => {
    return (
      <Flex className="pf-u-mb-md">
        <FlexItem align={{ default: 'alignRight' }}>
          <Button
            variant="secondary"
            onClick={() => {
              setShowMore(!showMore);
            }}
            fullWidth={{ default: 'fullWidth' }}
          >
            {showMore ? 'Show less' : 'Show more'}
          </Button>
        </FlexItem>
      </Flex>
    );
  };

  const renderFailedTaskBar = (failed_tasks) => {
    const [showMore, setShowMore] = useState(false);

    if (failed_tasks != null) {
      return (
        <>
          <p>
            <strong>Top failed tasks</strong>
          </p>

          <Grid hasGutter>
            {failed_tasks
              .slice(0, showMore ? failed_tasks.length : 2)
              .map((task, idx) => {
                const categoryCount = {
                  passed: task?.passed_host_count ?? 0,
                  failed: task?.failed_host_count ?? 0,
                  unreachable: task?.unreachable_host_count ?? 0,
                };

                return (
                  <GridItem lg={6} md={12} key={`most-failed-${idx}`}>
                    <Flex>
                      <FlexItem>
                        <strong>Task name </strong> {task?.task_name}
                      </FlexItem>

                      <FlexItem align={{ default: 'alignRight' }}>
                        <strong>Module name </strong> {task?.module_name}
                      </FlexItem>
                    </Flex>
                    <Breakdown
                      categoryCount={categoryCount}
                      categoryColor={categoryColor}
                      showPercent
                    />
                  </GridItem>
                );
              })}
          </Grid>

          {failed_tasks.length > 2
            ? renderMoreButton(showMore, setShowMore)
            : null}
        </>
      );
    }
  };

  const categoryCount = (item) =>
    item
      ? {
          ok: item?.ok_host_count ?? 0,
          skipped: item?.skipped_host_count ?? 0,
          changed: item?.changed_host_count ?? 0,
          failed: item?.failed_host_count ?? 0,
          unreachable: item?.unreachable_host_count ?? 0,
        }
      : null;

  const expandedInfo = (item) => [
    {
      label: 'Created',
      value: item.created ? formatDateTime(item.created) : 'Unavailable',
    },
    {
      label: 'Started',
      value: item.created ? formatDateTime(item.started) : 'Unavailable',
    },
    {
      label: 'Finished',
      value: item.created ? formatDateTime(item.finished) : 'Unavailable',
    },
    {
      label: 'Tasks',
      value: item.host_task_count ?? 0,
    },
  ];

  const jobExplorerTableColumns = [
    {
      header: 'ID/Name',
      sort: 'id',
      type: 'text',
      cell: (item) => <TextCell text={item.id.id} iconSize="sm" />,
      value: (item) => {
        return (
          <a
            href={item.id.tower_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {`${item.id.id} - ${item.id.template_name}`}
          </a>
        );
      },
    },
    {
      header: 'Status',
      sort: 'status',
      type: 'label',
      cell: (item) => <JobStatus status={item?.status} />,
      value: (item) => {
        return <JobStatus status={item?.status} />;
      },
    },
    {
      header: 'Cluster',
      type: 'text',
      cell: (item) => <TextCell text={item.cluster_name} iconSize="sm" />,
      value: (item) => {
        return item.cluster_name;
      },
    },
    {
      header: 'Organization',
      type: 'text',
      cell: (item) => <TextCell text={item.org_name} iconSize="sm" />,
      value: (item) => {
        return item.org_name;
      },
    },
    {
      header: 'Type',
      sort: 'job_type',
      type: 'text',
      cell: (item) => <TextCell text={item.job_type} iconSize="sm" />,
      value: (item) => {
        return formatJobType(item?.job_type);
      },
    },
  ];

  const expandedRowContent = (item) => (
    <ExpandableRowContent>
      <Flex>
        <FlexItem>
          <strong>Host status</strong>
        </FlexItem>
        <FlexItem align={{ default: 'alignRight' }}>
          <strong>Hosts</strong>
          {'  '}
          {item?.host_count ?? 0}
        </FlexItem>
      </Flex>
      <Breakdown
        categoryCount={categoryCount(item)}
        categoryColor={categoryColor}
        showPercent
      />
      {renderFailedTaskBar(item.most_failed_tasks)}
      <DescriptionList isHorizontal columnModifier={{ lg: '3Col' }}>
        {expandedInfo(item).map(({ label, value }) => (
          <DescriptionListGroup key={label}>
            <DescriptionListTerm>{label}</DescriptionListTerm>
            <DescriptionListDescription>{value}</DescriptionListDescription>
          </DescriptionListGroup>
        ))}
      </DescriptionList>
    </ExpandableRowContent>
  );

  return (
    <React.Fragment>
      <PageHeader title={'Job Explorer'} />
      <PageSection>
        <Card>
          <CardBody>
            <FilterableToolbar
              categories={options}
              filters={queryParams}
              setFilters={setFromToolbar}
              pagination={
                <Pagination
                  count={meta.count}
                  params={{
                    limit: +queryParams.limit,
                    offset: +queryParams.offset,
                  }}
                  setPagination={setFromPagination}
                  isCompact
                />
              }
              settingsPanel={(setSettingsExpanded, settingsExpanded) => (
                <SettingsPanel
                  filters={queryParams}
                  setFilters={setFromToolbar}
                  settingsExpanded={settingsExpanded}
                  setSettingsExpanded={setSettingsExpanded}
                  id={'showRootWorkflowJobs'}
                  label={'Ignore nested workflows and jobs'}
                  labelOff={'Ignore nested workflows and jobs'}
                  isChecked={
                    queryParams.only_root_workflows_and_standalone_jobs
                  }
                  onChange={(value) => {
                    setFromToolbar(
                      'only_root_workflows_and_standalone_jobs',
                      value
                    );
                  }}
                  ariaLabel={'ignore nested workflow popover'}
                  bodyContent={
                    'If enabled, nested workflows and jobs will not be included in the overall totals. Enable this option to filter out duplicate entries.'
                  }
                />
              )}
              hasSettings
            />
            <PageTable
              pageItems={data}
              itemCount={meta.count}
              autoHidePagination
              tableColumns={jobExplorerTableColumns}
              expandedRow={expandedRowContent}
              errorStateTitle={'Error loading templates'}
              emptyStateTitle={'No templates yet'}
              emptyStateDescription={'To get started, create a template.'}
              sort={queryParams.sort_options}
              sortDirection={queryParams.sort_order}
              setSort={(e) => setSort(e)}
            />
            <Pagination
              count={meta.count}
              params={{
                limit: +queryParams.limit,
                offset: +queryParams.offset,
              }}
              setPagination={setFromPagination}
              variant={PaginationVariant.bottom}
            />
          </CardBody>
        </Card>
      </PageSection>
    </React.Fragment>
  );
};

export default JobExplorer;
