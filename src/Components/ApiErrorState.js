import React from 'react';
import PropTypes from 'prop-types';
import {
    Title,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

const ApiErrorState = ({ message }) => (
    <EmptyState variant={ EmptyStateVariant.full }>
        <EmptyStateIcon icon={ CubesIcon } />
        <Title headingLevel="h5" size="lg">
            { message }
        </Title>
    </EmptyState>
);

ApiErrorState.propTypes = {
    message: PropTypes.string
};

export default ApiErrorState;
