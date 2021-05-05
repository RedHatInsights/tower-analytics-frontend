import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';

import {
    NotificationDrawerList as PFNotificationDrawerList,
    NotificationDrawerListItem as PFNotificationDrawerListItem,
    NotificationDrawerListItemBody,
    NotificationDrawerListItemHeader
} from '@patternfly/react-core';

import { ExternalLinkAltIcon as PFExternalLinkAltIcon } from '@patternfly/react-icons';
import LoadingState from '../Components/LoadingState';
import { capitalize } from '../Utilities/helpers';

const ExternalLinkAltIcon = styled(PFExternalLinkAltIcon)`
  margin-left: 7px;
  color: var(--pf-global--Color--400);
  font-size: 14px;
`;

const NotificationDrawerListItem = styled(PFNotificationDrawerListItem)`
  border-top: 1px solid var(--pf-global--BorderColor--light-100);
  border-bottom::nth-child(odd): 1px solid var(--pf-global--BorderColor--light-100);
  box-shadow: none;
  &:focus {
    outline: none;
  }
`;

const NotificationDrawerList = styled(PFNotificationDrawerList)`
  &:last-child {
    border-bottom: 1px solid var(--pf-global--BorderColor--light-100);
  }
`;

const AllNotificationTemplate = ({ notifications }) =>
    notifications.map(
        ({ date, message, label, notification_id: id, tower_url: url }) => {
            if (label === '' || label === 'notice') {
                return (
                    <NotificationDrawerListItem variant="info" key={date + '-' + id}>
                        <NotificationDrawerListItemHeader
                            variant="info"
                            title={
                                <>
                                    {url ? (
                                        <a target="_blank" rel="noopener noreferrer" href={url}>
                                            {capitalize(label)}
                                            <ExternalLinkAltIcon />
                                        </a>
                                    ) : (
                                        capitalize(label)
                                    )}
                                </>
                            }
                        />
                        <NotificationDrawerListItemBody>
                            {message}{' '}
                        </NotificationDrawerListItemBody>
                    </NotificationDrawerListItem>
                );
            }

            if (label === 'error') {
                return (
                    <NotificationDrawerListItem variant="danger" key={date + '-' + id}>
                        <NotificationDrawerListItemHeader
                            variant="danger"
                            title={
                                <>
                                    {url ? (
                                        <a target="_blank" rel="noopener noreferrer" href={url}>
                                            {capitalize(label)}
                                            <ExternalLinkAltIcon />
                                        </a>
                                    ) : (
                                        capitalize(label)
                                    )}
                                </>
                            }
                        />
                        <NotificationDrawerListItemBody timestamp={<DateFormat date={date} />}>
                            {message}{' '}
                        </NotificationDrawerListItemBody>
                    </NotificationDrawerListItem>
                );
            }

            if (label === 'warning') {
                return (
                    <NotificationDrawerListItem variant="warning" key={date + '-' + id}>
                        <NotificationDrawerListItemHeader
                            variant="warning"
                            title={
                                <>
                                    {url ? (
                                        <a target="_blank" rel="noopener noreferrer" href={url}>
                                            {capitalize(label)}
                                            <ExternalLinkAltIcon />
                                        </a>
                                    ) : (
                                        capitalize(label)
                                    )}
                                </>
                            }
                        />
                        <NotificationDrawerListItemBody timestamp={<DateFormat date={date} />}>
                            {message}{' '}
                        </NotificationDrawerListItemBody>
                    </NotificationDrawerListItem>
                );
            }
        }
    );

const ErrorNotificationTemplate = ({ notifications }) =>
    notifications
    .filter(notification => notification.label === 'error')
    .map(({ message, date, label, notification_id: id, tower_url: url }) => (
        <NotificationDrawerListItem variant="danger" key={date + '-' + id}>
            <NotificationDrawerListItemHeader
                variant="danger"
                title={
                    <>
                        {url ? (
                            <a target="_blank" rel="noopener noreferrer" href={url}>
                                {capitalize(label)}
                                <ExternalLinkAltIcon />
                            </a>
                        ) : (
                            capitalize(label)
                        )}
                    </>
                }
            />
            <NotificationDrawerListItemBody timestamp={<DateFormat date={date} />}>
                {message}{' '}
            </NotificationDrawerListItemBody>
        </NotificationDrawerListItem>
    ));

const NoticeNotificationTemplate = ({ notifications }) =>
    notifications
    .filter(notification => notification.label === 'notice')
    .map(({ message, date, label, notification_id: id, tower_url: url }) => (
        <NotificationDrawerListItem variant="info" key={date + '-' + id}>
            <NotificationDrawerListItemHeader
                variant="info"
                title={
                    <>
                        {url ? (
                            <a target="_blank" rel="noopener noreferrer" href={url}>
                                {capitalize(label)}
                                <ExternalLinkAltIcon />
                            </a>
                        ) : (
                            capitalize(label)
                        )}
                    </>
                }
            />
            <NotificationDrawerListItemBody timestamp={<DateFormat date={date} />}>
                {message}{' '}
            </NotificationDrawerListItemBody>
        </NotificationDrawerListItem>
    ));

const WarningNotificationTemplate = ({ notifications }) =>
    notifications
    .filter(notification => notification.label === 'warning')
    .map(({ message, date, label, notification_id: id, tower_url: url }) => (
        <NotificationDrawerListItem variant="warning" key={date + '-' + id}>
            <NotificationDrawerListItemHeader
                variant="warning"
                title={
                    <>
                        {url ? (
                            <a target="_blank" rel="noopener noreferrer" href={url}>
                                {capitalize(label)}
                                <ExternalLinkAltIcon />
                            </a>
                        ) : (
                            capitalize(label)
                        )}
                    </>
                }
            />
            <NotificationDrawerListItemBody timestamp={<DateFormat date={date} />}>
                {message}{' '}
            </NotificationDrawerListItemBody>
        </NotificationDrawerListItem>
    ));

const NotificationsList = ({ filterBy, notifications }) => (
    <>
        <NotificationDrawerList>
            {notifications.length <= 0 && <LoadingState />}
            {filterBy === '' && (
                <AllNotificationTemplate notifications={notifications} />
            )}
            {filterBy === 'notice' && (
                <NoticeNotificationTemplate notifications={notifications} />
            )}
            {filterBy === 'error' && (
                <ErrorNotificationTemplate notifications={notifications} />
            )}
            {filterBy === 'warning' && (
                <WarningNotificationTemplate notifications={notifications} />
            )}
        </NotificationDrawerList>
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
