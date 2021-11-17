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
import { ReportPageParams } from '../../Shared/types';
import { TAGS } from '../../Shared/constants';

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
  report: ReportPageParams;
}

const ListItem: FunctionComponent<Props> = ({
  report: { slug, description, name, tags },
}) => (
  <Card data-testid={slug}>
    <CardHeader>
      <CardHeaderMain>
        <CardTitle>
          <Link to={paths.getDetails(slug)}>{name}</Link>
        </CardTitle>
      </CardHeaderMain>
    </CardHeader>
    <CardBody>{description ? <Small>{description}</Small> : null}</CardBody>
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

export default ListItem;
