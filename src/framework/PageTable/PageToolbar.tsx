import {
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
} from '@patternfly/react-core/deprecated';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import {
  InputGroup,
  InputGroupItem,
} from '@patternfly/react-core/dist/dynamic/components/InputGroup';
import {
  Pagination,
  PaginationVariant,
} from '@patternfly/react-core/dist/dynamic/components/Pagination';
import { Skeleton } from '@patternfly/react-core/dist/dynamic/components/Skeleton';
import {
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from '@patternfly/react-core/dist/dynamic/components/TextInputGroup';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@patternfly/react-core/dist/dynamic/components/ToggleGroup';
import {
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
  ToolbarToggleGroup,
} from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import {
  Flex,
  FlexItem,
} from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import ArrowRightIcon from '@patternfly/react-icons/dist/dynamic/icons/arrow-right-icon';
import ColumnsIcon from '@patternfly/react-icons/dist/dynamic/icons/columns-icon';
import FilterIcon from '@patternfly/react-icons/dist/dynamic/icons/filter-icon';
import ListIcon from '@patternfly/react-icons/dist/dynamic/icons/list-icon';
import TableIcon from '@patternfly/react-icons/dist/dynamic/icons/table-icon';
import ThLargeIcon from '@patternfly/react-icons/dist/dynamic/icons/th-large-icon';
import TimesIcon from '@patternfly/react-icons/dist/dynamic/icons/times-icon';
import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useCallback,
  useState,
} from 'react';
import { IPageAction } from '../PageActions/PageAction';
import { PageActionType } from '../PageActions/PageActionType';
import { PageActions } from '../PageActions/PageActions';
import { FormGroupSelect } from '../PageForm/Inputs/FormGroupSelect';
import { BulkSelector } from '../components/BulkSelector';
import { useBreakpoint } from '../components/useBreakpoint';
import { PageTableViewType, PageTableViewTypeE } from './PageTableViewType';
import './PageToolbar.css';

export interface IItemFilter<T extends object> {
  label: string;
  type?: 'search' | 'filter';
  options: {
    label: string;
    value: string;
  }[];
  filter: (item: T, values: string[]) => boolean;
}

export type SetFilterValues<T extends object> = (
  filter: IItemFilter<T>,
  values: string[]
) => void;

export interface IToolbarStringFilter {
  key: string;
  label: string;
  type: 'string';
  query: string;
  placeholder?: string;
}

export interface IToolbarSelectFilter {
  key: string;
  label: string;
  type: 'select';
  options: {
    label: string;
    value: string;
  }[];
  query: string;
  placeholder?: string;
}

export type IToolbarFilter = IToolbarStringFilter | IToolbarSelectFilter;

export type IFilterState = Record<string, string[] | undefined>;

export type PagetableToolbarProps<T extends object> = {
  openColumnModal?: () => void;
  keyFn: (item: T) => string | number;

  itemCount?: number;

  toolbarActions?: IPageAction<T>[];

  toolbarFilters?: IToolbarFilter[];
  filters?: Record<string, string[]>;
  setFilters?: Dispatch<SetStateAction<Record<string, string[]>>>;
  clearAllFilters?: () => void;

  page: number;
  perPage: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;

  isSelected?: (item: T) => boolean;
  selectedItems?: T[];
  selectItem?: (item: T) => void;
  unselectItem?: (item: T) => void;
  selectItems?: (items: T[]) => void;
  unselectAll?: () => void;
  onSelect?: (item: T) => void;

  showSelect?: boolean;

  viewType: PageTableViewType;
  setViewType: (viewType: PageTableViewType) => void;

  disableTableView?: boolean;
  disableListView?: boolean;
  disableCardView?: boolean;
  disableColumnManagement?: boolean;
};

