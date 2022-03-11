import React, { FC, useState } from 'react';
import {
  Checkbox,
  Form,
  FormGroup,
  FormHelperText,
  Grid,
  GridItem,
  Radio,
  Select,
  SelectOption,
  SelectVariant,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { EmailDetailsType, RbacGroupFromApi } from './types';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
interface Props {
  emailInfo: EmailDetailsType;
  extraRowsLabel: string;
  onChange: (value: any) => void;
  allRbacGroups: RbacGroupFromApi[];
}

const EmailDetailsForm: FC<Props> = ({
  emailInfo,
  extraRowsLabel,
  onChange = () => null,
  allRbacGroups,
}) => {
  const {
    body,
    selectedRbacGroups,
    users,
    reportUrl,
    subject,
    additionalRecipients,
    eula,
    showExtraRows,
  } = emailInfo;
  const [showError, setShowError] = useState(false);
  const onInputChange = (field: string, val: string) => {
    onChange({ ...emailInfo, [field]: val });
  };

  const handleCheckbox = (field: string, checked: boolean) => {
    onChange({ ...emailInfo, [field]: checked });
  };

  const checkEmailInput = (value: string) => {
    const emailList = value.split(',');
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
    onChange({
      ...emailInfo,
      selectedRbacGroups: [],
      users: [],
    });
  };

  const onSelectionChange = (field: string, groupToChange: string) => {
    let revisedGroups = [groupToChange];
    // if checkbox unchecked, remove group from array & user info from users array
    if (selectedRbacGroups.indexOf(groupToChange) > -1) {
      revisedGroups = selectedRbacGroups.filter(
        (group) => group !== groupToChange
      );
      const usersOfChangedGroup = users.findIndex(
        ({ uuid }) => uuid === groupToChange
      );
      // if selected group has users
      if (usersOfChangedGroup >= 0)
        emailInfo.users.splice(usersOfChangedGroup, 1);
      emailInfo.selectedRbacGroups = revisedGroups;
    } else {
      // add if checkbox checked
      emailInfo.selectedRbacGroups = selectedRbacGroups.concat(revisedGroups);
    }
    onChange({
      ...emailInfo,
    });
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const setExtraRows = (field: string, value: boolean) => {
    onChange({ ...emailInfo, [field]: value });
  };

  return (
    <Form>
      <FormGroup
        label="Recipient"
        isRequired
        fieldId="selectedRbacGroups-field"
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
              typeof selection !== 'string' ? selection.toString() : selection
            );
            setIsExpanded(false);
          }}
          hasInlineFilter
          selections={selectedRbacGroups}
          placeholderText={'Select Recipients'}
        >
          {allRbacGroups.map(({ uuid, name }, i) => (
            <SelectOption key={i} value={uuid}>
              {name}
            </SelectOption>
          ))}
        </Select>
      </FormGroup>
      {users.length > 0 && (
        <FormGroup label="User emails" fieldId="emails-field">
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
        label="External recipients"
        fieldId="additionalRecipients-field"
      >
        <TextInput
          placeholder="Comma separated emails"
          type="email"
          id="additionalRecipients"
          name="additionalRecipients"
          value={additionalRecipients}
          onBlur={(e) => checkEmailInput(e.target.value)}
          onFocus={(e) => checkEmailInput(e.target.value)}
          onChange={(value) => onInputChange('additionalRecipients', value)}
        />
        {additionalRecipients && showError && (
          <FormHelperText
            isError
            icon={<ExclamationCircleIcon />}
            isHidden={!showError}
          >
            The email format must be valid and comma separated.
          </FormHelperText>
        )}
      </FormGroup>
      <FormGroup label="EULA Acknowledgement" fieldId="eula-field">
        <Checkbox
          isChecked={eula}
          aria-label="card checkbox"
          id="eula"
          name="eula"
          onChange={(checked) => handleCheckbox('eula', checked)}
        />
        {additionalRecipients && !eula && (
          <FormHelperText
            isError
            icon={<ExclamationCircleIcon />}
            isHidden={additionalRecipients === '' && !eula}
          >
            Please confirm the EULA acknowledgement if external e-mails are
            being used.
          </FormHelperText>
        )}
      </FormGroup>
      <FormGroup label="Email details" fieldId="extraRows-field">
        <Grid md={4}>
          <GridItem>
            <Radio
              onChange={() => setExtraRows('showExtraRows', false)}
              isChecked={!showExtraRows}
              name="showExtraRows"
              label="Current page"
              id="showExtraRows-current-radio"
              aria-label="showExtraRows-current-radio"
            />
          </GridItem>
          <GridItem>
            <Radio
              onChange={() => setExtraRows('showExtraRows', true)}
              isChecked={showExtraRows}
              name="showExtraRows"
              label={extraRowsLabel}
              id="showExtraRows-total-radio"
              aria-label="showExtraRows-total-radio"
            />
          </GridItem>
        </Grid>
      </FormGroup>
      <FormGroup label="Subject" fieldId="subject-field">
        <TextInput
          placeholder="Report is ready to be downloaded"
          type="text"
          id="subject"
          name="subject"
          value={subject}
          onChange={(value) => onInputChange('subject', value)}
        />
      </FormGroup>
      <FormGroup label="Body" fieldId="body-field">
        <TextArea
          rows={10}
          autoResize
          placeholder=""
          type="text"
          id="body"
          name="body"
          value={body}
          onChange={(value) => onInputChange('body', value)}
        />
      </FormGroup>
      <FormGroup label="Report link" fieldId="link-field">
        {reportUrl}
      </FormGroup>
    </Form>
  );
};

export default EmailDetailsForm;
