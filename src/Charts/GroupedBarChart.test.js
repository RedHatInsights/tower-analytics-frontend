
import { shallow } from 'enzyme';
import GroupedBarChart from './GroupedBarChart.js';

describe('Charts/GroupedBarChart', () => {
    it('GroupedBarChart loads', () => {
        expect(GroupedBarChart).toBeTruthy();
    });
    it('should render successfully', () => {
        shallow(<GroupedBarChart />);
    });
});
