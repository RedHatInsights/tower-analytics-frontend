import React, { FunctionComponent } from 'react';
import { CardActions } from '@patternfly/react-core';
import styled from 'styled-components';

const CardActionsWrapper = styled.div`
  margin-top: 20px;
  --pf-c-card__actions--PaddingLeft: 0;
`;

interface Props {
  children: React.ReactChild | React.ReactChildren;
}

const CardActionsRow: FunctionComponent<Props> = ({ children }) => {
  return (
    <CardActionsWrapper>
      <CardActions>{children}</CardActions>
    </CardActionsWrapper>
  );
};

export default CardActionsRow;
