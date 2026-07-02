import { Label } from '@patternfly/react-core/dist/dynamic/components/Label';
import { PageSection } from '@patternfly/react-core/dist/dynamic/components/Page';
import { Pagination } from '@patternfly/react-core/dist/dynamic/components/Pagination';
import { MenuToggle } from '@patternfly/react-core/dist/dynamic/components/MenuToggle';
import { Select } from '@patternfly/react-core/dist/dynamic/components/Select';
import { SelectList } from '@patternfly/react-core/dist/dynamic/components/Select';
import { SelectOption } from '@patternfly/react-core/dist/dynamic/components/Select';
import { Toolbar } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToolbarContent } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToolbarItem } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/dynamic/icons/external-link-alt-icon';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Params, readClusters, readNotifications } from '../../Api/';
import { useQueryParams } from '../../QueryParams/';
import { formatDateTime } from '../../Utilities/helpers';
import useRequest from '../../Utilities/useRequest';
import { TextCell } from '../../framework/PageCells/TextCell';
import { PageHeader } from '../../framework/PageHeader';
import { PageTable } from '../../framework/PageTable/PageTable';

const notificationOptions = [
  { value: '',        label: 'All severities' },
  { value: 'error',   label: 'Danger' },
  { value: 'warning', label: 'Warning' },
  { value: 'notice',  label: 'Info' },
];

const initialQueryParams = {
  defaultParams: {
    limit: 10,
    offset: 0,
    sort_options: 'created',
  },
};

interface NotificationDataType {
  notifications: any[];
  meta: { count: number };
}

interface ClusterDataType {
  templates: any[];
}

