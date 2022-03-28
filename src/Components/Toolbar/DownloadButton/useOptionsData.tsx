/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useReducer } from 'react';
import { actions } from './constants';
import { formatDate } from '../../../Utilities/helpers';

const generateExpiryDate = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  return formatDate(d);
};

const useOptionsData = (initial, name, description) => {
  const initialData = {
    downloadType: initial?.downloadType || 'pdf',
    showExtraRows: initial?.showExtraRows || false,
    additionalRecipients: initial?.additionalRecipients || '',
    eula: initial?.eula || false,
    emailExtraRows: initial?.emailExtraRows || false,
    subject:
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      initial?.subject || `The Ansible report, ${name}, is available for view`,
    body:
      initial?.body ||
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/restrict-template-expressions
      `<b>${name}</b>\nThis report shows ${description[0].toLowerCase()}${description.substring(
        1
      )}`,
    selectedRbacGroups: initial?.selectedRbacGroups || [],
    users: initial?.users || [],
    expiry: initial?.expiry || generateExpiryDate(),
  };

  const formReducer = (state: any, { type, value }: any) => {
    switch (type) {
      /* v1 api reducers */
      case actions.SET_DOWNLOAD_TYPE:
        return {
          ...state,
          downloadType: value,
        };
      case actions.SET_SHOW_EXTRA_ROWS:
        return {
          ...state,
          showExtraRows: value,
        };
      case actions.SET_SELECTED_RBAC_GROUPS:
        return {
          ...state,
          selectedRbacGroups: value,
        };
      case actions.SET_ADDITIONAL_RECIPIENTS:
        return {
          ...state,
          additionalRecipients: value,
        };
      case actions.SET_EULA:
        return {
          ...state,
          eula: value,
        };
      case actions.SET_EMAIL_EXTRA_ROWS:
        return {
          ...state,
          emailExtraRows: value,
        };
      case actions.SET_SUBJECT:
        return {
          ...state,
          subject: value,
        };
      case actions.SET_BODY:
        return {
          ...state,
          body: value,
        };
      case actions.SET_USERS:
        return {
          ...state,
          users: value,
        };
      case actions.SET_SELECTED_EXPIRY:
        return {
          ...state,
          expiry: value,
        };
      case actions.RESET_DATA:
        return initialData;
      default:
        throw new Error(
          `useOptionsData reducer action type ${type} was not found.`
        );
    }
  };

  const [formData, dispatchReducer] = useReducer(formReducer, initialData);
  return {
    formData,
    dispatchReducer,
  };
};

export default useOptionsData;