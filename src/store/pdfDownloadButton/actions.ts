import { PDFParams } from '../../Api/types';
import { generatePdf, sendEmail } from '../../Api/api';
import { ReducerTypes, ActionTypes } from './types';
// Later from the frontend component / redux when typed
import { NotificationType } from '../../globalTypes';
import { DispatchType } from '../';
import { PDFEmailParams } from '../../Api/types';

const pending = (id: string, title?: string) => ({
  variant: NotificationType.info,
  title: title
    ? title
    : 'Your report is being generated and will download shortly.',
  id,
  autoDismiss: false,
});

const rejected = (id: string, title?: string, message?: string) => ({
  variant: NotificationType.danger,
  title: title
    ? title
    : `There was an error generating your report. Please try again.`,
  description: message ? `Details: ${message}` : '',
  autoDismiss: false,
  id,
});

const success = (id: string, title?: string) => ({
  variant: NotificationType.success,
  title: title ? title : 'Email sent successfully.',
  id,
});

export const downloadPdf = (
  params: PDFParams,
  dispatch: DispatchType,
  slug: string,
  token: string
): ActionTypes => ({
  type: ReducerTypes.act,
  payload: generatePdf(params, {
    pending,
    rejected,
    success,
    dispatch,
    id: slug,
  }),
  meta: { slug, token },
});

export const email = (
  params: {
    pdfPostBody: PDFEmailParams;
    payload: string;
    subject: string;
    recipient: unknown;
    reportUrl: string;
    expiry: string;
    body: string;
    slug: string;
    token: string;
  },
  dispatch: DispatchType,
  slug: string,
  token: string
): ActionTypes => ({
  type: ReducerTypes.act,
  payload: sendEmail(params, {
    pending,
    rejected,
    success,
    dispatch,
    id: slug,
  }),
  meta: { slug, token },
});
