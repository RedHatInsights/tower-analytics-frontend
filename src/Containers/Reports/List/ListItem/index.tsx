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
} from '@patternfly/react-core';

import paths from '../../paths';
import { ReportPageParams } from '../../Shared/types';

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
`;

interface Props {
  report: ReportPageParams;
}

const ListItem: FunctionComponent<Props> = ({
  report: { slug, description, name, categories },
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
      {categories.map((category, idx) => (
        <Label key={idx}>{category}</Label>
      ))}
    </CardFooter>
  </Card>
);

export default ListItem;
