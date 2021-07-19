import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';
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

const CardTitle = styled(PFCardTitle)`
  word-break: break-word;
`;

const Small = styled.small`
  display: block;
  margin-bottom: 10px;
  color: #6a6e73;
`;

const Label = styled(PFLabel)`
  margin-right: 10px;
`;

const ListItem = ({ report }) => {
  const { id, description, name, categories } = report;

  const match = useRouteMatch();

  return (
    <Card>
      <CardHeader>
        <CardHeaderMain>
          <CardTitle>
            <Link to={`${match.url}/${id}`}>{name}</Link>
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
};

ListItem.propTypes = {
  report: PropTypes.object,
};

export default ListItem;
