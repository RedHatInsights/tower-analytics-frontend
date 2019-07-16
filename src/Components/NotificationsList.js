import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
    DataList,
    DataListItem as PFDataListItem,
    DataListCell,
    FormSelect,
    FormSelectOption
} from '@patternfly/react-core';

import { WarningTriangleIcon } from '@patternfly/react-icons';

const DataListItem = styled(PFDataListItem)`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-content: center;
  padding: 10px 15px;

  &:last-of-type {
    border-bottom: 1px solid var(--pf-global--BorderColor--100);
  }
`;

const colors = { error: '#db524b', warning: '#f0ad37', '': '' };

const NotificationTemplate = ({ notifications }) =>
    notifications.map(notification => (
        <DataListItem
            aria-labelledby="notifications-detail"
            key={ notification.date }
        >
            <DataListCell>
                <span>
                    { notification.label === 'error' ||
          notification.label === 'warning' ? (
                            <WarningTriangleIcon
                                style={ {
                                    color: colors[notification.label],
                                    marginRight: '5px'
                                } }
                            />
                        ) : null }
                    { notification.message }
                </span>
            </DataListCell>
        </DataListItem>
    ));

const ErrorNotificationTemplate = ({ notifications }) =>
    notifications
    .filter(notification => notification.label === 'error')
    .map(notification => (
        <DataListItem
            aria-labelledby="notifications-detail"
            key={ notification.date }
        >
            <DataListCell>
                <span>
                    { notification.label === 'error' ||
            notification.label === 'warning' ? (
                            <WarningTriangleIcon
                                style={ {
                                    color: colors[notification.label],
                                    marginRight: '5px'
                                } }
                            />
                        ) : null }
                    { notification.message }
                </span>
            </DataListCell>
        </DataListItem>
    ));

const NotificationsList = ({
    filterBy,
    onNotificationChange,
    options,
    notifications
}) => (
    <DataList style={ { flex: '1' } } aria-label="Notifications List">
        <DataListItem aria-labelledby="notifications-header">
            <DataListCell>
                <h3>Notifications</h3>
            </DataListCell>
            <DataListCell>
                <FormSelect
                    value={ filterBy }
                    onChange={ onNotificationChange }
                    aria-label="Select Notification Type"
                    style={ { margin: '2px 10px' } }
                >
                    { options.map((option, index) => (
                        <FormSelectOption
                            isDisabled={ option.disabled }
                            key={ index }
                            value={ option.value }
                            label={ option.label }
                        />
                    )) }
                </FormSelect>
            </DataListCell>
        </DataListItem>
        { filterBy === 'all' && (
            <NotificationTemplate notifications={ notifications } />
        ) }
        { filterBy === 'error' && (
            <ErrorNotificationTemplate notifications={ notifications } />
        ) }
    </DataList>
);

NotificationTemplate.propTypes = {
    notifications: PropTypes.array
};

NotificationsList.propTypes = {
    notifications: PropTypes.array,
    options: PropTypes.array,
    filterBy: PropTypes.string,
    onNotificationChange: PropTypes.func
};

export default NotificationsList;
