/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';

import {
  Card,
  CardBody as PFCardBody,
  CardFooter,
  PaginationVariant,
} from '@patternfly/react-core';

import Pagination from '../../../Components/Pagination';

import { useQueryParams } from '../../../QueryParams/';

import useRequest from '../../../Utilities/useRequest';

import ApiStatusWrapper from '../../../Components/ApiStatus/ApiStatusWrapper';
import FilterableToolbar from '../../../Components/Toolbar/Toolbar';

import { AttributesType, ReportGeneratorParams } from '../Shared/types';
import ReportTable from './ReportTable';
import DownloadPdfButton from '../../../Components/Toolbar/DownloadPdfButton';
import { useFeatureFlag, ValidFeatureFlags } from '../../../FeatureFlags';

const CardBody = styled(PFCardBody)`
  & .pf-c-toolbar,
  & .pf-c-toolbar__content {
    padding: 0;
  }
`;

const perPageOptions = [
  { title: '4', value: 4 },
  { title: '6', value: 6 },
  { title: '8', value: 8 },
  { title: '10', value: 10 },
];

const getDateFormatByGranularity = (granularity: string): string => {
  if (granularity === 'yearly') return 'formatAsYear';
  if (granularity === 'monthly') return 'formatAsMonth';
  if (granularity === 'daily') return 'formatDateAsDayMonth';
};
const pdfDownloadEnabled = useFeatureFlag(ValidFeatureFlags.pdfDownloadButton);

const Report: FunctionComponent<ReportGeneratorParams> = ({
  slug,
  defaultParams,
  extraAttributes,
  readData,
  readOptions,
  schemaFnc,
  expandRows,
  listAttributes,
}) => {
  const { queryParams, setFromPagination, setFromToolbar } =
    useQueryParams(defaultParams);

  const { request: setData, ...dataApi } = useRequest(
    useCallback(() => readData(queryParams), [queryParams]),
    {}
  );

  const { result: options, request: setOptions } = useRequest(
    useCallback(() => readOptions(queryParams), [queryParams]),
    {}
  );

  const [attrPairs, setAttrPairs] = useState<AttributesType>([]);
  useEffect(() => {
    if (listAttributes && options.sort_options) {
      const attrsList = options.sort_options.filter(({ key }) =>
        listAttributes.includes(key)
      );
      setAttrPairs([...extraAttributes, ...attrsList]);
    } else if (options.sort_options) {
      setAttrPairs([...extraAttributes, ...options.sort_options]);
    }
  }, [options, extraAttributes]);

  const chartParams = {
    y: queryParams.sort_options as string,
    label:
      options.sort_options?.find(({ key }) => key === queryParams.sort_options)
        ?.value || 'Label Y',
    xTickFormat: getDateFormatByGranularity(queryParams.granularity),
  };

  const chartSchema = schemaFnc(
    chartParams.label,
    chartParams.y,
    chartParams.xTickFormat
  );

  useEffect(() => {
    setData();
    setOptions();
  }, [queryParams]);

  const onSort = (
    _event: unknown,
    index: number,
    direction: 'asc' | 'desc'
  ) => {
    setFromToolbar('sort_order', direction);
    setFromToolbar('sort_options', attrPairs[index]?.key);
  };

  const getSortParams = (currKey: string) => {
    const whitelistKeys = options?.sort_options?.map(
      ({ key }: { key: string }) => key
    );
    if (!whitelistKeys?.includes(currKey)) return {};

    return {
      sort: {
        sortBy: {
          index:
            attrPairs.findIndex(
              ({ key }) => key === queryParams.sort_options
            ) || 0,
          direction: queryParams.sort_order || 'none',
        },
        onSort,
        columnIndex: attrPairs.findIndex(({ key }) => key === currKey),
      },
    };
  };

  return (
    <Card>
      <CardBody>
        <FilterableToolbar
          categories={options}
          filters={queryParams}
          setFilters={setFromToolbar}
          pagination={
            <Pagination
              count={dataApi.result?.meta?.count}
              perPageOptions={perPageOptions}
              params={{
                limit: queryParams.limit,
                offset: queryParams.offset,
              }}
              setPagination={setFromPagination}
              isCompact
            />
          }
          additionalControls={
            pdfDownloadEnabled
              ? [
                  <DownloadPdfButton
                    key="download-button"
                    slug={slug}
                    data={dataApi.result}
                    y={chartParams.y}
                    label={chartParams.label}
                    xTickFormat={chartParams.xTickFormat}
                  />,
                ]
              : []
          }
        />
        {attrPairs && (
          <ApiStatusWrapper api={dataApi}>
            <ReportTable
              dataApi={dataApi}
              chartSchema={chartSchema}
              attrPairs={attrPairs}
              getSortParams={getSortParams}
              expandRows={expandRows}
            />
          </ApiStatusWrapper>
        )}
      </CardBody>
      <CardFooter>
        <Pagination
          count={dataApi.result?.meta?.count}
          perPageOptions={perPageOptions}
          params={{
            limit: queryParams.limit,
            offset: queryParams.offset,
          }}
          setPagination={setFromPagination}
          variant={PaginationVariant.bottom}
        />
      </CardFooter>
    </Card>
  );
};

export default Report;