const Notifications: FC<Record<string, never>> = () => {
  const [clusterOpen, setClusterOpen] = useState(false);
  const [severityOpen, setSeverityOpen] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState('');
  const [selectedClusterLabel, setSelectedClusterLabel] = useState('All clusters');

  const { queryParams, setId, setFromPagination, setSeverity } = useQueryParams(
    initialQueryParams.defaultParams,
  );

  const { severity, limit, offset } = queryParams as Record<string, string>;

  const {
    result: { notifications: notificationsData, meta },
    isLoading,
    isSuccess,
    error,
    request: fetchNotifications,
  } = useRequest<NotificationDataType>(
    useCallback(
      () =>
        readNotifications(queryParams as Params) as unknown as Promise<NotificationDataType>,
      [queryParams],
    ),
    { notifications: [], meta: { count: 0 } },
  );

  const {
    result: { templates: clustersData = [] },
    request: fetchClusters,
  } = useRequest<ClusterDataType>(
    () => readClusters() as unknown as Promise<ClusterDataType>,
    { templates: [] },
  );

  useEffect(() => {
    fetchClusters();
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [queryParams]);

  const handlePaginationChange = (_event: unknown, page: number) => {
    const newOffset = (page - 1) * +limit;
    setFromPagination(newOffset);
  };

  const handlePerPageChange = (_event: unknown, perPage: number) => {
    setFromPagination(0, perPage as any);
  };

  const currentPage = Math.floor(+offset / +limit) + 1;

  const severityMap: Record<string, { label: string; status: 'danger' | 'warning' | 'info' }> = {
    error:   { label: 'Danger',  status: 'danger' },
    warning: { label: 'Warning', status: 'warning' },
    notice:  { label: 'Info',    status: 'info' },
  };

  const clusterOptions = [
    { value: '',   label: 'All clusters' },
    { value: '-1', label: 'Unassociated' },
    ...(clustersData as any[]).map(({ label, cluster_id: id, install_uuid: uuid }) => ({
      value: id as string,
      label: (label ?? uuid) as string,
    })),
  ];

  const selectedSeverityLabel =
    notificationOptions.find((o) => o.value === (severity || ''))?.label ?? 'All severities';

  const tableColumns = [
    {
      header: 'Severity',
      sort: 'label',
      cell: (item: any) => {
        const sev = severityMap[item.label] ?? { label: item.label, status: 'info' as const };
        return <Label status={sev.status} variant='outline'>{sev.label}</Label>;
      },
      value: (item: any) => item.label,
    },
    {
      header: 'Message',
      cell: (item: any) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          {item.message}
          {item.tower_url && (
            <a href={item.tower_url} target='_blank' rel='noopener noreferrer' aria-label='View in Tower'>
              <ExternalLinkAltIcon style={{ fontSize: '12px' }} />
            </a>
          )}
        </span>
      ),
      value: (item: any) => item.message,
    },
    {
      header: 'Date',
      sort: 'created',
      cell: (item: any) => <TextCell text={item.date ? formatDateTime(item.date) : '—'} />,
      value: (item: any) => item.date,
    },
  ];

  return (
    <>
      <PageHeader title={'Notifications'} />
      <Toolbar
        style={{
          paddingInlineStart: 'calc(var(--pf-v6-c-page__main-section--PaddingInlineStart) - var(--pf-v6-c-page__main-container--BorderInlineStartWidth))',
          paddingInlineEnd: 'calc(var(--pf-v6-c-page__main-section--PaddingInlineEnd) - var(--pf-v6-c-page__main-container--BorderInlineEndWidth))',
        }}
      >
        <ToolbarContent>
          <ToolbarItem>
            <Select
              isOpen={clusterOpen}
              onOpenChange={setClusterOpen}
              onSelect={(_e, value) => {
                const label = clusterOptions.find((o) => o.value === value)?.label ?? 'All clusters';
                setSelectedCluster(value as string);
                setSelectedClusterLabel(label);
                setId(value as string);
                setFromPagination(0);
                setClusterOpen(false);
              }}
              selected={selectedCluster}
              toggle={(ref) => (
                <MenuToggle ref={ref} onClick={() => setClusterOpen(!clusterOpen)} isExpanded={clusterOpen}>
                  {selectedClusterLabel}
                </MenuToggle>
              )}
            >
              <SelectList>
                {clusterOptions.map(({ value, label }) => (
                  <SelectOption key={value} value={value}>{label}</SelectOption>
                ))}
              </SelectList>
            </Select>
          </ToolbarItem>

          <ToolbarItem>
            <Select
              isOpen={severityOpen}
              onOpenChange={setSeverityOpen}
              onSelect={(_e, value) => {
                setSeverity(value as string);
                setFromPagination(0);
                setSeverityOpen(false);
              }}
              selected={severity || ''}
              toggle={(ref) => (
                <MenuToggle ref={ref} onClick={() => setSeverityOpen(!severityOpen)} isExpanded={severityOpen}>
                  {selectedSeverityLabel}
                </MenuToggle>
              )}
            >
              <SelectList>
                {notificationOptions.map(({ value, label }) => (
                  <SelectOption key={value} value={value}>{label}</SelectOption>
                ))}
              </SelectList>
            </Select>
          </ToolbarItem>

          <ToolbarItem align={{ default: 'alignEnd' }}>
            <Pagination
              itemCount={meta?.count || 0}
              page={currentPage}
              perPage={+limit}
              onSetPage={handlePaginationChange}
              onPerPageSelect={handlePerPageChange}
              isCompact
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <PageSection hasBodyWrapper={false}>
        <PageTable
          keyFn={(item: any) => item.id ?? item.date}
          pageItems={notificationsData}
          itemCount={meta?.count || 0}
          tableColumns={tableColumns}
          page={currentPage}
          perPage={+limit}
          setPage={(page) => handlePaginationChange(null, page)}
          setPerPage={(perPage) => handlePerPageChange(null, perPage)}
          errorStateTitle={'Error loading notifications'}
          emptyStateTitle={'No notifications found'}
          emptyStateDescription={'Try adjusting your filters.'}
        />
      </PageSection>
    </>
  );
};

export default Notifications;
