/*global describe, it, expect*/
import { mount } from 'enzyme';
import NotificationsList from './NotificationsList/';

describe('Components/NotificationsList', () => {
    /*eslint camelcase: ["error", {properties: "never"}]*/
    const notifications = [
        {
            date: '2019-04-30T15:06:40.995',
            label: 'message',
            message: 'Regular message number 1',
            notification_id: 1,
            notification_severity_id: 1,
            notification_type_id: 1,
            tenant_id: 4
        },
        {
            date: '2019-05-30T15:06:40.995',
            label: 'warning',
            message: 'Warning message number 1',
            notification_id: 2,
            notification_severity_id: 2,
            notification_type_id: 2,
            tenant_id: 5
        },
        {
            date: '2019-06-30T15:07:40.995',
            label: 'error',
            message: 'Error message',
            notification_id: 3,
            notification_severity_id: 2,
            notification_type_id: 2,
            tenant_id: 6
        }
    ];
    const options = [
        {
            value: 'please choose',
            label: 'Select Notification Type',
            disabled: true
        },
        { value: 'error', label: 'View Danger', disabled: false },
        { value: 'all', label: 'View All', disabled: false }
    ];
    const filterBy = 'all';
    const onNotificationChange = () => {};
    it('should render successfully', () => {
        mount(
            <NotificationsList
                notifications={ notifications }
                options={ options }
                filterBy={ filterBy }
                onNotificationChange={ onNotificationChange }
            />
        );
    });
    it('should render all notifications by default', () => {
        const wrapper = mount(
            <NotificationsList
                notifications={ notifications }
                options={ options }
                filterBy={ filterBy }
                onNotificationChange={ onNotificationChange }
            />
        );
        const notificationTemplate = wrapper.find('NotificationTemplate');
        const dataListItem = notificationTemplate.find('DataListItem');
        expect(dataListItem.length).toEqual(notifications.length);
    });
    it('should render ErrorNotificationsTemplate successfully', () => {
        const filterBy = 'error';
        mount(
            <NotificationsList
                notifications={ notifications }
                options={ options }
                filterBy={ filterBy }
                onNotificationChange={ onNotificationChange }
            />
        );
    });
    it('ErrorNotificationsTemplate should render only error type notifications', () => {
        const filterBy = 'error';
        const wrapper = mount(
            <NotificationsList
                notifications={ notifications }
                options={ options }
                filterBy={ filterBy }
                onNotificationChange={ onNotificationChange }
            />
        );
        const notificationTemplate = wrapper.find('ErrorNotificationTemplate');
        const dataListItem = notificationTemplate.find('DataListItem');
        expect(dataListItem.length).toEqual(
            notifications.filter(notification => notification.label === 'error')
            .length
        );
    });
});
