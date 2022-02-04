import React, { FC, useState } from 'react';
import {
  Form,
  FormHelperText,
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

interface Props {
  emailInfo: {
    recipient: string[];
    subject: string;
    body: string;
    reportUrl: string;
    users: Record<string, string | string[] | any>[];
  };
  onChange: (value: any) => void;
  rbacGroups: Record<string, string | number>[];
}

const EmailSend: FC<Props> = ({
  emailInfo,
  onChange = () => null,
  rbacGroups,
}) => {
  const { body, recipient, reportUrl, subject } = emailInfo;
  const onInputChange = (field: string, val: string) => {
    onChange({ ...emailInfo, [field]: val });
  };

  const onSelectionChange = (field: string, val: string) => {
    let newVal = [val];
    // if checkbox unchecked, remove element from array
    if (emailInfo.recipient.indexOf(val) > -1) {
      newVal = emailInfo.recipient.filter((el) => el !== val);
      const pos = emailInfo.users.findIndex((object) => object.uuid === val);
      emailInfo.users.splice(pos, 1);
      emailInfo.recipient = newVal;
    } else {
      // add if checkbox checked
      newVal = emailInfo.recipient.concat(newVal);
      emailInfo.recipient = newVal;
    }
    onChange({ ...emailInfo });
  };

  const [showError, setShowError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Form>
      <FormGroup label="Recipient" isRequired fieldId="recipient-field">
        <Select
          variant={SelectVariant.checkbox}
          aria-label={'Recipient'}
          isOpen={isExpanded}
          onClear={() => setShowError(!recipient)}
          onToggle={() => setIsExpanded(!isExpanded)}
          onSelect={(e, selection) => {
            onSelectionChange('recipient', selection as string);
            setIsExpanded(false);
          }}
          selections={recipient}
          placeholderText={'Select Recipients'}
        >
          {rbacGroups.map(({ uuid, name }) => (
            <SelectOption key={uuid} value={uuid}>
              {name}
            </SelectOption>
          ))}
        </Select>
        {!recipient && showError && (
          <FormHelperText
            isError
            icon={<ExclamationCircleIcon />}
            isHidden={!showError}
          >
            Recipient field is required
          </FormHelperText>
        )}
      </FormGroup>
      {emailInfo.users.length > 0 && (
        <FormGroup label="User emails" fieldId="emails-field">
          {emailInfo.users.map(({ name, emails }, i) => {
            return (
              <p key={i}>
                {/* eslint-disable-next-line @typescript-eslint/no-unsafe-call */}
                <b>{name}</b>: {emails.join(', ')}
              </p>
            );
          })}
        </FormGroup>
      )}
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
          placeholder=""
          type="text"
          id="body"
          name="body"
          value={body}
          onChange={(value) => onInputChange('body', value)}
        />
      </FormGroup>
      <FormGroup label="Report Link" fieldId="link-field">
        <TextInput
          placeholder=""
          type="text"
          id="link"
          name="link"
          readOnly={true}
          value={reportUrl}
        />
      </FormGroup>
    </Form>
  );
};

export default EmailSend;
