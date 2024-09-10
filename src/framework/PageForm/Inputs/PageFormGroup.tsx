import {
  Button,
  FormGroup,
  FormGroupProps,
  Popover,
} from '@patternfly/react-core';
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import React, { ReactNode } from 'react';

export type PageFormGroupProps = Pick<
  FormGroupProps,
  'children' | 'helperText' | 'helperTextInvalid' | 'isRequired' | 'label'
> & { id?: string; labelHelpTitle?: string; labelHelp?: ReactNode };

/** Wrapper over the PatternFly FormGroup making it optional based on if label is given. */
export function PageFormGroup(props: PageFormGroupProps) {
  const { children, helperText, helperTextInvalid, isRequired, label } = props;
  return (
    <FormGroup
      id={`${props.id ?? ''}-form-group`}
      fieldId={props.id}
      label={label}
      helperText={helperText}
      helperTextInvalid={helperTextInvalid}
      validated={helperTextInvalid ? 'error' : undefined}
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
    </FormGroup>
  );
}