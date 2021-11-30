import React, { FunctionComponent } from 'react';
import { ExpandableRowContent, Td } from '@patternfly/react-table';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
import { Template } from './types';

interface Props {
  template: Template;
}

const ExpandedRowContents: FunctionComponent<Props> = ({ template }) => (
  <Td colSpan={5}>
    <ExpandableRowContent>
      <DescriptionList columnModifier={{ default: '3Col' }}>
        <DescriptionListGroup>
          <DescriptionListTerm>ID</DescriptionListTerm>
          <DescriptionListDescription>{template.id}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Elapsed</DescriptionListTerm>
          <DescriptionListDescription>
            {template.elapsed} seconds
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Host count</DescriptionListTerm>
          <DescriptionListDescription>
            {template.host_count}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Total count</DescriptionListTerm>
          <DescriptionListDescription>
            {template.total_count}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Total org count</DescriptionListTerm>
          <DescriptionListDescription>
            {template.total_org_count}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Total cluster count</DescriptionListTerm>
          <DescriptionListDescription>
            {template.total_cluster_count}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Total inventory count</DescriptionListTerm>
          <DescriptionListDescription>
            {template.total_inventory_count}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </ExpandableRowContent>
  </Td>
);

export default ExpandedRowContents;
