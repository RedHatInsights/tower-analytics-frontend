import { mount } from 'enzyme';
import NotificationsList from './NotificationsList/';

describe('Components/NotificationsList', () => {
    /*eslint camelcase: ["error", {properties: "never"}]*/
    const notifications = [
        {
            date: '2019-04-30T15:06:40.995',
            label: 'notice',
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
        { value: 'error', label: 'View error', disabled: false },
        { value: 'warning', label: 'View warning', disabled: false },
        { value: 'notice', label: 'View notice', disabled: false },
        { value: '', label: 'View all', disabled: false }
    ];
    const filterBy = '';
    const onNotificationChange = () => {};

    it('Should render successfully', () => {
        mount(
            <NotificationsList
                notifications={ notifications }
                options={ options }
                filterBy={ filterBy }
                onNotificationChange={ onNotificationChange }
            />
        );
    });
    it('Should render all notifications by default', () => {
        const wrapper = mount(
            <NotificationsList
                notifications={ notifications }
                options={ options }
                filterBy={ filterBy }
                onNotificationChange={ onNotificationChange }
            />
        );
        const notificationTemplate = wrapper.find('AllNotificationTemplate');
        const alertItem = notificationTemplate.find('Alert');
        expect(alertItem.length).toEqual(notifications.length);
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
        const alertItem = notificationTemplate.find('Alert');
        expect(alertItem.length).toEqual(
            notifications.filter(notification => notification.label === 'error')
            .length
        );
    });
    it('WarningNotificationTemplate should render only warning type notifications', () => {
        const filterBy = 'warning';
        const wrapper = mount(
            <NotificationsList
                notifications={ notifications }
                options={ options }
                filterBy={ filterBy }
                onNotificationChange={ onNotificationChange }
            />
        );
        const notificationTemplate = wrapper.find('WarningNotificationTemplate');
        const alertItem = notificationTemplate.find('Alert');
        expect(alertItem.length).toEqual(
            notifications.filter(notification => notification.label === 'warning')
            .length
        );
    });
    it('NoticeNotificationsTemplate should render only notice type notifications', () => {
        const filterBy = 'notice';
        const wrapper = mount(
            <NotificationsList
                notifications={ notifications }
                options={ options }
                filterBy={ filterBy }
                onNotificationChange={ onNotificationChange }
            />
        );
        const notificationTemplate = wrapper.find('NoticeNotificationTemplate');
        const alertItem = notificationTemplate.find('Alert');
        expect(alertItem.length).toEqual(
            notifications.filter(notification => notification.label === 'notice')
            .length
        );
    });
});
