import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { ExpandableSection } from '@patternfly/react-core/dist/dynamic/components/ExpandableSection';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';

const EDCard = styled(Card)`
  background-color: var(--pf-global--BackgroundColor--200);
  overflow-wrap: break-word;
`;

const EDCardBody = styled(CardBody)`
  max-height: 200px;
  overflow: scroll;
`;

const Expandable = styled(ExpandableSection)`
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
    <>
      {Array.isArray(error) && error.length && (
        <Expandable
          toggleText={'Details'}
          onToggle={handleToggle}
          isExpanded={isExpanded}
        >
          <EDCard>
            <EDCardBody>
              <ul>
                {error.map((m) =>
                  typeof m === 'string' ? <li key={m}>{m}</li> : null,
                )}
              </ul>
            </EDCardBody>
          </EDCard>
        </Expandable>
      )}
    </>
  );
}

ErrorDetail.propTypes = {
  error: PropTypes.arrayOf(PropTypes.string),
};

export default ErrorDetail;
