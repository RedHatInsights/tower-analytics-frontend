import React from 'react';
import PropTypes from 'prop-types';
import { Label } from '@patternfly/react-core';
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    ClockIcon,
    SyncAltIcon,
<<<<<<< HEAD
    ExclamationTriangleIcon
=======
    TimesCircleIcon
>>>>>>> Feature: added a better component for displaying a job's status
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
<<<<<<< HEAD
            case 'pending':
                return 'blue';
            case 'canceled':
                return 'orange';
            // case new, waiting
=======
                return 'blue';
            // case new, waiting, pending, canceled
>>>>>>> Feature: added a better component for displaying a job's status
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
<<<<<<< HEAD
                return <ExclamationTriangleIcon />;
=======
                return <TimesCircleIcon />;
>>>>>>> Feature: added a better component for displaying a job's status
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
