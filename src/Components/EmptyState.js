/*eslint max-len: ["error", { "ignoreStrings": true }]*/
import React from 'react';
import PropTypes from 'prop-types';
import {
    Title,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    EmptyStateBody
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

const DefaultEmptyState = ({ error }) => (
    <EmptyState variant={ EmptyStateVariant.full }>
        <EmptyStateIcon icon={ CubesIcon } />
        { error.status === 404 && (
            <>
                <Title headingLevel="h5" size="lg">
                    No Data Found.
                </Title>
                <EmptyStateBody>
                    Please visit <a href='https://docs.ansible.com/ansible-tower/latest/html/administration/usability_data_collection.html#automation-insights' target='_blank' rel='noopener noreferrer'>here</a> to learn how to enable Automation Analytics.
                </EmptyStateBody>
            </>
        ) }
        { error.status === 401 && (
            <>
                <Title headingLevel="h5" size="lg">
                    Not Authorized
                </Title>
                <EmptyStateBody>
                    You do not have the correct permissions to view this page.
                </EmptyStateBody>
            </>
        ) }
    </EmptyState>
);

DefaultEmptyState.propTypes = {
    error: PropTypes.object
};

export default DefaultEmptyState;
