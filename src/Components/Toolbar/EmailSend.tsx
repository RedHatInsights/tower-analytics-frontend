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
  emailInfo: Record<string, string>;
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

  const [showError, setShowError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Form>
      <FormGroup label="Recipient" isRequired fieldId="recipient-field">
        <Select
          variant={SelectVariant.single}
          aria-label={'Recipient'}
          isOpen={isExpanded}
          onClear={() => setShowError(!recipient)}
          onToggle={() => setIsExpanded(!isExpanded)}
          onSelect={(_, selection) => {
            onInputChange('recipient', selection as string);
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
      <FormGroup label="Subject" fieldId="subject-field">
        <TextInput
          placeholder="Report is ready to be downloaded"
          type="text"
          id="subject"
          name="subject"
          value={subject}
          onChange={(e) => onInputChange('subject', e)}
        />
      </FormGroup>
      <FormGroup label="Body" fieldId="body-field">
        <TextArea
          placeholder=""
          type="text"
          id="body"
          name="body"
          value={body}
          onChange={(e) => onInputChange('body', e)}
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