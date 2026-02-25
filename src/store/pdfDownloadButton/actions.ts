import { DispatchType } from '../';
import { generatePdf, sendEmail } from '../../Api/api';
import { PDFEmailParams, PDFParams } from '../../Api/types';
import { ActionTypes, ReducerTypes } from './types';

export const downloadPdf = (
  params: PDFParams,
  dispatch: DispatchType,
  slug: string,
  token: string,
): ActionTypes => ({
  type: ReducerTypes.act,
  payload: generatePdf(params, 'Generating PDF report'),
  meta: { slug, token },
});

export const email = (
  params: {
    pdfPostBody: PDFEmailParams;
    payload: string;
    subject: string;
    recipient: any;
    reportUrl: string;
    expiry: string;
    body: string;
    slug: string;
    token: string;
  },
  dispatch: DispatchType,
  slug: string,
  token: string,
): ActionTypes => ({
  type: ReducerTypes.act,
  payload: sendEmail(params, 'Sending report via email'),
  meta: { slug, token },
});
