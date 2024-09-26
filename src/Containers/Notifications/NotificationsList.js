import { NotificationDrawerList } from '@patternfly/react-core/dist/dynamic/components/NotificationDrawer';
import { NotificationDrawerListItem } from '@patternfly/react-core/dist/dynamic/components/NotificationDrawer';
import { NotificationDrawerListItemHeader } from '@patternfly/react-core/dist/dynamic/components/NotificationDrawer';
import { NotificationDrawerListItemBody } from '@patternfly/react-core/dist/dynamic/components/NotificationDrawer';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/dynamic/icons/external-link-alt-icon';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import LoadingState from '../../Components/ApiStatus/LoadingState';
import { capitalize } from '../../Utilities/helpers';

const NLExternalLinkAltIcon = styled(ExternalLinkAltIcon)`
  margin-left: 7px;
  color: var(--pf-global--Color--400);
  font-size: 14px;
`;

const NLNotificationDrawerListItem = styled(NotificationDrawerListItem)`
  border-top: 1px solid var(--pf-global--BorderColor--light-100);
  border-bottom::nth-child(odd): 1px solid var(--pf-global--BorderColor--light-100);
  box-shadow: none;
  &:focus {
    outline: none;
  }
`;

const NLNotificationDrawerList = styled(NotificationDrawerList)`
  &:last-child {
    border-bottom: 1px solid var(--pf-global--BorderColor--light-100);
  }
`;

const stringifyDate = (date) => {
  const day = moment(date);
  const oneHour = 60 * 60 * 1000;
  const now = moment().utc();

  if (now.isAfter(day)) {
    return `${now.diff(day, 'days')} day(s) ago.`;
  }

  if (day.isSame(now, 'day')) {
    if (day.valueOf() > oneHour) {
      return `${day.diff(now, 'hours')} hour(s) ago.`;
    }

    return `${now.diff(day, 'minutes')} minute(s) ago.`;
  }
};

const AllNotificationTemplate = ({ notifications }) =>
  notifications.map(
    ({ date, message, label, notification_id: id, tower_url: url }) => {
      if (label === '' || label === 'notice') {
        return (
          <NLNotificationDrawerListItem variant='info' key={date + '-' + id}>
            <NotificationDrawerListItemHeader
              variant='info'
              title={
                <>
                  {url ? (
                    <a target='_blank' rel='noopener noreferrer' href={url}>
                      {capitalize(label)}
                      <NLExternalLinkAltIcon />
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
          </NLNotificationDrawerListItem>
        );
      }

      if (label === 'error') {
        return (
          <NLNotificationDrawerListItem variant='danger' key={date + '-' + id}>
            <NotificationDrawerListItemHeader
              variant='danger'
              title={
                <>
                  {url ? (
                    <a target='_blank' rel='noopener noreferrer' href={url}>
                      {capitalize(label)}
                      <NLExternalLinkAltIcon />
                    </a>
                  ) : (
                    capitalize(label)
                  )}
                </>
              }
            />
            <NotificationDrawerListItemBody timestamp={stringifyDate(date)}>
              {message}{' '}
            </NotificationDrawerListItemBody>
          </NLNotificationDrawerListItem>
        );
      }

      if (label === 'warning') {
        return (
          <NLNotificationDrawerListItem variant='warning' key={date + '-' + id}>
            <NotificationDrawerListItemHeader
              variant='warning'
              title={
                <>
                  {url ? (
                    <a target='_blank' rel='noopener noreferrer' href={url}>
                      {capitalize(label)}
                      <NLExternalLinkAltIcon />
                    </a>
                  ) : (
                    capitalize(label)
                  )}
                </>
              }
            />
            <NotificationDrawerListItemBody timestamp={stringifyDate(date)}>
              {message}{' '}
            </NotificationDrawerListItemBody>
          </NLNotificationDrawerListItem>
        );
      }
    }
  );

const ErrorNotificationTemplate = ({ notifications }) =>
  notifications
    .filter((notification) => notification.label === 'error')
    .map(({ message, date, label, notification_id: id, tower_url: url }) => (
      <NLNotificationDrawerListItem variant='danger' key={date + '-' + id}>
        <NotificationDrawerListItemHeader
          variant='danger'
          title={
            <>
              {url ? (
                <a target='_blank' rel='noopener noreferrer' href={url}>
                  {capitalize(label)}
                  <NLExternalLinkAltIcon />
                </a>
              ) : (
                capitalize(label)
              )}
            </>
          }
        />
        <NotificationDrawerListItemBody timestamp={stringifyDate(date)}>
          {message}{' '}
        </NotificationDrawerListItemBody>
      </NLNotificationDrawerListItem>
    ));

const NoticeNotificationTemplate = ({ notifications }) =>
  notifications
    .filter((notification) => notification.label === 'notice')
    .map(({ message, date, label, notification_id: id, tower_url: url }) => (
      <NLNotificationDrawerListItem variant='info' key={date + '-' + id}>
        <NotificationDrawerListItemHeader
          variant='info'
          title={
            <>
              {url ? (
                <a target='_blank' rel='noopener noreferrer' href={url}>
                  {capitalize(label)}
                  <NLExternalLinkAltIcon />
                </a>
              ) : (
                capitalize(label)
              )}
            </>
          }
        />
        <NotificationDrawerListItemBody timestamp={stringifyDate(date)}>
          {message}{' '}
        </NotificationDrawerListItemBody>
      </NLNotificationDrawerListItem>
    ));

const WarningNotificationTemplate = ({ notifications }) =>
  notifications
    .filter((notification) => notification.label === 'warning')
    .map(({ message, date, label, notification_id: id, tower_url: url }) => (
      <NLNotificationDrawerListItem variant='warning' key={date + '-' + id}>
        <NotificationDrawerListItemHeader
          variant='warning'
          title={
            <>
              {url ? (
                <a target='_blank' rel='noopener noreferrer' href={url}>
                  {capitalize(label)}
                  <NLExternalLinkAltIcon />
                </a>
              ) : (
                capitalize(label)
              )}
            </>
          }
        />
        <NotificationDrawerListItemBody timestamp={stringifyDate(date)}>
          {message}{' '}
        </NotificationDrawerListItemBody>
      </NLNotificationDrawerListItem>
    ));

const NotificationsList = ({ filterBy, notifications }) => (
  <>
    <NLNotificationDrawerList>
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
    </NLNotificationDrawerList>
  </>
);

AllNotificationTemplate.propTypes = {
  notifications: PropTypes.array,
};

ErrorNotificationTemplate.propTypes = {
  notifications: PropTypes.array,
};

WarningNotificationTemplate.propTypes = {
  notifications: PropTypes.array,
};

NotificationsList.propTypes = {
  notifications: PropTypes.array,
  filterBy: PropTypes.string,
};

export default NotificationsList;
