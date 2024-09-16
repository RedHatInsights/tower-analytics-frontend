import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
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

const SCardTitle = styled(CardTitle)`
  word-break: break-word;
`;

const Small = styled.small`
  display: block;
  margin-bottom: 10px;
  color: #6a6e73;
  white-space: pre-line;
`;

const SLabel = styled(Label)`
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
      isSelectable
      isSelected={selected === slug}
      onClick={() => {
        setSelected(slug);
      }}
    >
      <CardHeader
        actions={
          <>
            <SCardTitle onClick={(event) => event.stopPropagation()}>
              <Tooltip content={<div>Click to go to report details</div>}>
                <Link to={paths.getDetails(slug)}>{name}</Link>
              </Tooltip>
            </SCardTitle>
          </>
        }
      />
      <CardBody>
        {description ? (
          <Tooltip
            content={<div>Show report in preview</div>}
            position='bottom'
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
