import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { FormGroup } from '@patternfly/react-core/dist/dynamic/components/Form';
import { Popover } from '@patternfly/react-core/dist/dynamic/components/Popover';
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/outlined-question-circle-icon';
import React, { ReactNode } from 'react';

export type PageFormGroupProps = Pick<
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
