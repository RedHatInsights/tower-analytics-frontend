import {
  Select,
  SelectOption,
  SelectVariant,
} from '@patternfly/react-core/deprecated';
import { Form } from '@patternfly/react-core/dist/dynamic/components/Form';
import { FormGroup } from '@patternfly/react-core/dist/dynamic/components/Form';
import { FormHelperText } from '@patternfly/react-core/dist/dynamic/components/Form';
import { Radio } from '@patternfly/react-core/dist/dynamic/components/Radio';
import { TextArea } from '@patternfly/react-core/dist/dynamic/components/TextArea';
import { TextInput } from '@patternfly/react-core/dist/dynamic/components/TextInput';
import { Grid } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import { GridItem } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import React, { useEffect, useState } from 'react';
import { readRbacGroups, readRbacPrincipals } from '../../../../../Api';
import { today } from '../../../../../Utilities/helpers';
import useRequest from '../../../../../Utilities/useRequest';
import ToolbarInput from '../../../Groups/ToolbarInput';
import {
  EmailDetailsProps,
  RbacGroupFromApi,
  RbacPrincipalFromApi,
  TypeValue,
  User,
} from '../../../types';
import { actions } from '../../constants';

interface RbacGroupsDataType {
  data: RbacGroupFromApi[];
  meta: {
    count: number;
  };
}
interface RbacPrincipalsDataType {
  data: RbacPrincipalFromApi[];
}

