import { PDFParams } from '../../Api/types';
import { generatePdf } from '../../Api/api';
import { ReducerTypes, ActionTypes } from './types';

export const toast = (params: PDFParams): ActionTypes => ({
  type: ReducerTypes.toast,
  payload: generatePdf(params),
  meta: {
    notifications: {
      pending: {
        variant: 'info',
        title: 'Your report is being generated and will download shortly.',
      },
      rejected: {
        autoDismiss: false,
        variant: 'danger',
        title: 'There was an error generating your report. Please try again.',
      },
    },
  },
});

// export const loading = (): ActionTypes => ({
//   type: ReducerTypes.pending,
//   payload: {
//     variant: 'info',
//     title: 'Your report is being generated and will download shortly.',
//   },
// });

// export const errors = (): ActionTypes => ({
//   type: ReducerTypes.errors,
//   payload: {
//     variant: 'danger',
//     title: 'There was an error generating your report. Please try again.',
//   },
// });

// export const fulfilled = (
//   toastNotifications: ToastNotification[]
// ): ActionTypes => ({
//   type: ReducerTypes.fulfilled,
//   payload: toastNotifications,
// });
