import { Endpoint, OptionsReturnType, Params } from '../../../../../Api';
import { DispatchType } from '../../../../../store';
import { downloadPdf as downloadPdfAction } from '../../../../../store/pdfDownloadButton';

interface Props {
  slug: string;
  isMoney: boolean;
  endpointUrl: Endpoint;
  queryParams: Params;
  selectOptions: OptionsReturnType;
  y: string;
  label: string;
  xTickFormat: string;
  chartType: string;
  totalPages: number;
  pageLimit: number;
  sortOptions: string;
  sortOrder: 'asc' | 'desc';
  dateGranularity: string;
  startDate: string;
  endDate: string;
  dateRange: string;
  adoptionRateType: string;
  dispatch: DispatchType;
  chartSeriesHiddenProps: boolean[];
  showExtraRows: boolean;
  inputs?: { automationCost: number; manualCost: number };
}

const PdfDownload: ({
  slug,
  isMoney,
  endpointUrl,
  queryParams,
  selectOptions,
  y,
  label,
  xTickFormat,
  chartType,
  totalPages,
  pageLimit,
  sortOptions,
  sortOrder,
  dateGranularity,
  startDate,
  endDate,
  dateRange,
  adoptionRateType,
  dispatch,
  chartSeriesHiddenProps,
  showExtraRows,
  inputs,
}: Props) => void = ({
  slug,
  isMoney,
  endpointUrl,
  queryParams,
  selectOptions,
  y,
  label,
  xTickFormat,
  chartType,
  totalPages,
  pageLimit,
  sortOptions,
  sortOrder,
  dateGranularity,
  startDate,
  endDate,
  dateRange,
  adoptionRateType,
  dispatch,
  chartSeriesHiddenProps,
  showExtraRows,
  inputs,
}) => {
  const allParams = inputs ? { ...queryParams, inputs } : queryParams;
  const token = '';
  // set chartSeriesHiddenProps to a default value
  if (!chartSeriesHiddenProps) {
    chartSeriesHiddenProps = [];
  }
  sortOrder = sortOrder ?? 'asc';
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
          isMoney,
          showExtraRows: showExtraRows,
          endpointUrl,
          queryParams: allParams,
          selectOptions,
          chartSeriesHiddenProps,
          totalPages,
          pageLimit,
          sortOptions,
          sortOrder,
          dateGranularity,
          startDate,
          endDate,
          dateRange,
          adoptionRateType,
        },
      },
      dispatch,
      slug,
      token,
    ),
  );
};
export default PdfDownload;
