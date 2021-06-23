import React from 'react';
import PropTypes from 'prop-types';

import { CardActions } from '@patternfly/react-core';
import styled from 'styled-components';

const CardActionsWrapper = styled.div`
  margin-top: 20px;
  --pf-c-card__actions--PaddingLeft: 0;
`;

const CardActionsRow = ({ children }) => {
  return (
    <CardActionsWrapper>
      <CardActions>{children}</CardActions>
    </CardActionsWrapper>
  );
};

CardActionsRow.propTypes = {
  children: PropTypes.node,
};

export default CardActionsRow;
