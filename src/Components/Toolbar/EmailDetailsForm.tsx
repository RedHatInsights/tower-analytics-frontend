import React, { FC, useState } from 'react';
import {
  Form,
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
  TextArea,
  TextInput,
} from '@patternfly/react-core';

type NonEmptyArray<T> = T[] & { 0: T };
interface Props {
  emailInfo: {
    recipient: NonEmptyArray<string>;
    users: [
      {
        uuid: string;
        name: string;
        emails: string[];
      }
    ];
    subject: string;
    body: string;
    reportUrl: string;
  };
  onChange: (value: any) => void;
  rbacGroups: Record<string, string | string[]>[];
}

const EmailDetailsForm: FC<Props> = ({
  emailInfo,
  onChange = () => null,
  rbacGroups,
}) => {
  const { body, recipient, reportUrl, subject } = emailInfo;
  const onInputChange = (field: string, val: string) => {
    onChange({ ...emailInfo, [field]: val });
  };

  const clearGroupSelection = () => {
    onChange({
      ...emailInfo,
      recipient: [''],
      users: [{ uuid: '', name: '', emails: [] }],
    });
  };

  const onSelectionChange = (field: string, val: string) => {
    let newVal = [val];
    // if checkbox unchecked, remove element from array
    if (emailInfo.recipient.indexOf(val) > -1) {
      newVal = emailInfo.recipient.filter((el) => el !== val);
      const pos = emailInfo.users.findIndex((object) => object.uuid === val);
      emailInfo.users.splice(pos, 1);
      newVal = newVal.length > 0 ? newVal : [''];
      emailInfo.recipient = newVal as NonEmptyArray<string>;
    } else {
      // add if checkbox checked
      newVal = emailInfo.recipient.concat(newVal);
      emailInfo.recipient = newVal as NonEmptyArray<string>;
    }
    onChange({ ...emailInfo });
  };

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Form>
      <FormGroup label="Recipient" isRequired fieldId="recipient-field">
        <Select
          variant={SelectVariant.checkbox}
          aria-label={'Recipient'}
          isOpen={isExpanded}
          onClear={() => clearGroupSelection()}
          onToggle={() => setIsExpanded(!isExpanded)}
          onSelect={(e, selection) => {
            onSelectionChange('recipient', selection as string);
            setIsExpanded(false);
          }}
          selections={recipient}
          placeholderText={'Select Recipients'}
        >
          {rbacGroups.map(({ uuid, name }, i) => (
            <SelectOption key={i} value={uuid}>
              {name}
            </SelectOption>
          ))}
        </Select>
      </FormGroup>
      {(emailInfo.users.length > 1 || emailInfo.users[0].uuid !== '') && (
        <FormGroup label="User emails" fieldId="emails-field">
          {emailInfo.users.map(({ uuid, name, emails }, i) => {
            return (
              uuid !== '' && (
                <p key={i}>
                  <b>{name}</b>: {emails.join(', ')}
                </p>
              )
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

export default EmailDetailsForm;
