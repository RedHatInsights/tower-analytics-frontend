import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  Card as PFCard,
  CardBody as PFCardBody,
  ExpandableSection as PFExpandable,
} from '@patternfly/react-core';

const Card = styled(PFCard)`
  background-color: var(--pf-global--BackgroundColor--200);
  overflow-wrap: break-word;
`;

const CardBody = styled(PFCardBody)`
  max-height: 200px;
  overflow: scroll;
`;

const Expandable = styled(PFExpandable)`
  text-align: left;

  & .pf-c-expandable__toggle {
    padding-left: 10px;
    margin-left: 5px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
`;

function ErrorDetail({ error }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Expandable
      toggleText={'Details'}
      onToggle={handleToggle}
      isExpanded={isExpanded}
    >
      <Card>
        <CardBody>
          {Array.isArray(error) ? (
            <ul>
              {error.map((m) =>
                typeof m === 'string' ? <li key={m}>{m}</li> : null
              )}
            </ul>
          ) : (
            error
          )}
        </CardBody>
      </Card>
    </Expandable>
  );
}

ErrorDetail.propTypes = {
  error: PropTypes.arrayOf(PropTypes.string),
};

export default ErrorDetail;
