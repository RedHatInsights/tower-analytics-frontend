import { ButtonVariant } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { PaginationVariant } from '@patternfly/react-core/dist/dynamic/components/Pagination';
import MinusCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/minus-circle-icon';
import PlusCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/plus-circle-icon';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { readJobExplorer, readJobExplorerOptions } from '../../Api';
import ApiErrorState from '../../Components/ApiStatus/ApiErrorState';
import JobStatus from '../../Components/JobStatus';
import Pagination from '../../Components/Pagination';
import FilterableToolbar from '../../Components/Toolbar';
import { useQueryParams } from '../../QueryParams';
import { clusterList } from '../../Utilities/constants';
import useRequest from '../../Utilities/useRequest';
import { PageActionType } from '../../framework/PageActions/PageActionType';
import { TextCell } from '../../framework/PageCells/TextCell';
import { PageTable } from '../../framework/PageTable/PageTable';

const ClustersList = ({ activeClusters }) => {
  const {
    queryParams,
    setFromPagination,
    setFromToolbar,
    dispatch: queryParamsDispatch,
  } = useQueryParams(clusterList.defaultParams);

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

  const clusterListColumns = [
    {
      header: 'Name',
      sort: 'id',
      type: 'text',
      cell: (item) => <TextCell text={item.id.id} iconSize='sm' />,
      value: (item) => {
        return <Link to={`${item.id.id}`}>{`${item.id.template_name}`}</Link>;
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
      header: 'Type',
      type: 'text',
      cell: (item) => <TextCell text={item.cluster_name} iconSize='sm' />,
      value: (item) => {
        return item.cluster_name;
      },
    },
  ];

  return (
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
          additionalControls={
            activeClusters
              ? [
                  <Button icon={<PlusCircleIcon />} key={'test'}>
                    Create Cluster
                  </Button>,
                ]
              : []
          }
        />
        <PageTable
          pageItems={data}
          itemCount={meta.count}
          autoHidePagination
          tableColumns={clusterListColumns}
          errorStateTitle={'Error loading active clusters'}
          emptyStateTitle={'No active clusters'}
          emptyStateDescription={'To get started, create a cluster'}
          sort={queryParams.sort_options}
          sortDirection={queryParams.sort_order}
          setSort={(e) => setSort(e)}
          rowActions={
            activeClusters
              ? [
                  {
                    type: PageActionType.button,
                    icon: MinusCircleIcon,
                    variant: ButtonVariant.plain,
                    label: 'Archive Cluster',
                    onClick: () => console.log('archving cluster'),
                  },
                ]
              : [
                  {
                    type: PageActionType.button,
                    icon: MinusCircleIcon,
                    variant: ButtonVariant.plain,
                    label: 'Activate Cluster',
                    onClick: () => console.log('activating cluster'),
                  },
                ]
          }
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
  );
};

ClustersList.propTypes = {
  activeClusters: PropTypes.bool.isRequired,
};

export default ClustersList;
