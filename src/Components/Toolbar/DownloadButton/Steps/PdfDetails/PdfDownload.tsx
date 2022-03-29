/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { FC } from 'react';
import {
  downloadPdf as downloadPdfAction,
  DownloadState,
} from '../../../../../store/pdfDownloadButton';
import { Endpoint, OptionsReturnType, Params } from '../../../../../Api';
import {
  DispatchType,
  useAppDispatch,
  useAppSelector,
} from '../../../../../store';
import { QueryParams } from '../../../../../QueryParams/types';

interface Props {
  slug: string;
  endpointUrl: Endpoint;
  queryParams: Params;
  selectOptions: OptionsReturnType;
  y: string;
  label: string;
  xTickFormat: string;
  chartType: string;
  sortOptions: string;
  sortOrder: 'asc' | 'desc';
  dateGranularity: string;
  startDate: string;
  endDate: string;
  dateRange: string;
  dispatch: DispatchType;
  chartSeriesHiddenProps: QueryParams;
  showExtraRows: boolean;
  inputs?: { automationCost: number; manualCost: number };
}

const PdfDownload: FC<Props> = ({
  slug,
  endpointUrl,
  queryParams,
  selectOptions,
  y,
  label,
  xTickFormat,
  chartType,
  sortOptions,
  sortOrder,
  dateGranularity,
  startDate,
  endDate,
  dateRange,
  dispatch,
  chartSeriesHiddenProps,
  showExtraRows,
  inputs,
}) => {
  const allParams = inputs ? { ...queryParams, inputs } : queryParams;
  // Dispatch the start of downloading the pdf
  dispatch(
    downloadPdfAction(
      {
        slug,
        schemaParams: {
          y,
          label,
          xTickFormat,
          chartType,
        },
        dataFetchingParams: {
          showExtraRows: showExtraRows,
          endpointUrl,
          queryParams: allParams,
          selectOptions,
          chartSeriesHiddenProps,
          sortOptions,
          sortOrder,
          dateGranularity,
          startDate,
          endDate,
          dateRange,
        },
      },
      dispatch,
      slug
    )
  );
};
export default PdfDownload;
