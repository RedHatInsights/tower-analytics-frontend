import { PDFParams } from '../../Api/types';
import { generatePdf } from '../../Api/api';
import { ReducerTypes, ActionTypes } from './types';
import { Dispatch } from 'redux';

const pending = (id: string) => ({
  variant: 'info',
  title: 'Your report is being generated and will download shortly.',
  id,
});

const rejected = (id: string, message?: string) => ({
  variant: 'danger',
  title: `There was an error generating your report. Please try again.`,
  description: message ? `Details: ${message}` : '',
  autoDismiss: false,
  id,
});

export const toast = (
  params: PDFParams,
  dispatch: Dispatch<any>,
  slug: string
): ActionTypes => ({
  type: ReducerTypes.toast,
  payload: generatePdf(params, {
    pending,
    rejected,
    dispatch,
    id: slug,
  }),
  meta: { slug },
});
