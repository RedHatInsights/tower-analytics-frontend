import { PDFParams } from '../../Api/types';
import { generatePdf } from '../../Api/api';
import { ReducerTypes, ActionTypes } from './types';
// Later from the frontend component / redux when typed
import { NotificationType } from '../../globalTypes';
import { DispatchType } from '../';

const pending = (id: string) => ({
  variant: NotificationType.info,
  title: 'Your report is being generated and will download shortly.',
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

export const downloadPdf = (
  params: PDFParams,
  dispatch: DispatchType,
  slug: string
): ActionTypes => ({
  type: ReducerTypes.act,
  payload: generatePdf(params, {
    pending,
    rejected,
    dispatch,
    id: slug,
  }),
  meta: { slug },
});
