import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import {
  Card,
  CardHeader,
  CardHeaderMain,
  CardTitle as PFCardTitle,
  CardBody,
  CardFooter,
  Label as PFLabel,
  Tooltip,
  TooltipPosition,
} from '@patternfly/react-core';

import paths from '../../paths';
import { TAGS } from '../../Shared/constants';
import { BaseReportProps } from '../../Layouts/types';

const CardTitle = styled(PFCardTitle)`
  word-break: break-word;
`;

const Small = styled.small`
  display: block;
  margin-bottom: 10px;
  color: #6a6e73;
  white-space: pre-line;
`;

const Label = styled(PFLabel)`
  margin-right: 10px;
  margin-bottom: 10px;
`;

interface Props {
  report: BaseReportProps;
  selected: string;
  setSelected: (newSelection: string) => void;
}

const ListItem: FunctionComponent<Props> = ({
  report: { slug, description, name, tags },
  selected,
  setSelected,
}) => {
  return (
    <Card
      data-cy={slug}
      isSelectableRaised
      isSelected={selected === slug}
      onClick={() => {
        setSelected(slug);
      }}
    >
      <CardHeader>
        <CardHeaderMain>
          <CardTitle onClick={(event) => event.stopPropagation()}>
            <Tooltip content={<div>Click to go to report details</div>}>
              <Link to={paths.getDetails(slug)}>{name}</Link>
            </Tooltip>
          </CardTitle>
        </CardHeaderMain>
      </CardHeader>
      <CardBody>
        {description ? (
          <Tooltip
            content={<div>Show report in preview</div>}
            position="bottom"
          >
            <Small>{description}</Small>
          </Tooltip>
        ) : null}
      </CardBody>
      <CardFooter>
        {tags.map((tagKey, idx) => {
          const tag = TAGS.find((t) => t.key === tagKey);
          if (tag) {
            return (
              <Tooltip
                key={`tooltip_${idx}`}
                position={TooltipPosition.top}
                content={tag.description}
              >
                <Label key={idx}>{tag.name}</Label>
              </Tooltip>
            );
          }
        })}
      </CardFooter>
    </Card>
  );
};

export default ListItem;
