import {
  Label,
  LabelGroup,
} from '@patternfly/react-core/dist/dynamic/components/Label';
import React from 'react';

export function LabelsCell(props: { labels: string[] }) {
  return (
    <LabelGroup numLabels={999} style={{ flexWrap: 'nowrap' }}>
      {props.labels.map((label) => (
        <Label key={label}>{label}</Label>
      ))}
    </LabelGroup>
  );
}
