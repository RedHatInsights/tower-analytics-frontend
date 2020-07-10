
import { shallow } from 'enzyme';
import HostsBarChart from './HostsBarChart.js';

describe('Charts/HostsBarChart', () => {
    it('HostsBarChart loads', () => {
        expect(HostsBarChart).toBeTruthy();
    });
    it('should render successfully', () => {
        shallow(<HostsBarChart />);
    });
});
