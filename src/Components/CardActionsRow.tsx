import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

const CardActionsWrapper = styled.div`
  margin-top: 20px;
  --pf-v6-c-card__actions--PaddingLeft: 0;
`;

interface Props {
  children: React.ReactNode;
}

const CardActionsRow: FunctionComponent<Props> = ({ children }) => {
  return <CardActionsWrapper>{children}</CardActionsWrapper>;
};

export default CardActionsRow;
