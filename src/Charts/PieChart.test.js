
import { shallow } from 'enzyme';
import PieChart from './PieChart.js';

describe('Charts/PieChart', () => {
    it('PieChart loads', () => {
        expect(PieChart).toBeTruthy();
    });
    it('should render successfully', () => {
        shallow(<PieChart />);
    });
});
