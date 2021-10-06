import React, { FunctionComponent, useEffect, useState } from 'react';
import { Card, CardBody, CardTitle } from '@patternfly/react-core';
import { Table } from './';
import {
  ApiJson,
  OptionsReturnType,
  Params,
  ParamsWithPagination,
} from '../../../../Api';
import useRequest from '../../../../Utilities/useRequest';
import { AttributesType } from '../../Shared/types';
import { LegendEntry } from './types';
import ApiStatusWrapper from '../../../../Components/ApiStatus/ApiStatusWrapper';
import { useQueryParams } from '../../../../QueryParams';

// TODO: To the types file and sync up with the repport types
interface Props {
  defaultParams: Params;
  defaultTableHeaders: AttributesType;
  tableAttributes?: string[];
  readData: (options: ParamsWithPagination) => Promise<ApiJson>;
  readOptions: (options: Params) => Promise<ApiJson>;
}

interface ApiReturnType {
  meta: {
    count: number;
    legend: LegendEntry[];
  };
  links: {
    next: string | null;
  };
}

const UnrolledTableCard: FunctionComponent<Props> = ({
  defaultParams,
  defaultTableHeaders,
  tableAttributes,
  readData,
  readOptions,
}) => {
  const { queryParams } = useQueryParams(defaultParams) as {
    queryParams: Params;
  };

  const { request: setData, ...dataApi } = useRequest(
    (params) =>
      readData(
        params as ParamsWithPagination
      ) as unknown as Promise<ApiReturnType>,
    { meta: { count: 0, legend: [] }, links: { next: null } }
  );

  const { result: options, request: setOptions } =
    useRequest<OptionsReturnType>(
      () => readOptions(queryParams) as Promise<OptionsReturnType>,
      { sort_options: [] }
    );

  const [legend, setLegend] = useState<LegendEntry[]>([]);

  const getNextPage = () =>
    setData({
      ...queryParams,
      limit: '25',
      offset: `${legend.length}`,
    });

  useEffect(() => {
    setOptions();
  }, []);

  useEffect(() => {
    setLegend([]);
    getNextPage();
  }, [queryParams]);

  useEffect(() => {
    setLegend([
      ...legend,
      ...dataApi.result.meta.legend.filter((item) => +item.id !== -1),
    ]);
  }, [dataApi.result]);

  useEffect(() => {
    if (legend.length < 100 && dataApi.result.links.next) {
      getNextPage();
    }
  }, [legend]);

  const tableHeaders = [
    ...defaultTableHeaders,
    ...(tableAttributes
      ? options.sort_options.filter(({ key }) => tableAttributes.includes(key))
      : options.sort_options),
  ];

  const sortedBy = options.sort_options.find(
    ({ key }) => key === queryParams.sort_options
  )?.value;

  const pagination = legend.length < 100 ? 'all data' : 'first 4 pages';

  return (
    <Card>
      <CardTitle>
        Top {legend.length} results ({pagination}, sorted by {sortedBy})
      </CardTitle>
      <CardBody>
        <Table legend={legend} headers={tableHeaders} />
        <ApiStatusWrapper api={dataApi}> </ApiStatusWrapper>
      </CardBody>
    </Card>
  );
};

export default UnrolledTableCard;
