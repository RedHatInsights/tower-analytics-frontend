import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Alert, AlertGroup, AlertVariant } from '@patternfly/react-core';
import { ArrowIcon as PFArrowIcon } from '@patternfly/react-icons';
import LoadingState from '../Components/LoadingState';
import NoData from '../Components/NoData';

const ArrowIcon = styled(PFArrowIcon)`
  margin-left: 7px;
`;

const AllNotificationTemplate = ({ notifications }) =>
    notifications.map(({ date, message, label, notification_id: id, tower_url: url }) => {
        if (label === '' || label === 'notice') {
            return (
                <Alert
                    title="Notice"
                    variant={ AlertVariant.default }
                    isInline
                    key={ date + '-' + id }
                    style={ { marginTop: 'var(--pf-c-alert-group__item--MarginTop)' } }
                >
                    { message } <a target="_blank" rel='noopener noreferrer' href={ url }><ArrowIcon /></a>
                </Alert>
            );
        }

        if (label === 'error' || label === 'critical') {
            return (
                <Alert
                    title={ message.split(':')[0] || 'Error' }
                    variant={ AlertVariant.danger }
                    isInline
                    key={ date + '-' + id }
                    style={ { marginTop: 'var(--pf-c-alert-group__item--MarginTop)' } }
                >
                    { message.split(':')[1] || message } <a target="_blank" rel='noopener noreferrer' href={ url }><ArrowIcon /></a>
                </Alert>
            );
        }

        if (label === 'warning') {
            return (
                <Alert
                    title="Warning"
                    variant={ AlertVariant.warning }
                    isInline
                    key={ date + '-' + id }
                    style={ { marginTop: 'var(--pf-c-alert-group__item--MarginTop)' } }
                >
                    { message } <a target="_blank" rel='noopener noreferrer' href={ url }><ArrowIcon /></a>
                </Alert>
            );
        }
    });

const ErrorNotificationTemplate = ({ notifications }) =>
    notifications
    .filter(notification => notification.label === 'error' || 'critical')
    .map(({ message, date, notification_id: id, tower_url: url }) => (
        <Alert
            title={ message.split(':')[0] || 'Error' }
            variant={ AlertVariant.danger }
            isInline
            key={ date + '-' + id }
            style={ { marginTop: 'var(--pf-c-alert-group__item--MarginTop)' } }
        >
            { message.split(':')[1] || message } <a target="_blank" rel='noopener noreferrer' href={ url }><ArrowIcon /></a>
        </Alert>
    ));

const WarningNotificationTemplate = ({ notifications }) =>
    notifications
    .filter(notification => notification.label === 'warning')
    .map(({ message, date, notification_id: id, tower_url: url }) => (
        <Alert
            title={ message }
            variant={ AlertVariant.warning }
            isInline
            key={ date + '-' + id }
            style={ { marginTop: 'var(--pf-c-alert-group__item--MarginTop)' } }
        >
            { message } <a target="_blank" rel='noopener noreferrer' href={ url }><ArrowIcon /></a>
        </Alert>
    ));

const NotificationsList = ({ filterBy, notifications }) => (
  <>
    <AlertGroup>
        { notifications.length <= 0 && <LoadingState /> }
        { filterBy === 'all' && (
            <AllNotificationTemplate notifications={ notifications } />
        ) }
        { !isLoading && filterBy === 'error' && (
            <ErrorNotificationTemplate notifications={ notifications } />
        ) }
        { filterBy === 'warning' && (
            <WarningNotificationTemplate notifications={ notifications } />
        ) }
    </AlertGroup>
  </>
);

AllNotificationTemplate.propTypes = {
    notifications: PropTypes.array
};

ErrorNotificationTemplate.propTypes = {
    notifications: PropTypes.array
};

WarningNotificationTemplate.propTypes = {
    notifications: PropTypes.array
};

NotificationsList.propTypes = {
    notifications: PropTypes.array,
    filterBy: PropTypes.string
};

export default NotificationsList;
