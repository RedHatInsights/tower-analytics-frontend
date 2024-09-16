import { useReducer } from 'react';
import { formatDate } from '../../../Utilities/helpers';
import { EmailDetailsProps, TypeValue } from '../types';
import { actions } from './constants';

const generateExpiryDate = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  return formatDate(d);
};

const useOptionsData = (
  initial: EmailDetailsProps,
  name: string,
  description: string
) => {
  const initialData = {
    downloadType: initial?.downloadType || 'pdf',
    showExtraRows: initial?.showExtraRows || false,
    additionalRecipients: initial?.additionalRecipients || '',
    eula: initial?.eula || false,
    emailExtraRows: initial?.emailExtraRows || false,
    subject:
      initial?.subject || `The Ansible report, ${name}, is available for view`,
    body:
      initial?.body ||
      `<b>${name}</b>\nThis report shows ${description[0].toLowerCase()}${description.substring(
        1
      )}`,
    selectedRbacGroups: initial?.selectedRbacGroups || [],
    users: initial?.users || [],
    expiry: initial?.expiry || generateExpiryDate(),
  };

  const formReducer = (
    state: EmailDetailsProps,
    action: TypeValue
  ): EmailDetailsProps => {
    switch (action.type) {
      /* v1 api reducers */
      case actions.SET_DOWNLOAD_TYPE:
        return {
          ...state,
          downloadType: action.value,
        } as EmailDetailsProps;
      case actions.SET_SHOW_EXTRA_ROWS:
        return {
          ...state,
          showExtraRows: action.value,
        } as EmailDetailsProps;
      case actions.SET_SELECTED_RBAC_GROUPS:
        return {
          ...state,
          selectedRbacGroups: action.value,
        } as unknown as EmailDetailsProps;
      case actions.SET_ADDITIONAL_RECIPIENTS:
        return {
          ...state,
          additionalRecipients: action.value,
        } as EmailDetailsProps;
      case actions.SET_EULA:
        return {
          ...state,
          eula: action.value,
        } as EmailDetailsProps;
      case actions.SET_EMAIL_EXTRA_ROWS:
        return {
          ...state,
          emailExtraRows: action.value,
        } as EmailDetailsProps;
      case actions.SET_SUBJECT:
        return {
          ...state,
          subject: action.value,
        } as EmailDetailsProps;
      case actions.SET_BODY:
        return {
          ...state,
          body: action.value,
        } as EmailDetailsProps;
      case actions.SET_USERS:
        return {
          ...state,
          users: action.value,
        } as unknown as EmailDetailsProps;
      case actions.SET_SELECTED_EXPIRY:
        return {
          ...state,
          expiry: action.value,
        } as EmailDetailsProps;
      case actions.RESET_DATA:
        return initialData;
      default:
        throw new Error(
          `useOptionsData reducer action type ${action.type} was not found.`
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
