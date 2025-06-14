import { DropdownPosition } from '@patternfly/react-core/deprecated';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
} from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { PageSection } from '@patternfly/react-core/dist/dynamic/components/Page';
import { Skeleton } from '@patternfly/react-core/dist/dynamic/components/Skeleton';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import { Bullseye } from '@patternfly/react-core/dist/dynamic/layouts/Bullseye';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/exclamation-circle-icon';
import PlusCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/plus-circle-icon';
import SearchIcon from '@patternfly/react-icons/dist/dynamic/icons/search-icon';
import {
  CollapseColumn,
  SortByDirection,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import useResizeObserver from '@react-hook/resize-observer';
import React, {
  Dispatch,
  Fragment,
  MouseEvent,
  ReactNode,
  SetStateAction,
  UIEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { IPageAction } from '../PageActions/PageAction';
import { PageActionType } from '../PageActions/PageActionType';
import { PageActions } from '../PageActions/PageActions';
import { PageBody } from '../PageBody';
import { SinceCell } from '../PageCells/DateTimeCell';
import { LabelsCell } from '../PageCells/LabelsCell';
import { TextCell } from '../PageCells/TextCell';
import { useColumnModal } from '../PageColumnModal';
import { Scrollable } from '../components/Scrollable';
import { useBreakpoint } from '../components/useBreakpoint';
import { PagePagination } from './PagePagination';
import { PageTableCards } from './PageTableCards';
import { PageTableList } from './PageTableList';
import { PageTableViewType, PageTableViewTypeE } from './PageTableViewType';
import { IToolbarFilter, PageTableToolbar } from './PageToolbar';

export type PageTableProps<T extends object> = {
  keyFn: (item: T) => string | number;

  itemCount?: number;
  pageItems: T[] | undefined;

  toolbarActions?: IPageAction<T>[];

  tableColumns: ITableColumn<T>[];

  rowActions?: IPageAction<T>[];

  toolbarFilters?: IToolbarFilter[];
  filters?: Record<string, string[]>;
  setFilters?: Dispatch<SetStateAction<Record<string, string[]>>>;
  clearAllFilters?: () => void;

  sort?: string;
  setSort?: (sort: string) => void;
  sortDirection?: 'asc' | 'desc';
  setSortDirection?: (sortDirection: 'asc' | 'desc') => void;
  compact?: boolean;

  page: number;
  perPage: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  autoHidePagination?: boolean;

  isSelected?: (item: T) => boolean;
  isSelectMultiple?: boolean;
  selectedItems?: T[];
  selectItem?: (item: T) => void;
  unselectItem?: (item: T) => void;
  selectItems?: (items: T[]) => void;
  unselectAll?: () => void;
  onSelect?: (item: T) => void;
  selectNoneText?: string;

  errorStateTitle: string;
  error?: Error;

  emptyStateTitle: string;
  emptyStateDescription?: string;
  emptyStateIcon?: React.ComponentType<any>;
  emptyStateButtonIcon?: React.ReactNode;
  emptyStateButtonText?: string;
  emptyStateButtonClick?: () => void;

  showSelect?: boolean;

  disableTableView?: boolean;
  disableListView?: boolean;
  disableCardView?: boolean;

  disableColumnManagement?: boolean;

  defaultTableView?: PageTableViewType;

  disableBodyPadding?: boolean;

  defaultSubtitle?: ReactNode;

  expandedRow?: (item: T) => ReactNode;
};

/**
 * The PageTable component is used for adding a table to a page.
 *
 * See the [Table Guide](docs/guides/PageTableGuide.md).
 *
 * @example
 * ```tsx
 * <Page>
 *   <PageLayout>
 *     <PageHeader ... />
 *     <PageTable ... />
 *   </PageLayout>
 * </Page>
 * ```
 */
export function PageTable<T extends object>(props: PageTableProps<T>) {
  // const { disableBodyPadding } = props
  const { toolbarActions, filters, error, itemCount } = props;
  const { openColumnModal, columnModal, managedColumns } = useColumnModal(
    props.tableColumns,
  );
  const showSelect =
    props.showSelect ||
    toolbarActions?.find(
      (toolbarAction) => PageActionType.bulk === toolbarAction.type,
    ) !== undefined;

  const hasTableViewType = !props.disableTableView;
  const hasListViewType = !props.disableListView;
  // const hasCardViewType = !props.disableCardView;

  const [viewType, setViewType] = useState<PageTableViewType>(
    () =>
      props.defaultTableView ??
      (hasTableViewType
        ? PageTableViewTypeE.Table
        : hasListViewType
          ? PageTableViewTypeE.List
          : PageTableViewTypeE.Cards),
  );

  const usePadding = useBreakpoint('md') && props.disableBodyPadding !== true;

  if (error) {
    return (
      <div className='dark-2' style={{ height: '100%' }}>
        <EmptyState variant={EmptyStateVariant.sm} style={{ paddingTop: 48 }}>
          <EmptyStateHeader
            titleText={
              <>
                {/* Unable to connect */}
                {props.errorStateTitle}
              </>
            }
            icon={
              <EmptyStateIcon
                icon={ExclamationCircleIcon}
                color='var(--pf-global--danger-color--100)'
              />
            }
            headingLevel='h2'
          />
          {/* <EmptyStateBody>There was an error retrieving data. Check your connection and reload the page.</EmptyStateBody> */}
          <EmptyStateBody>{error.message}</EmptyStateBody>
        </EmptyState>
      </div>
    );
  }

  if (itemCount === 0 && Object.keys(filters ?? {}).length === 0) {
    return (
      <PageSection>
        <EmptyState variant={EmptyStateVariant.lg} style={{ paddingTop: 48 }}>
          <EmptyStateHeader
            titleText={<>{props.emptyStateTitle}</>}
            icon={
              <EmptyStateIcon icon={props.emptyStateIcon ?? PlusCircleIcon} />
            }
            headingLevel='h4'
          />
          <EmptyStateFooter>
            {props.emptyStateDescription && (
              <EmptyStateBody>{props.emptyStateDescription}</EmptyStateBody>
            )}
            {props.emptyStateButtonClick && (
              <Button
                variant='primary'
                onClick={props.emptyStateButtonClick}
                icon={
                  props.emptyStateButtonIcon ? props.emptyStateButtonIcon : null
                }
              >
                {props.emptyStateButtonText}
              </Button>
            )}
          </EmptyStateFooter>
        </EmptyState>
      </PageSection>
    );
  }

  if (itemCount === undefined) {
    return (
      <PageSection isFilled variant='light'>
        <Bullseye>
          <Spinner />
        </Bullseye>
      </PageSection>
    );
  }

  return (
    <>
      <PageTableToolbar
        {...props}
        openColumnModal={openColumnModal}
        showSelect={showSelect}
        viewType={viewType}
        setViewType={setViewType}
      />
      {viewType === PageTableViewTypeE.Table && (
        <PageBody disablePadding>
          <PageTableView {...props} tableColumns={managedColumns} />
        </PageBody>
      )}
      {viewType === PageTableViewTypeE.List && (
        <Scrollable>
          <PageSection padding={{ default: 'noPadding', md: 'padding' }}>
            <div
              style={{
                borderLeft: usePadding
                  ? 'thin solid var(--pf-global--BorderColor--100)'
                  : undefined,
                borderRight: usePadding
                  ? 'thin solid var(--pf-global--BorderColor--100)'
                  : undefined,
              }}
            >
              <PageTableList {...props} showSelect={showSelect} />
            </div>
          </PageSection>
        </Scrollable>
      )}
      {viewType === PageTableViewTypeE.Cards && (
        <Scrollable>
          <PageTableCards {...props} showSelect={showSelect} />
        </Scrollable>
      )}
      {(!props.autoHidePagination ||
        (props.itemCount ?? 0) > props.perPage) && (
        <PagePagination {...props} />
      )}
      {columnModal}
    </>
  );
}

function PageTableView<T extends object>(props: PageTableProps<T>) {
  const {
    tableColumns,
    pageItems,
    selectItem,
    unselectItem,
    isSelected,
    isSelectMultiple,
    keyFn,
    rowActions,
    toolbarActions,
    itemCount,
    perPage,
    clearAllFilters,
    onSelect,
    unselectAll,
    expandedRow,
  } = props;
  const showSelect =
    props.showSelect ||
    toolbarActions?.find(
      (toolbarAction) => PageActionType.bulk === toolbarAction.type,
    ) !== undefined;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState<{
    left: number;
    right: number;
    top: number;
    bottom: number;
  }>({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });
  const updateScroll = useCallback((div: HTMLDivElement | null) => {
    if (!div) return;
    setScroll({
      top: div.scrollTop,
      bottom: div.scrollHeight - div.clientHeight - div.scrollTop,
      left: div.scrollLeft,
      right: div.scrollWidth - div.clientWidth - div.scrollLeft,
    });
  }, []);
  const onScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => updateScroll(event.currentTarget),
    [updateScroll],
  );
  useResizeObserver(containerRef, () => updateScroll(containerRef.current));
  useEffect(() => updateScroll(containerRef.current), [updateScroll]);

  return (
    <div
      className='pf-v5-c-scroll-inner-wrapper'
      style={{ height: '100%', marginBottom: -1 }}
      ref={containerRef}
      onScroll={onScroll}
    >
      <Table
        aria-label='Simple table'
        variant={props.compact ? 'compact' : undefined}
        gridBreakPoint=''
        isStickyHeader
      >
        {itemCount === undefined ? (
          <Thead>
            <Tr>
              <Th>
                <Skeleton />
              </Th>
            </Tr>
          </Thead>
        ) : (
          <TableHead
            {...props}
            showSelect={showSelect}
            scrollLeft={scroll.left > 0}
            scrollRight={scroll.right > 1}
            tableColumns={tableColumns}
            onSelect={onSelect}
          />
        )}
        <Tbody>
          {itemCount === undefined
            ? new Array(perPage).fill(0).map((_, index) => (
                <Tr key={index}>
                  <Td>
                    <div style={{ paddingTop: 5, paddingBottom: 5 }}>
                      <Skeleton height='27px' />
                    </div>
                  </Td>
                </Tr>
              ))
            : pageItems === undefined
              ? new Array(Math.min(perPage, itemCount))
                  .fill(0)
                  .map((_, index) => (
                    <Tr key={index}>
                      {showSelect && <Td></Td>}
                      <Td colSpan={tableColumns.length}>
                        <div style={{ paddingTop: 5, paddingBottom: 5 }}>
                          <Skeleton height='27px' />
                        </div>
                      </Td>
                    </Tr>
                  ))
              : pageItems?.map((item, rowIndex) => (
                  <TableRow<T>
                    key={keyFn ? keyFn(item) : rowIndex}
                    columns={tableColumns}
                    item={item}
                    isItemSelected={isSelected?.(item)}
                    isSelectMultiple={isSelectMultiple}
                    selectItem={selectItem}
                    unselectItem={unselectItem}
                    rowActions={rowActions}
                    rowIndex={rowIndex}
                    showSelect={showSelect}
                    scrollLeft={scroll.left > 0}
                    scrollRight={scroll.right > 1}
                    unselectAll={unselectAll}
                    onSelect={onSelect}
                    expandedRow={expandedRow}
                  />
                ))}
        </Tbody>
      </Table>
      {itemCount === 0 && (
        <EmptyState style={{ paddingTop: 48 }}>
          <EmptyStateHeader
            titleText={<>No results found</>}
            icon={<EmptyStateIcon icon={SearchIcon} />}
            headingLevel='h2'
          />
          <EmptyStateBody>
            No results match this filter criteria. Clear all filters and try
            again.
          </EmptyStateBody>
          <EmptyStateFooter>
            {clearAllFilters && (
              <EmptyStateActions>
                <Button variant='primary' onClick={clearAllFilters}>
                  Clear all filters
                </Button>
              </EmptyStateActions>
            )}
          </EmptyStateFooter>
        </EmptyState>
      )}
    </div>
  );
}

function TableHead<T extends object>(props: {
  tableColumns: ITableColumn<T>[];
  rowActions?: IPageAction<T>[];
  sort?: string;
  setSort?: (sort: string) => void;
  sortDirection?: 'asc' | 'desc';
  setSortDirection?: (sortDirection: 'asc' | 'desc') => void;
  showSelect?: boolean;
  scrollLeft?: boolean;
  scrollRight?: boolean;
  onSelect?: (item: T) => void;
  expandedRow?: (item: T) => ReactNode;
}) {
  const {
    tableColumns: columns,
    rowActions: itemActions,
    sort,
    setSort,
    sortDirection,
    setSortDirection,
    showSelect,
    onSelect,
    expandedRow,
  } = props;

  const getColumnSort = useCallback<
    (columnIndex: number, column: ITableColumn<T>) => any
  >(
    (columnIndex: number, column: ITableColumn<T>) => {
      if (!column.sort) return undefined;
      return {
        onSort: (
          _event: MouseEvent,
          _columnIndex: number,
          sortByDirection: SortByDirection,
        ) => {
          if (column.sort) {
            setSort?.(column.sort);
            setSortDirection?.(sortByDirection);
          }
        },
        sortBy: {
          index: column.sort === sort ? columnIndex : undefined,
          direction: column.sort === sort ? sortDirection : undefined,
          defaultDirection: column.defaultSortDirection,
        },
        columnIndex,
      };
    },
    [setSort, setSortDirection, sort, sortDirection],
  );

  return (
    <Thead>
      <Tr className='light dark-2'>
        {expandedRow && (
          <Th style={{ padding: 0, backgroundColor: 'inherit' }} />
        )}
        {(showSelect || onSelect) && (
          <Th
            isStickyColumn
            stickyMinWidth='0px'
            hasRightBorder={props.scrollLeft}
            style={{ backgroundColor: 'inherit' }}
          >
            &nbsp;
          </Th>
        )}
        {columns
          .filter((column) => column.enabled !== false)
          .map((column, index) => {
            return (
              <Th
                key={column.header}
                sort={getColumnSort(index, column)}
                style={{
                  minWidth:
                    column.minWidth === 0
                      ? '1%'
                      : column.minWidth !== undefined
                        ? column.minWidth
                        : undefined,
                  maxWidth:
                    column.maxWidth !== undefined ? column.maxWidth : undefined,
                  backgroundColor: 'inherit',
                }}
              >
                {column.header}
              </Th>
            );
          })}
        {itemActions !== undefined && (
          <Td
            isActionCell
            isStickyColumn
            stickyMinWidth='0px'
            style={{
              right: 0,
              padding: 0,
              paddingRight: 0,
              backgroundColor: 'inherit',
              zIndex: 302,
            }}
            className={props.scrollRight ? 'pf-m-border-left' : undefined}
          >
            &nbsp;
          </Td>
        )}
      </Tr>
    </Thead>
  );
}

function TableRow<T extends object>(props: {
  columns: ITableColumn<T>[];
  item: T;
  isItemSelected?: boolean;
  isSelectMultiple?: boolean;
  selectItem?: (item: T) => void;
  unselectItem?: (item: T) => void;
  rowActions?: IPageAction<T>[];
  rowIndex: number;
  showSelect: boolean;
  scrollLeft?: boolean;
  scrollRight?: boolean;
  onSelect?: (item: T) => void;
  unselectAll?: () => void;
  expandedRow?: (item: T) => ReactNode;
}) {
  const {
    columns,
    selectItem,
    unselectItem,
    unselectAll,
    isItemSelected,
    isSelectMultiple,
    item,
    rowActions,
    rowIndex,
    showSelect,
    onSelect,
    expandedRow,
  } = props;
  const [expanded, setExpanded] = useState(false);
  const expandedContent = expandedRow?.(item);

  return (
    <>
      <Tr
        className={isItemSelected ? 'selected' : undefined}
        isRowSelected={expanded}
        style={{
          boxShadow: 'unset',
          borderBottom: expanded ? 'unset' : undefined,
        }}
      >
        {expandedRow && (
          <Td
            expand={
              expandedContent
                ? {
                    rowIndex,
                    isExpanded: expanded,
                    onToggle: () => setExpanded((expanded) => !expanded),
                  }
                : undefined
            }
            style={{ paddingLeft: expandedContent ? 8 : 4 }}
          />
        )}
        {showSelect && (
          <Th
            select={
              isItemSelected !== undefined
                ? {
                    onSelect: (_event, isSelecting) => {
                      if (isSelecting) {
                        selectItem?.(item);
                      } else {
                        unselectItem?.(item);
                      }
                    },
                    isSelected: isItemSelected,
                  }
                : undefined
            }
            isStickyColumn
            stickyMinWidth='0px'
            hasRightBorder={props.scrollLeft}
          />
        )}
        {onSelect && (
          <Td
            select={{
              rowIndex,
              onSelect: () => {
                if (!isSelectMultiple) {
                  unselectAll?.();
                }
                selectItem?.(item);
                onSelect?.(item);
              },
              isSelected: isItemSelected ?? false,
              variant: isSelectMultiple ? 'checkbox' : 'radio',
            }}
            isStickyColumn
            stickyMinWidth='0px'
            hasRightBorder={props.scrollLeft}
          />
        )}
        <TableCells
          columns={columns}
          item={item}
          rowActions={rowActions}
          scrollLeft={props.scrollLeft}
          scrollRight={props.scrollRight}
        />
      </Tr>
      {expandedRow && expanded && expandedContent && (
        <Tr
          className={isItemSelected ? 'selected' : undefined}
          isExpanded={expanded}
          style={{ boxShadow: 'unset' }}
        >
          <Td />
          {showSelect && (
            <Th
              isStickyColumn
              stickyMinWidth='0px'
              hasRightBorder={props.scrollLeft}
            />
          )}
          {onSelect && (
            <Td
              isStickyColumn
              stickyMinWidth='0px'
              hasRightBorder={props.scrollLeft}
            />
          )}
          <Td
            colSpan={
              columns.filter((column) => column.enabled !== false).length
            }
            style={{
              paddingBottom: 24,
              paddingTop: 0,
            }}
          >
            <CollapseColumn>{expandedContent}</CollapseColumn>
          </Td>
          {rowActions !== undefined && rowActions.length > 0 && (
            <Td
              isActionCell
              isStickyColumn
              stickyMinWidth='0px'
              style={{
                right: 0,
                padding: 0,
                paddingRight: 0,
              }}
              className={props.scrollRight ? 'pf-m-border-left' : undefined}
            >
              &nbsp;
            </Td>
          )}
        </Tr>
      )}
    </>
  );
}

function TableCells<T extends object>(props: {
  columns: ITableColumn<T>[];
  item: T;
  rowActions?: IPageAction<T>[];
  scrollLeft?: boolean;
  scrollRight?: boolean;
}) {
  const { columns, item, rowActions } = props;
  const [actionsExpanded, setActionsExpanded] = useState(false);
  return (
    <Fragment>
      {columns
        .filter((column) => column.enabled !== false)
        .map((column) => {
          return (
            <Td
              key={column.header}
              dataLabel={column.header}
              modifier='nowrap'
              style={{ width: column.minWidth === 0 ? '0%' : undefined }}
            >
              <TableColumnCell item={item} column={column} />
            </Td>
          );
        })}
      {rowActions !== undefined && rowActions.length > 0 && (
        <Td
          isActionCell
          isStickyColumn
          stickyMinWidth='0px'
          style={{
            right: 0,
            padding: 0,
            paddingRight: 0,
            zIndex: actionsExpanded ? 301 : undefined,
          }}
          className={props.scrollRight ? 'pf-m-border-left' : undefined}
        >
          <PageActions
            actions={rowActions}
            selectedItem={item}
            position={DropdownPosition.right}
            iconOnly
            onOpen={setActionsExpanded}
          />
        </Td>
      )}
    </Fragment>
  );
}

type CellFn<T extends object, R> = (item: T) => R;

export interface ITableColumnCommon<T extends object> {
  id?: string;
  header: string;
  minWidth?: number;
  maxWidth?: number;
  enabled?: boolean;
  isIdColumn?: boolean;

  sort?: string;
  defaultSortDirection?: 'asc' | 'desc';
  defaultSort?: boolean;

  // card?: 'description' | 'hidden' | 'count'

  // list?: 'primary' | 'secondary'

  // hideLabel?: boolean

  // primary?: boolean

  icon?: (item: T) => ReactNode;
  card?: 'name' | 'subtitle' | 'description' | 'hidden';
  list?:
    | 'name'
    | 'subtitle'
    | 'description'
    | 'hidden'
    | 'primary'
    | 'secondary';
}

export enum TableColumnSomething {
  'id',
  'name',
  'description',
}

export enum TableColumnCardType {
  'description',
  'hidden',
  'count',
}

export interface ITableColumnTypeReactNode<T extends object>
  extends ITableColumnCommon<T> {
  type?: undefined;
  value?: CellFn<T, string | string[] | number | boolean>;
  cell: CellFn<T, ReactNode | undefined>;
}

export interface ITableColumnTypeCount<T extends object>
  extends ITableColumnCommon<T> {
  type: 'count';
  value: CellFn<T, number | undefined>;
}

export interface ITableColumnTypeLabels<T extends object>
  extends ITableColumnCommon<T> {
  type: 'labels';
  value: CellFn<T, string[] | undefined>;
}

export interface ITableColumnTypeDateTime<T extends object>
  extends ITableColumnCommon<T> {
  type: 'datetime';
  value: CellFn<T, number | string | undefined>;
}

export interface ITableColumnTypeDescription<T extends object>
  extends ITableColumnCommon<T> {
  type: 'description';
  value: CellFn<T, string | undefined | null>;
}

export interface ITableColumnTypeText<T extends object>
  extends ITableColumnCommon<T> {
  type: 'text';
  value: CellFn<T, string | null | undefined>;
}

export type ITableColumn<T extends object> =
  | ITableColumnTypeReactNode<T>
  | ITableColumnTypeDateTime<T>
  | ITableColumnTypeLabels<T>
  | ITableColumnTypeCount<T>
  | ITableColumnTypeText<T>
  | ITableColumnTypeDescription<T>;

export function TableColumnCell<T extends object>(props: {
  item: T;
  column?: ITableColumn<T>;
}) {
  const { item, column } = props;
  if (!column) return <></>;
  switch (column.type) {
    case 'text':
      return <TextCell text={column.value(item)} />;
    case 'labels':
      return <LabelsCell labels={column.value(item) ?? []} />;
    case 'description':
      return <TextCell text={column.value(item)} />;
    case 'count':
      return <>{column.value(item) ?? '-'}</>;
    case 'datetime':
      return <SinceCell value={column.value(item)} />;
    default:
      return <>{column.cell(item)}</>;
  }
}
