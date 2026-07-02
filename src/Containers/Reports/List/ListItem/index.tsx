import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
} from '@patternfly/react-core/dist/dynamic/components/Card';
import { Label } from '@patternfly/react-core/dist/dynamic/components/Label';
import { TooltipPosition } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { BaseReportProps } from '../../Layouts/types';
import { TAGS } from '../../Shared/constants';
import paths from '../../paths';

const Small = styled.small`
  display: block;
  margin-bottom: 10px;
  color: inherit;
  white-space: pre-line;
`;

const SLabel = styled(Label)`
  margin-right: 10px;
  margin-bottom: 10px;
`;

interface Props {
  report: BaseReportProps;
}

const ListItem: FunctionComponent<Props> = ({
  report: { slug, description, name, tags },
}) => {
  return (
    <Card
      data-cy={slug}
    >
      <CardTitle>
        <Link to={paths.getDetails(slug)}>{name}</Link>
      </CardTitle>
      <CardBody>
        {description ? <Small>{description}</Small> : null}
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
                <SLabel key={idx}>{tag.name}</SLabel>
              </Tooltip>
            );
          }
        })}
      </CardFooter>
    </Card>
  );
};

export default ListItem;
