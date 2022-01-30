import { PDFParams } from '../../Api/types';
import { Params } from '../../Api/types';
import { generatePdf, sendEmail } from '../../Api/api';
import { ReducerTypes, ActionTypes } from './types';
// Later from the frontend component / redux when typed
import { NotificationType } from '../../globalTypes';
import { DispatchType } from '../';

const pending = (id: string, title?: string) => ({
  variant: NotificationType.info,
  title: title
    ? title
    : 'Your report is being generated and will download shortly.',
  id,
  autoDismiss: false,
});

const rejected = (id: string, message?: string) => ({
  variant: NotificationType.danger,
  title: `There was an error generating your report. Please try again.`,
  description: message ? `Details: ${message}` : '',
  autoDismiss: false,
  id,
});

const success = (id: string) => ({
  variant: NotificationType.success,
  title: 'Email sent successfully.',
  id,
  autoDismiss: false,
});

const failure = (id: string, message?: string) => ({
  variant: NotificationType.danger,
  title: `There was an error sending an email. Please try again.`,
  description: message ? `Details: ${message}` : '',
  autoDismiss: false,
  id,
});

export const downloadPdf = (
  params: PDFParams,
  dispatch: DispatchType,
  slug: string
): ActionTypes => ({
  type: ReducerTypes.act,
  payload: generatePdf(params, {
    pending,
    rejected,
    success,
    failure,
    dispatch,
    id: slug,
  }),
  meta: { slug },
});

export const email = (
  params: { payload: string; subject: string; recipient: string; reportUrl: string; body: string },
  dispatch: DispatchType,
  slug: string
): ActionTypes => ({
  type: ReducerTypes.act,
  payload: sendEmail(params, {
    pending,
    rejected,
    success,
    failure,
    dispatch,
    id: slug,
  }),
  meta: { slug },
});
