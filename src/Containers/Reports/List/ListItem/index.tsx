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
import { ReportSchema } from '../../Layouts/types';

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
  report: ReportSchema;
  selected: string;
  setSelected: (newSelection: string) => void;
}

const ListItem: FunctionComponent<Props> = ({
  report: {
    layoutProps: { slug, description, name, tags },
  },
  selected,
  setSelected,
}) => {
  return (
    <Card
      data-testid={slug}
      onClick={() => setSelected(slug)}
      isSelectableRaised
      isSelected={selected === slug}
    >
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
};

export default ListItem;
