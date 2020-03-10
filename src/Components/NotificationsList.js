import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
    Alert,
    AlertGroup,
    AlertVariant
} from '@patternfly/react-core';
import { ArrowIcon as PFArrowIcon } from '@patternfly/react-icons';
import LoadingState from '../Components/LoadingState';

const ArrowIcon = styled(PFArrowIcon)`
  margin-left: 7px;
`;

const AllNotificationTemplate = ({ notifications }) =>
    notifications.map(
        ({ date, message, label, notification_id: id, tower_url: url }) => {
            if (label === '' || label === 'notice') {
                return (
                    <Alert
                        title="Notice"
                        variant={ AlertVariant.default }
                        isInline
                        key={ date + '-' + id }
                        style={ { marginTop: 'var(--pf-c-alert-group__item--MarginTop)' } }
                    >
                        { message }{ ' ' }
                        { url ? (
                            <a target="_blank" rel="noopener noreferrer" href={ url }>
                                <ArrowIcon />
                            </a>
                        ) : null }
                    </Alert>
                );
            }

            if (label === 'error') {
                return (
                    <Alert
                        title={ message.split(':')[0] || 'Error' }
                        variant={ AlertVariant.danger }
                        isInline
                        key={ date + '-' + id }
                        style={ { marginTop: 'var(--pf-c-alert-group__item--MarginTop)' } }
                    >
                        { message.split(':')[1] || message }{ ' ' }
                        { url ? (
                            <a target="_blank" rel="noopener noreferrer" href={ url }>
                                <ArrowIcon />
                            </a>
                        ) : null }
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
                        { message }{ ' ' }
                        { url ? (
                            <a target="_blank" rel="noopener noreferrer" href={ url }>
                                <ArrowIcon />
                            </a>
                        ) : null }
                    </Alert>
                );
            }
        }
    );

const ErrorNotificationTemplate = ({ notifications }) =>
    notifications
    .filter(notification => notification.label === 'error')
    .map(({ message, date, notification_id: id, tower_url: url }) => (
        <Alert
            title={ message.split(':')[0] || 'Error' }
            variant={ AlertVariant.danger }
            isInline
            key={ date + '-' + id }
            style={ { marginTop: 'var(--pf-c-alert-group__item--MarginTop)' } }
        >
            { message.split(':')[1] || message }{ ' ' }
            { url ? (
                <a target="_blank" rel="noopener noreferrer" href={ url }>
                    <ArrowIcon />
                </a>
            ) : null }
        </Alert>
    ));

const NoticeNotificationTemplate = ({ notifications }) =>
    notifications
    .filter(notification => notification.label === 'notice')
    .map(({ message, date, notification_id: id, tower_url: url }) => (
        <Alert
            title="Notice"
            variant={ AlertVariant.default }
            isInline
            key={ date + '-' + id }
            style={ { marginTop: 'var(--pf-c-alert-group__item--MarginTop)' } }
        >
            { message }{ ' ' }
            { url ? (
                <a target="_blank" rel="noopener noreferrer" href={ url }>
                    <ArrowIcon />
                </a>
            ) : null }
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
            { message }{ ' ' }
            <a target="_blank" rel="noopener noreferrer" href={ url }>
                <ArrowIcon />
            </a>
        </Alert>
    ));

const NotificationsList = ({ filterBy, notifications }) => (
  <>
    <AlertGroup>
        { notifications.length <= 0 && <LoadingState /> }
        { filterBy === '' && (
            <AllNotificationTemplate notifications={ notifications } />
        ) }
        { filterBy === 'notice' && (
            <NoticeNotificationTemplate notifications={ notifications } />
        ) }
        { filterBy === 'error' && (
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
