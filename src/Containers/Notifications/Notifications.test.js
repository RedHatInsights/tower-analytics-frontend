
import { shallow } from 'enzyme';
import Notifications from './Notifications.js';

describe('Containers/Notifications', () => {
    it('Notifications loads', () => {
        expect(Notifications).toBeTruthy();
    });
    it('should render successfully', () => {
        shallow(<Notifications />);
    });
});
