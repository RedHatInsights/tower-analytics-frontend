import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import {
  FormGroup,
  FormHelperText,
} from '@patternfly/react-core/dist/dynamic/components/Form';
import {
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core/dist/dynamic/components/HelperText';
import { Popover } from '@patternfly/react-core/dist/dynamic/components/Popover';
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/outlined-question-circle-icon';
import React, { ReactNode } from 'react';

export type PageFormGroupProps = {
  children?: ReactNode;
  helperText?: string;
  helperTextInvalid?: string;
  id?: string;
  isRequired?: boolean;
  label?: string;
  labelHelp?: ReactNode;
  labelHelpTitle?: string;
};

/** Wrapper over the PatternFly FormGroup making it optional based on if label is given. */
export function PageFormGroup(props: PageFormGroupProps) {
  const { children, helperText, helperTextInvalid, isRequired, label } = props;

  return (
    <FormGroup
      id={`${props.id ?? ''}-form-group`}
      fieldId={props.id}
      label={label}
      isRequired={isRequired}
      labelIcon={
        props.labelHelp ? (
          <Popover
            headerContent={props.labelHelpTitle}
            bodyContent={props.labelHelp}
            position='bottom-start'
          >
            <Button variant='link' isInline>
              <OutlinedQuestionCircleIcon />
            </Button>
          </Popover>
        ) : undefined
      }
    >
      {children}
      {helperTextInvalid || helperText ? (
        <FormHelperText>
          <HelperText>
            <HelperTextItem variant={helperTextInvalid ? 'error' : 'default'}>
              {helperTextInvalid || helperText}
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      ) : null}
    </FormGroup>
  );
}
