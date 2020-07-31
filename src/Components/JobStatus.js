import React from 'react';
import PropTypes from 'prop-types';
import { Label } from '@patternfly/react-core';
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    ClockIcon,
    SyncAltIcon,
    ExclamationTriangleIcon
} from '@patternfly/react-icons';

const JobStatus = ({ status }) => {
    const capitalized = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const getColor = () => {
        switch (status) {
            case 'successful':
                return 'green';
            case 'failed':
            case 'error':
                return 'red';
            case 'running':
            case 'pending':
                return 'blue';
            case 'canceled':
                return 'orange';
            // case new, waiting
            default: return 'grey';
        }
    };

    const getIcon = () => {
        switch (status) {
            case 'successful':
                return <CheckCircleIcon />;
            case 'failed':
            case 'error':
                return <ExclamationCircleIcon />;
            case 'running':
                return <SyncAltIcon />;
            case 'canceled':
                return <ExclamationTriangleIcon />;
            // case new, waiting, pending
            default: return <ClockIcon />;
        }
    };

    return (
        <Label variant="outline" color={ getColor() } icon={ getIcon() }>{ capitalized(status) }</Label>
    );
};

JobStatus.propTypes = {
    status: PropTypes.oneOf([
        'successful',
        'failed', 'error',
        'running',
        'new', 'waiting', 'pending', 'canceled'
    ])
};

export default JobStatus;
