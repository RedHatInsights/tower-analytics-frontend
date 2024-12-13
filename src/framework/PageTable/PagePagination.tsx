import {
  Pagination,
  PaginationVariant,
} from '@patternfly/react-core/dist/dynamic/components/Pagination';
import React, { CSSProperties, useCallback } from 'react';
import { useBreakpoint } from '../components/useBreakpoint';

export type PagePaginationProps = {
  itemCount?: number;
  page: number;
  perPage: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  style?: CSSProperties;
};

export function PagePagination(props: PagePaginationProps) {
  const { setPage, setPerPage } = props;
  const onSetPage = useCallback((_event, page) => setPage(page), [setPage]);
  const onPerPageSelect = useCallback(
    (_event, perPage) => setPerPage(perPage),
    [setPerPage],
  );
  const compact = !useBreakpoint('md');
  return (
    <Pagination
      variant={PaginationVariant.bottom}
      itemCount={props.itemCount}
      page={props.page}
      perPage={props.perPage}
      onSetPage={onSetPage}
      onPerPageSelect={onPerPageSelect}
      style={{
        ...props.style,
        boxShadow: 'none',
        zIndex: 301,
        // marginTop: -1,
        paddingTop: compact ? 4 : 6,
        paddingBottom: compact ? 4 : 6,
      }}
      className='dark-2'
    />
  );
}
