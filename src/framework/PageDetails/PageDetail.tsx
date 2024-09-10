import { DescriptionListTerm } from '@patternfly/react-core/dist/dynamic/components/DescriptionList';
import { DescriptionListDescription } from '@patternfly/react-core/dist/dynamic/components/DescriptionList';
import { DescriptionListGroup } from '@patternfly/react-core/dist/dynamic/components/DescriptionList';
import React, { ReactNode } from 'react';
import { StandardPopover } from '../components/StandardPopover';

export function PageDetail(props: {
  label?: string;
  children?: ReactNode;
  helpText?: string | ReactNode;
  isEmpty?: boolean;
}) {
  const { label, children, helpText, isEmpty } = props;
  if (children === null || typeof children === 'undefined' || children === '') {
    return <></>;
  }
  if (isEmpty) {
    return <></>;
  }

  return (
    <DescriptionListGroup>
      {label && (
        <DescriptionListTerm>
          {label}
          {helpText ? (
            <StandardPopover header={label} content={helpText} />
          ) : null}
        </DescriptionListTerm>
      )}
      <DescriptionListDescription
        id={label?.toLowerCase().split(' ').join('-')}
      >
        {children}
      </DescriptionListDescription>
    </DescriptionListGroup>
  );
}