const EmailDetails = ({
  options,
  formData,
  dispatchReducer,
}: {
  options: Record<string, number>;
  formData: EmailDetailsProps;
  dispatchReducer: React.Dispatch<TypeValue>;
}) => {
  const {
    body,
    selectedRbacGroups,
    users,
    subject,
    additionalRecipients,
    emailExtraRows,
    expiry,
  }: EmailDetailsProps = formData;
  const {
    result: { data: rbacGroupsFromApi },
    request: fetchRbacGroups,
  } = useRequest<RbacGroupsDataType>(
    () => readRbacGroups() as unknown as Promise<RbacGroupsDataType>,
    {
      data: [],
      meta: { count: 0 },
    },
  );
  const reportUrl = window.location.href;
  useEffect(() => {
    fetchRbacGroups();
  }, []);

  const {
    result: { data: principalsFromApi },
    request: fetchRbacPrincipals,
  } = useRequest<RbacPrincipalsDataType>(
    () =>
      readRbacPrincipals(
        selectedRbacGroups.at(-1) as string,
      ) as unknown as Promise<RbacPrincipalsDataType>,
    { data: [] },
  );

  useEffect(() => {
    if (selectedRbacGroups.length > 0) fetchRbacPrincipals();
  }, [selectedRbacGroups]);

  const getGroupName = (key: string) => {
    return rbacGroupsFromApi.find(
      (group: RbacGroupFromApi) => group.uuid === key,
    )?.name;
  };

  const updateEmailInfo = () => {
    const usersEmailsList = principalsFromApi.map((user) => user.email);
    const usersNamesList = principalsFromApi.map((user) => user.username);
    const lastSelectedRbacGroup = selectedRbacGroups.at(-1) as string;
    const userHash = {
      uuid: lastSelectedRbacGroup,
      name: getGroupName(lastSelectedRbacGroup) as string,
      usernames: usersNamesList,
      emails: usersEmailsList,
    };
    const index = users.findIndex(
      (object: { uuid: string }) => object.uuid === userHash.uuid,
    );
    if (index === -1) {
      users.push(userHash as User);
    }

    dispatchReducer({
      type: actions.SET_USERS,
      value: users,
    });
  };

  useEffect(() => {
    if (selectedRbacGroups.length > 0) updateEmailInfo();
  }, [principalsFromApi]);

  const { totalPages, pageLimit } = options;
  const showExpiryDate = additionalRecipients.length > 0;
  const extraRowsLabel =
    totalPages <= Math.ceil(100 / pageLimit)
      ? `All ${totalPages} pages`
      : `Top ${Math.ceil(100 / pageLimit)} of ${totalPages} pages`;

  const [showError, setShowError] = useState(false);

  const checkEmailInput = (event: React.FocusEvent<HTMLInputElement>) => {
    const emailList = event.target.value.split(',');
    for (let i = 0; i < emailList.length; i++) {
      const regEx = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      if (!regEx.test(emailList[i])) {
        setShowError(true);
        return;
      }
    }
    setShowError(false);
    return;
  };

  const clearGroupSelection = () => {
    dispatchReducer({
      type: actions.SET_SELECTED_RBAC_GROUPS,
      value: [],
    });
    dispatchReducer({
      type: actions.SET_USERS,
      value: [],
    });
  };

  const onSelectionChange = (field: string, groupToChange: string) => {
    let revisedGroups = [groupToChange];
    let revisedSelectedRbacGroups: string[];
    // if checkbox unchecked, remove group from array & user info from users array
    if (selectedRbacGroups.indexOf(groupToChange) > -1) {
      revisedGroups = selectedRbacGroups.filter(
        (group) => group !== groupToChange,
      );
      const usersOfChangedGroup = users.findIndex(
        ({ uuid }: { uuid: string }) => uuid === groupToChange,
      );
      // if selected group has users
      if (usersOfChangedGroup >= 0) users.splice(usersOfChangedGroup, 1);
      revisedSelectedRbacGroups = revisedGroups;
    } else {
      // add if checkbox checked
      revisedSelectedRbacGroups = selectedRbacGroups.concat(revisedGroups);
    }
    dispatchReducer({
      type: actions.SET_SELECTED_RBAC_GROUPS,
      value: revisedSelectedRbacGroups,
    });
  };

  const onExpiryChange = (value: string) => {
    dispatchReducer({
      type: actions.SET_SELECTED_EXPIRY,
      value: value,
    });
    updateEmailInfo();
  };

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Form>
      {totalPages > 1 && (
        <FormGroup label='Select details:' fieldId='details-field'>
          <Grid md={4}>
            <GridItem>
              <Radio
                onChange={() =>
                  dispatchReducer({
                    type: actions.SET_EMAIL_EXTRA_ROWS,
                    value: false,
                  })
                }
                isChecked={!emailExtraRows}
                name='emailExtraRows'
                label='Current page'
                id='email-current-radio'
                aria-label='email-current-radio'
              />
            </GridItem>
            <GridItem>
              <Radio
                onChange={() =>
                  dispatchReducer({
                    type: actions.SET_EMAIL_EXTRA_ROWS,
                    value: true,
                  })
                }
                isChecked={emailExtraRows}
                name='emailExtraRows'
                label={extraRowsLabel}
                id='email-extra-radio'
                aria-label='email-extra-radio'
              />
            </GridItem>
          </Grid>
        </FormGroup>
      )}
      <FormGroup
        label='Recipient(s)'
        isRequired
        fieldId='selectedRbacGroups-field'
      >
        <Select
          variant={SelectVariant.checkbox}
          aria-label={'Recipient'}
          isOpen={isExpanded}
          onClear={() => clearGroupSelection()}
          onToggle={() => setIsExpanded(!isExpanded)}
          onSelect={(e, selection) => {
            onSelectionChange(
              'selectedRbacGroups',
              typeof selection !== 'string' ? selection.toString() : selection,
            );
            setIsExpanded(false);
          }}
          hasInlineFilter
          selections={selectedRbacGroups}
          placeholderText={'Select Recipients'}
        >
          {rbacGroupsFromApi.map(({ uuid, name }, i) => (
            <SelectOption key={i} value={uuid}>
              {name}
            </SelectOption>
          ))}
        </Select>
      </FormGroup>

      {users.length > 0 && (
        <FormGroup label='User emails' fieldId='emails-field'>
          {users.map(({ name, emails }, i) => {
            return (
              <p key={i}>
                <b>{name}</b>:{' '}
                {emails.length > 0 ? (
                  emails.join(', ')
                ) : (
                  <i>No emails associated with this group</i>
                )}
              </p>
            );
          })}
        </FormGroup>
      )}
      <FormGroup
        label='External recipient(s)'
        fieldId='additionalRecipients-field'
      >
        <TextInput
          placeholder='Comma separated emails'
          type='email'
          id='additionalRecipients'
          name='additionalRecipients'
          value={additionalRecipients}
          onBlur={(e) => checkEmailInput(e)}
          onFocus={(e) => checkEmailInput(e)}
          onChange={(_event, newValue) =>
            dispatchReducer({
              type: actions.SET_ADDITIONAL_RECIPIENTS,
              value: newValue,
            })
          }
        />
        {additionalRecipients && showError && (
          <FormHelperText>
            The email format must be valid and comma separated.
          </FormHelperText>
        )}
      </FormGroup>
      <FormGroup label='Subject' fieldId='subject-field'>
        <TextInput
          placeholder='Report is ready to be downloaded'
          type='text'
          id='subject'
          name='subject'
          value={subject}
          onChange={(_event, newValue) =>
            dispatchReducer({
              type: actions.SET_SUBJECT,
              value: newValue,
            })
          }
        />
      </FormGroup>
      <FormGroup label='Body' fieldId='body-field'>
        <TextArea
          rows={10}
          autoResize
          placeholder=''
          type='text'
          id='body'
          name='body'
          value={body}
          onChange={(_event, newValue) =>
            dispatchReducer({
              type: actions.SET_BODY,
              value: newValue,
            })
          }
        />
      </FormGroup>
      {showExpiryDate && (
        <>
          <FormGroup label='Link expires on' fieldId='expiry-field'>
            <ToolbarInput
              categoryKey='start_date'
              value={expiry}
              setValue={(e) => onExpiryChange(e as string)}
              validators={[
                (date: Date) => {
                  if (date < today()) return 'Must not be before today';
                  return '';
                },
              ]}
            />
          </FormGroup>
          <FormHelperText>
            Link expiry date only applies to external users
          </FormHelperText>
        </>
      )}
      <FormGroup label='Report link' fieldId='link-field'>
        {reportUrl}
      </FormGroup>
    </Form>
  );
};

export default EmailDetails;
