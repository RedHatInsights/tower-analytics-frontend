import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { DescriptionList } from '@patternfly/react-core/dist/dynamic/components/DescriptionList';
import { DescriptionListGroup } from '@patternfly/react-core/dist/dynamic/components/DescriptionList';
import { DescriptionListTerm } from '@patternfly/react-core/dist/dynamic/components/DescriptionList';
import { DescriptionListDescription } from '@patternfly/react-core/dist/dynamic/components/DescriptionList';
import { PageSection } from '@patternfly/react-core/dist/dynamic/components/Page';
import { PaginationVariant } from '@patternfly/react-core/dist/dynamic/components/Pagination';
import { ToolbarItem } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { Flex } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { FlexItem } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { Grid } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import { GridItem } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import { ExpandableRowContent } from '@patternfly/react-table';
import {
  t_chart_color_black_400 as global_palette_black_400,
  t_chart_color_blue_300 as global_palette_blue_300,
  t_chart_color_orange_300 as global_palette_gold_300,
  t_chart_color_green_300 as global_palette_green_300,
  t_chart_color_red_orange_300 as global_palette_red_100,
} from '@patternfly/react-tokens';
import React, { useEffect, useState } from 'react';
import { readJobExplorer, readJobExplorerOptions } from '../../Api/';
import Breakdown from '../../Charts/Breakdown';
import ApiErrorState from '../../Components/ApiStatus/ApiErrorState';
import JobStatus from '../../Components/JobStatus';
import Pagination from '../../Components/Pagination';
import {
  FilterVariantToggle,
  QueryFilterInput,
} from '../../Components/QueryFilter/QueryFilterInput';
import FilterableToolbar from '../../Components/Toolbar/';
import { SettingsPanel } from '../../Components/Toolbar/Groups';
import { useQueryParams } from '../../QueryParams/';
import { jobExplorer } from '../../Utilities/constants';
import { formatDateTime, formatJobType } from '../../Utilities/helpers';
import useRequest from '../../Utilities/useRequest';
import { TextCell } from '../../framework/PageCells/TextCell';
import { PageHeader } from '../../framework/PageHeader';
import { PageTable } from '../../framework/PageTable/PageTable';

const JOB_EXPLORER_FIELD_DEFS = [
  {
    key: 'status',
    op: '=',
    displayLabel: 'status =',
    hint: 'Filter by job status',
    filterStateKey: 'status',
    values: [
      { value: 'successful', label: 'Successful' },
      { value: 'failed', label: 'Failed' },
      { value: 'error', label: 'Error' },
      { value: 'running', label: 'Running' },
      { value: 'pending', label: 'Pending' },
      { value: 'canceled', label: 'Canceled' },
    ],
  },
  {
    key: 'job_type',
    op: '=',
    displayLabel: 'job_type =',
    hint: 'Filter by job type',
    filterStateKey: 'job_type',
    values: [
      { value: 'job', label: 'Job' },
      { value: 'workflowjob', label: 'Workflow job' },
      { value: 'inventoryupdate', label: 'Inventory update' },
      { value: 'projectupdate', label: 'Project update' },
      { value: 'systemjob', label: 'System job' },
    ],
  },
];

const JobExplorer = () => {
  const [filterVariant, setFilterVariant] = useState('a');
  const [queryValue, setQueryValue] = useState('');

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
      <Flex className='pf-u-mb-md'>
        <FlexItem align={{ default: 'alignRight' }}>
          <Button
            variant='secondary'
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
      cell: (item) => <TextCell text={item.id.id} iconSize='sm' />,
      value: (item) => {
        return (
          <a
            href={item.id.tower_link}
            target='_blank'
            rel='noopener noreferrer'
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
      cell: (item) => <TextCell text={item.cluster_name} iconSize='sm' />,
      value: (item) => {
        return item.cluster_name;
      },
    },
    {
      header: 'Organization',
      type: 'text',
      cell: (item) => <TextCell text={item.org_name} iconSize='sm' />,
      value: (item) => {
        return item.org_name;
      },
    },
    {
      header: 'Type',
      sort: 'job_type',
      type: 'text',
      cell: (item) => <TextCell text={item.job_type} iconSize='sm' />,
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

  const variantToggle = (
    <FilterVariantToggle
      key='variant-toggle'
      variant={filterVariant}
      onChange={(v) => {
        setFilterVariant(v);
        setQueryValue('');
        setFromToolbar(null, null);
      }}
    />
  );

  return (
    <React.Fragment>
      <PageHeader title={'Job Explorer'} />
      {filterVariant === 'a' && (
        <FilterableToolbar
          categories={options}
          filters={queryParams}
          setFilters={setFromToolbar}
          searchFirst='name'
          leadingControls={[variantToggle]}
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
              isChecked={queryParams.only_root_workflows_and_standalone_jobs}
              onChange={(value) => {
                setFromToolbar('only_root_workflows_and_standalone_jobs', value);
              }}
              ariaLabel={'ignore nested workflow popover'}
              bodyContent={
                'If enabled, nested workflows and jobs will not be included in the overall totals. Enable this option to filter out duplicate entries.'
              }
            />
          )}
          hasSettings
        />
      )}
      {filterVariant === 'b' && (
        <FilterableToolbar
          expandLeadingControls
          categories={{}}
          filters={queryParams}
          setFilters={setFromToolbar}
          leadingControls={[
            variantToggle,
              <QueryFilterInput
                fieldDefs={JOB_EXPLORER_FIELD_DEFS}
                value={queryValue}
                onChange={setQueryValue}
                setFilterState={(state) => {
                  Object.entries(state).forEach(([key, values]) => {
                    setFromToolbar(key, values.length === 1 ? values[0] : values);
                  });
                  if (Object.keys(state).length === 0) setFromToolbar(null, null);
                }}
              />
          ]}
        />
      )}
      <PageSection hasBodyWrapper={false}>
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
      </PageSection>
    </React.Fragment>
  );
};

export default JobExplorer;
