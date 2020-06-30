
import { shallow } from 'enzyme';
import OrganizationStatistics from './OrganizationStatistics.js';

describe('Containers/OrganizationStatistics', () => {
    it('OrganizationStatistics loads', () => {
        expect(OrganizationStatistics).toBeTruthy();
    });
    it('should render successfully', () => {
        shallow(<OrganizationStatistics />);
    });
});