export function PageTableToolbar<T extends object>(
  props: PagetableToolbarProps<T>
) {
  const {
    itemCount,
    page,
    perPage,
    setPage,
    setPerPage,
    toolbarFilters,
    selectedItems,
    filters,
    setFilters,
    clearAllFilters,
    openColumnModal,
  } = props;

  const sm = useBreakpoint('md');

  const { viewType, setViewType } = props;
  let { toolbarActions } = props;
  toolbarActions = toolbarActions ?? [];

  const onSetPage = useCallback((_event, page) => setPage(page), [setPage]);
  const onPerPageSelect = useCallback(
    (_event, perPage) => setPerPage(perPage),
    [setPerPage]
  );

  const showSearchAndFilters = toolbarFilters !== undefined;
  const showToolbarActions =
    toolbarActions !== undefined && toolbarActions.length > 0;

  const showSelect =
    props.showSelect === true ||
    (selectedItems !== undefined &&
      toolbarActions &&
      toolbarActions.find(
        (toolbarAction) => PageActionType.bulk === toolbarAction.type
      ));

  const showToolbar = showSelect || showSearchAndFilters || showToolbarActions;

  const [selectedFilter, setSeletedFilter] = useState(() =>
    toolbarFilters
      ? toolbarFilters?.length > 0
        ? toolbarFilters[0].key
        : ''
      : ''
  );

  let viewTypeCount = 0;
  if (!props.disableTableView) viewTypeCount++;
  if (!props.disableCardView) viewTypeCount++;
  if (!props.disableListView) viewTypeCount++;

  if (!showToolbar) {
    return <Fragment />;
  }

  if (itemCount === undefined) {
    return (
      <Toolbar
        className='border-bottom dark-2'
        style={{
          paddingBottom: sm ? undefined : 8,
          paddingTop: sm ? undefined : 8,
        }}
      >
        <ToolbarContent>
          <ToolbarItem style={{ width: '100%' }}>
            <Skeleton height='36px' />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
    );
  }

  return (
    <Toolbar
      clearAllFilters={clearAllFilters}
      className='dark-2'
      style={{
        paddingBottom: sm ? undefined : 8,
        paddingTop: sm ? undefined : 8,
      }}
    >
      <ToolbarContent>
        {showSelect && (
          <ToolbarGroup>
            <ToolbarItem variant='bulk-select'>
              <BulkSelector {...props} />
            </ToolbarItem>
          </ToolbarGroup>
        )}
        {toolbarFilters && toolbarFilters.length > 0 && (
          <ToolbarToggleGroup
            toggleIcon={<FilterIcon />}
            breakpoint='md'
            style={{ zIndex: 302 }}
          >
            <ToolbarGroup variant='filter-group'>
              <ToolbarItem>
                <FormGroupSelect
                  id='filter'
                  onSelect={(_, v) => setSeletedFilter(v.toString())}
                  value={selectedFilter}
                  placeholderText='Select filter'
                >
                  {toolbarFilters.map((filter) => (
                    <SelectOption key={filter.key} value={filter.key}>
                      <Flex
                        spaceItems={{ default: 'spaceItemsNone' }}
                        alignItems={{ default: 'alignItemsCenter' }}
                        flexWrap={{ default: 'nowrap' }}
                      >
                        <FlexItem style={{ paddingLeft: 4, paddingRight: 8 }}>
                          <FilterIcon />
                        </FlexItem>
                        <FlexItem>{filter.label}</FlexItem>
                      </Flex>
                    </SelectOption>
                  ))}
                </FormGroupSelect>
              </ToolbarItem>
              <ToolbarItem>
                <ToolbarFilterInput
                  id='filter-input'
                  filter={toolbarFilters.find(
                    (filter) => filter.key === selectedFilter
                  )}
                  addFilter={(value: string) => {
                    let values = filters?.[selectedFilter];
                    if (!values) values = [];
                    if (!values.includes(value)) values.push(value);
                    setFilters?.({ ...filters, [selectedFilter]: values });
                  }}
                  removeFilter={(value: string) => {
                    let values = filters?.[selectedFilter];
                    if (!values) values = [];
                    values = values.filter((v) => v !== value);
                    setFilters?.({ ...filters, [selectedFilter]: values });
                  }}
                  values={filters?.[selectedFilter] ?? []}
                />
              </ToolbarItem>
              {toolbarFilters.map((filter) => {
                const values = filters?.[filter.key] ?? [];
                return (
                  <ToolbarFilter
                    key={filter.label}
                    categoryName={filter.label}
                    chips={values.map((value) => {
                      return 'options' in filter
                        ? filter.options.find((o) => o.value === value)
                            ?.label ?? value
                        : value;
                    })}
                    deleteChip={(_group, value) => {
                      setFilters?.((filters) => {
                        //TODO bug here where value is actually select filter option label... need to map
                        const newState = { ...filters };
                        value = typeof value === 'string' ? value : value.key;
                        let values = filters[filter.key];
                        if (values) {
                          values = values.filter((v) => v !== value);
                          if (values.length === 0) {
                            delete newState[filter.key];
                          } else {
                            newState[filter.key] = values;
                          }
                        }
                        return newState;
                      });
                    }}
                    deleteChipGroup={() => {
                      setFilters?.((filters) => {
                        const newState = { ...filters };
                        delete newState[filter.key];
                        return newState;
                      });
                    }}
                    showToolbarItem={false}
                  >
                    <></>
                  </ToolbarFilter>
                );
              })}
            </ToolbarGroup>
          </ToolbarToggleGroup>
        )}

        {/* Action Buttons */}
        <ToolbarGroup variant='button-group' style={{ zIndex: 302 }}>
          <PageActions
            actions={toolbarActions}
            selectedItems={selectedItems}
            wrapper={ToolbarItem}
          />
        </ToolbarGroup>
        <div style={{ flexGrow: 1 }} />

        <ToolbarGroup variant='button-group' style={{ zIndex: 302 }}>
          {!props.disableColumnManagement &&
            openColumnModal &&
            viewType === 'table' && (
              <ToolbarItem>
                <Tooltip content={'Manage columns'}>
                  <Button
                    variant='plain'
                    icon={<ColumnsIcon />}
                    onClick={openColumnModal}
                  />
                </Tooltip>
              </ToolbarItem>
            )}
          {viewTypeCount > 1 && (
            <ToolbarItem>
              <ToggleGroup aria-label='table view toggle'>
                {[
                  !props.disableTableView && PageTableViewTypeE.Table,
                  !props.disableListView && PageTableViewTypeE.List,
                  !props.disableCardView && PageTableViewTypeE.Cards,
                ]
                  .filter((i) => i)
                  .map((vt) => {
                    switch (vt) {
                      case PageTableViewTypeE.Cards:
                        return (
                          <Tooltip
                            content={'Card view'}
                            key={vt}
                            position='top-end'
                            enableFlip={false}
                          >
                            <ToggleGroupItem
                              icon={<ThLargeIcon />}
                              isSelected={viewType === PageTableViewTypeE.Cards}
                              onClick={() =>
                                setViewType?.(PageTableViewTypeE.Cards)
                              }
                              aria-label='card view'
                            />
                          </Tooltip>
                        );
                      case PageTableViewTypeE.List:
                        return (
                          <Tooltip
                            content={'List view'}
                            key={vt}
                            position='top-end'
                            enableFlip={false}
                          >
                            <ToggleGroupItem
                              icon={<ListIcon />}
                              isSelected={viewType === PageTableViewTypeE.List}
                              onClick={() =>
                                setViewType?.(PageTableViewTypeE.List)
                              }
                              aria-label='list view'
                            />
                          </Tooltip>
                        );
                      case PageTableViewTypeE.Table:
                        return (
                          <Tooltip
                            content={'Table view'}
                            key={vt}
                            position='top-end'
                            enableFlip={false}
                          >
                            <ToggleGroupItem
                              icon={<TableIcon />}
                              isSelected={viewType === PageTableViewTypeE.Table}
                              onClick={() =>
                                setViewType?.(PageTableViewTypeE.Table)
                              }
                              aria-label='table view'
                            />
                          </Tooltip>
                        );
                    }
                  })}
              </ToggleGroup>
            </ToolbarItem>
          )}
        </ToolbarGroup>

        {/* {toolbarButtonActions.length > 0 && <ToolbarGroup variant="button-group">{toolbarActionButtons}</ToolbarGroup>} */}
        {/* <ToolbarGroup variant="button-group">{toolbarActionDropDownItems}</ToolbarGroup> */}

        {/* Pagination */}
        <ToolbarItem visibility={{ default: 'hidden', '2xl': 'visible' }}>
          <Pagination
            variant={PaginationVariant.top}
            isCompact
            itemCount={itemCount}
            perPage={perPage}
            page={page}
            onSetPage={onSetPage}
            onPerPageSelect={onPerPageSelect}
            style={{ marginTop: -8, marginBottom: -8 }}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
}

function ToolbarFilterInput(props: {
  id?: string;
  filter?: IToolbarFilter;
  addFilter: (value: string) => void;
  values: string[];
  removeFilter: (value: string) => void;
}) {
  const { filter } = props;
  switch (filter?.type) {
    case 'string':
      return <ToolbarTextFilter {...props} placeholder={filter.placeholder} />;
    case 'select':
      return (
        <ToolbarSelectFilter
          {...props}
          options={filter.options}
          placeholder={filter.placeholder}
        />
      );
  }
  return <></>;
}

function ToolbarTextFilter(props: {
  id?: string;
  addFilter: (value: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState('');
  return (
    <InputGroup>
      <InputGroupItem>
        <TextInputGroup style={{ minWidth: 220 }}>
          <TextInputGroupMain
            id={props.id}
            // ref={ref}
            value={value}
            onChange={(e, v) => setValue(v)}
            onKeyUp={(event) => {
              if (value && event.key === 'Enter') {
                props.addFilter(value);
                setValue('');
                // ref.current?.focus() // Does not work because PF does not expose ref
              }
            }}
            placeholder={props.placeholder}
          />
          {value !== '' && (
            <TextInputGroupUtilities>
              <Button
                variant='plain'
                aria-label='clear filter'
                onClick={() => setValue('')}
                style={{ opacity: value ? undefined : 0 }}
                // tabIndex={value ? undefined : -1}
                tabIndex={-1}
              >
                <TimesIcon />
              </Button>
            </TextInputGroupUtilities>
          )}
        </TextInputGroup>
      </InputGroupItem>

      {!value ? (
        <></>
      ) : (
        <Button
          variant={value ? 'primary' : 'control'}
          aria-label='apply filter'
          onClick={() => {
            props.addFilter(value);
            setValue('');
          }}
          tabIndex={-1}
        >
          <ArrowRightIcon />
        </Button>
      )}
    </InputGroup>
  );
}

function ToolbarSelectFilter(props: {
  addFilter: (value: string) => void;
  removeFilter: (value: string) => void;
  options: { label: string; value: string }[];
  values: string[];
  placeholder?: string;
}) {
  const { addFilter, removeFilter, options, values } = props;
  const [open, setOpen] = useState(false);
  const onSelect = useCallback(
    (e: unknown, value: string | SelectOptionObject) => {
      if (values.includes(value.toString())) {
        removeFilter(value.toString());
      } else {
        addFilter(value.toString());
      }
    },
    [addFilter, removeFilter, values]
  );
  const selections = values;
  return (
    <>
      <Select
        variant={SelectVariant.checkbox}
        isOpen={open}
        onToggle={(_event, val) => setOpen(val)}
        selections={selections}
        onSelect={onSelect}
        placeholderText={
          values.length ? (
            'Selected'
          ) : (
            <span style={{ opacity: 0.7 }}>{props.placeholder}</span>
          )
        }
      >
        {options.map((option) => (
          <SelectOption
            id={option.value}
            key={option.value}
            value={option.value}
          >
            {option.label}
          </SelectOption>
        ))}
      </Select>
    </>
  );
}
