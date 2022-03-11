/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { FunctionComponent, useEffect } from 'react';
import { downloadPdf as downloadPdfAction } from '../../store/pdfDownloadButton/actions';
import { useAppDispatch } from '../../store';
import {
  useQueryParams,
  useReadQueryParams,
  useRedirect,
} from '../../QueryParams';
import useRequest from '../../Utilities/useRequest';
import { endpointFunctionMap, OptionsReturnType, Params } from '../../Api';
import { useLocation } from 'react-router-dom';
import { getReport } from '../Reports/Shared/schemas';
import {
  Button,
  ButtonVariant,
  Card,
  CardBody,
  EmptyState,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';
import { Paths } from '../../paths';
import { getDateFormatByGranularity } from '../../Utilities/helpers';

const DownloadReport: FunctionComponent<Record<string, never>> = () => {
  const location = useLocation();
  const slug = location.pathname.split('/').pop() as string;
  const report = getReport(slug);

  const download = () => {
    const dispatch = useAppDispatch();
    const {
      availableChartTypes,
      defaultParams,
      dataEndpoint,
      optionsEndpoint,
    } = report.layoutProps;
    const readOptions = endpointFunctionMap(optionsEndpoint);
    const { queryParams } = useQueryParams(defaultParams);

    const chartType = availableChartTypes ? availableChartTypes[0] : 'bar';

    const {
      result: options,
      request: fetchOptions,
      isLoading: isLoading,
      isSuccess: isSuccess,
    } = useRequest<OptionsReturnType>(readOptions, { sort_options: [] });

    useEffect(() => {
      fetchOptions(queryParams);
    }, [queryParams]);

    const chartParams = {
      y: queryParams.sort_options as string,
      label: queryParams.sort_options,
      xTickFormat: getDateFormatByGranularity(
        queryParams.granularity as string
      ),
      chartType: chartType,
    };

    const { chartSeriesHiddenProps } = useReadQueryParams(
      {
        chartSeriesHiddenProps: [],
      },
      'settings'
    );

    if (!isLoading && isSuccess) {
      const showExtraRows =
        new URLSearchParams(location.search).get('showExtraRows') === 'true'
          ? true
          : false;
      downloadPdfAction(
        {
          slug: slug,
          schemaParams: {
            y: chartParams.y,
            label: chartParams.label as string,
            xTickFormat: chartParams.xTickFormat,
            chartType: chartParams.chartType,
          },
          dataFetchingParams: {
            showExtraRows: showExtraRows,
            endpointUrl: dataEndpoint,
            queryParams: queryParams as Params,
            selectOptions: options,
            chartSeriesHiddenProps: chartSeriesHiddenProps,
            sortOptions: queryParams.sort_options as string,
            sortOrder: queryParams.sort_order === 'desc' ? 'desc' : 'asc',
            dateGranularity: queryParams.granularity as string,
            startDate: queryParams.start_date as string,
            endDate: queryParams.end_date as string,
            dateRange: queryParams.quick_date_range as string,
          },
        },
        dispatch,
        slug
      );
    }

    const redirect = useRedirect() as undefined;
    return (
      <Card>
        <CardBody>
          <Title size="lg" headingLevel="h3">
            {
              'Report is being processed, download will start shortly. You can close the window after the download'
            }
          </Title>
          <EmptyState variant={EmptyStateVariant.full}>
            <Button
              key="add-item-button"
              variant={ButtonVariant.primary}
              aria-label={'Close this window'}
              onClick={() => {
                window.open('', '_self').close();
              }}
            >
              {'Close this window'}
            </Button>
            <p></p>
            <Button
              key="add-item-button"
              variant={ButtonVariant.primary}
              aria-label={'Go to home page'}
              onClick={() => {
                redirect(Paths.clusters);
              }}
            >
              {'Go to home page'}
            </Button>
          </EmptyState>
        </CardBody>
      </Card>
    );
  };
  return report ? download() : <></>;
};

export default DownloadReport;
